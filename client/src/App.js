import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import TruffleContract from '@truffle/contract';
import CHENDollas from './build/contracts/CHENDollas.json';
import MetaMaskOnboarding from '@metamask/onboarding';
import Web3 from 'web3';

import './css/App.css';
import { ACTIONS, isMetaMaskInstalled } from './utils';

import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import Button from '@material-ui/core/Button';
import BurnForm from './ui/BurnForm';
import Link from '@material-ui/core/Link';
import MintForm from './ui/MintForm'; import MyBalanceCounter from './ui/MyBalanceCounter';
import SnackbarPopup from './ui/SnackbarPopup';
import TotalTokenSupplyCounter from './ui/TotalTokenSupplyCounter';
import TransferForm from './ui/TransferForm';
import PrinterDialog from './ui/PrinterDialog';
import TransactionsTable from './ui/TransactionsTable';

import {
  setAddress,
  getAddress,
  setDecimals,
  getDecimals,
  setLatestBlockNum,
  getLatestBlockNum,
  setIsOwner,
  getIsOwner,
} from './store/accountSlice';
import { prependRow } from './store/transactionsSlice';
import { openSnack, closeSnack } from './store/snackSlice';
import { turnOnPrinter, turnOffPrinter, turnOffPrinterAsync } from './store/printerSlice';
import { setTokenSupply } from './store/tokenSupplySlice';
import { setCurrentBalance } from './store/currentBalanceSlice';

const web3 = new Web3(Web3.givenProvider);
const BN = web3.utils.BN;

function App() {
  const onboarding = React.useRef();
  const dispatch = useDispatch();

  const accountAddress = useSelector(getAddress);
  const decimals = useSelector(getDecimals);
  const latestBlockNum = useSelector(getLatestBlockNum);
  const isOwner = useSelector(getIsOwner);

  const [initialized, setInitialized] = useState(false);
  const [CHENDollasContract, setCHENDollasContract] = useState();

  async function init() {
    if (isMetaMaskInstalled()) {
      let Contract = TruffleContract(CHENDollas);
      Contract.setProvider(web3.givenProvider);
      Contract = await Contract.deployed();
      setCHENDollasContract(Contract);

      const d = (await Contract.decimals()).toNumber();
      dispatch(setDecimals(d));
      fetchTotalSupply(Contract);

      dispatch(setLatestBlockNum(
        (await web3.eth.getBlockNumber())
      ));
    }

    setInitialized(true);
  }

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }

    if (!initialized) {
      init();
      return;
    }

    if (!isMetaMaskInstalled()) {
      return;
    }

    CHENDollasContract.Drip({
      fromBlock: Math.max(latestBlockNum - 10, 0),
    }).on('data', async (event) => addTableRow(event, ACTIONS.PRINT));

    CHENDollasContract.Transfer({
      fromBlock: Math.max(latestBlockNum - 10, 0),
    }).on('data', async (event) => addTableRow(event, undefined));

    async function addTableRow(event, action) {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      let address;

      let {
        blockHash,
        returnValues,
        id,
      } = event;

      if (action === ACTIONS.PRINT) {
        address = returnValues.to;
      } else if (returnValues.to === zeroAddress) {
        action = ACTIONS.BURN;
        address = returnValues.from;
      } else if (returnValues.from === zeroAddress) {
        action = ACTIONS.MINT;
        address = returnValues.to;
      } else {
        action = ACTIONS.TRANSFER;
        address = returnValues.from;
      }

      const amount = (returnValues.amount ?? returnValues.value) / (10 ** decimals);
      const timestamp = (await web3.eth.getBlock(blockHash)).timestamp * 1000;

      const row = {
        address,
        action: action,
        amount,
        id,
        timestamp,
      };

      dispatch(prependRow(row));
    }

    return () => {
      web3.eth.clearSubscriptions();
    };
  }, [initialized]);

  const getAccount = async () => {
    const ethereum = window.ethereum;
    if (ethereum === undefined) {
      console.error('window.ethereum is undefined!');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await onAccountChange(accounts);

    window.ethereum.on(
      'accountsChanged',
      (accounts) => onAccountChange(accounts),
    );

    return accounts[0];
  }

  async function onAccountChange(accounts) {
    if (!accounts || accounts.length < 1) {
      console.err('no account detected!');
      return;
    }

    const address = accounts[0];

    const contractOwner = await CHENDollasContract.owner();
    dispatch(setIsOwner(
      contractOwner.toLowerCase() === address.toLowerCase(),
    ));

    dispatch(setAddress(address));
  }

  async function updatePage(localAccount) {
    try {
      const account = localAccount ?? accountAddress;
      const currentBalance = await CHENDollasContract.balanceOf(account);
      dispatch(setCurrentBalance(currentBalance / (10 ** decimals)));

      fetchTotalSupply();
    } catch (e) {
      dispatch(openSnack({
        'open': true,
        'severity': 'error',
        'message': e.message,
      }));
    }
  }

  useEffect(() => {
    if (!initialized) {
      return;
    }

    updatePage();
  }, [accountAddress]);

  const fetchTotalSupply = async (LocalContract) => {
    const Contract = LocalContract ?? CHENDollasContract;
    const totalSupply = await Contract.totalSupply();
    dispatch(setTokenSupply(totalSupply / (10 ** decimals)));
  }

  const handleConnect = async (e) => {
    if (!isMetaMaskInstalled()) {
      onboarding.current.startOnboarding();
      return;
    } else {
      onboarding.current.stopOnboarding();
    }

    try {
      const account = await getAccount();

      // pass in account address as it's available in state yet
      await updatePage(account);
    } catch (e) {
      dispatch(openSnack({
        'open': true,
        'severity': 'error',
        'message': e.message,
      }));
    }
  }

  const handleDrip = async (e) => {
    try {
      const result = await CHENDollasContract.drip({
        from: accountAddress,
      }).on('transactionHash', (hash) => {
        const message =
          <React.Fragment>
            Please wait a few seconds to warm up the printer...your transaction hash is{' '}
            <Link
              color="textPrimary"
              href={`https://ropsten.etherscan.io/tx/${hash}`}
              target="_blank">
              {hash}
            </Link>
          </React.Fragment>;

        dispatch(openSnack({
          'open': true,
          'severity': 'info',
          'message': message,
          'autoHide': true,
        }));
      });

      if (result.receipt.status) {
        dispatch(turnOnPrinter());
        dispatch(turnOffPrinterAsync());
      }
    } catch (e) {
      dispatch(openSnack({
        'open': true,
        'severity': 'error',
        'message': e.message,
      }));
    }

    await updatePage();
  }

  const handleMint = async (value) => {
    try {
      const convertedMintNumber = new BN(value)
        .mul(new BN((10 ** decimals).toString()));
      const result = await CHENDollasContract.mint(
        accountAddress,
        convertedMintNumber.toString(),
        { from: accountAddress }
      ).on('transactionHash', (hash) => {
        const message =
          <React.Fragment>
            Please wait a few seconds to process...your transaction hash is{' '}
            <Link
              color="textPrimary"
              href={`https://ropsten.etherscan.io/tx/${hash}`}
              target="_blank">
              {hash}
            </Link>
          </React.Fragment>;

        dispatch(openSnack({
          'open': true,
          'severity': 'info',
          'message': message,
          'autoHide': false,
        }));
      });

      if (result.receipt.status) {
        dispatch(openSnack({
          'open': true,
          'severity': 'success',
          'message': 'Successful mint!',
        }));
      }
    } catch (e) {
      dispatch(openSnack({
        'open': true,
        'severity': 'error',
        'message': e.message,
      }));
    }

    await updatePage();
  }

  const handleBurn = async (value) => {
    try {

      const convertedBurnNumber = new BN(value)
        .mul(new BN((10 ** decimals).toString()));
      const result = await CHENDollasContract.burn(
        convertedBurnNumber,
        {from: accountAddress},
      ).on('transactionHash', (hash) => {
        const message =
          <React.Fragment>
            Please wait a few seconds to process...your transaction hash is{' '}
            <Link
              color="textPrimary"
              href={`https://ropsten.etherscan.io/tx/${hash}`}
              target="_blank">
              {hash}
            </Link>
          </React.Fragment>;

        dispatch(openSnack({
          'open': true,
          'severity': 'info',
          'message': message,
          'autoHide': false,
        }));
      });

      if (result.receipt.status) {
        // TODO: add link to transaction hash here
        dispatch(openSnack({
          'open': true,
          'severity': 'success',
          'message': 'Successful burn!',
        }));
      }
    } catch (e) {
      dispatch(openSnack({
        'open': true,
        'severity': 'error',
        'message': e.message,
      }));
    }

    await updatePage();
  }

  const handleTransfer = async (payload) => {
    try {
      const dest = payload.address;
      const amount = payload.amount;

      const convertedTransferAmount = new BN(amount)
        .mul(new BN((10 ** decimals).toString()));
      const result = await CHENDollasContract.transfer(
        dest,
        convertedTransferAmount.toString(),
        {from: accountAddress},
      ).on('transactionHash', (hash) => {
        const message =
          <React.Fragment>
            Please wait a few seconds to process...your transaction hash is{' '}
            <Link
              color="textPrimary"
              href={`https://ropsten.etherscan.io/tx/${hash}`}
              target="_blank">
              {hash}
            </Link>
          </React.Fragment>;

        dispatch(openSnack({
          'open': true,
          'severity': 'info',
          'message': message,
          'autoHide': false,
        }));
      });

      if (result.receipt.status) {
        dispatch(openSnack({
          'open': true,
          'severity': 'success',
          'message': 'Successful transfer!',
        }));
      }
    } catch (e) {
      dispatch(openSnack({
        'open': true,
        'severity': 'error',
        'message': e.message,
      }));
    }

    await updatePage();
  }

  if (!initialized) {
    return null;
  }

  return (
    <div className="App">
      <h1>Bank of 陈CHEN</h1>
      <Button
        className="connect_wallet"
        variant="contained"
        onClick={handleConnect}>
        Connect Wallet
        <AccountBalanceWalletOutlinedIcon
          className="connect_wallet_icon"
          fontSize="small"
        />
      </Button>
      <span className="account_address">
        My address: { accountAddress }
      </span>
      <Button
        className="drip_button"
        style={{backgroundColor: '#4caf50', color: '#FFFFFF'}}
        variant="outlined"
        onClick={handleDrip}>
        Print &nbsp;💸
      </Button>
      <PrinterDialog
        handleCloseDialog={() => dispatch(turnOffPrinter())}
      />
      {isOwner ?
        <MintForm
          className="mint_form"
          onSubmit={handleMint}
        /> :
        undefined
      }
      <BurnForm
        className="burn_form"
        onSubmit={handleBurn}
      />
      <TransferForm
        className="transfer_form"
        onSubmit={handleTransfer}
      />
      <MyBalanceCounter />
      <TotalTokenSupplyCounter />
      <TransactionsTable />
      <SnackbarPopup onClose={() => dispatch(closeSnack())} />
    </div>
  );
}

export default App;
