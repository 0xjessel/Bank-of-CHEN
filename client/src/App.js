import React, { useState, useEffect } from 'react';
import TruffleContract from '@truffle/contract';
import CHENDollas from './build/contracts/CHENDollas.json';
import Web3 from 'web3';
import printer from './money-printer.gif';

import './App.css';

import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CountUp from 'react-countup';
import Dialog from '@material-ui/core/Dialog';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import SwapHorizRoundedIcon from '@material-ui/icons/SwapHorizRounded';
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

const web3 = new Web3(Web3.givenProvider);
const BN = web3.utils.BN;

function App() {
  const [initialized, setInitialized] = useState(false);
  const [CHENDollasContract, setCHENDollasContract] = useState();
  const [accountAddress, setAccountAddress] = useState('0x0');
  const [decimals, setDecimals] = useState(18);

  const [mintNumber, setMintNumber] = useState(0);
  const [burnNumber, setBurnNumber] = useState(0);
  const [transferAddress, setTransferAddress] = useState('0x0');
  const [transferAmount, setTransferAmount] = useState(0);
  const [getTokenSupply, setTokenSupply] = useState(0);
  const [getCurrentBalance, setCurrentBalance] = useState(0);
  const [getTableRows, setTableRows] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState('success');
  const [snackMessage, setSnackMessage] = useState('');

  async function init() {
    let Contract = TruffleContract(CHENDollas);
    Contract.setProvider(web3.givenProvider);
    Contract = await Contract.deployed();
    setCHENDollasContract(Contract);
    setInitialized(true);

    fetchTotalSupply(Contract);
  }

  useEffect(() => {
    init();

    if (!initialized) {
      return;
    }

    const ACTIONS = {
      PRINT: 'Print 💸',
      MINT: 'Mint ＋',
      BURN: 'Burn 🔥',
      TRANSFER: 'Transfer ➡️',
    };

    CHENDollasContract.Drip({
      fromBlock: 0, // TODO: don't start from block 0
    }).on('data', async (event) => addTableRow(event, ACTIONS.PRINT));

    CHENDollasContract.Transfer({
      fromBlock: 0, // TODO: don't start from block 0
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

      setTableRows(getTableRows => [row, ...getTableRows].sort((x, y) => y.timestamp - x.timestamp).slice(0, 10));
    }
  }, [initialized]);

  const getAccount = async () => {
    const ethereum = window.ethereum;
    if (ethereum === undefined) {
      console.error('window.ethereum is undefined!');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccountAddress(accounts[0]);

    return accounts[0];
  }

  const updatePage = async (localAccount) => {
    try {
      const account = localAccount ?? accountAddress;
      const currentBalance = await CHENDollasContract.balanceOf(account);
      setCurrentBalance(currentBalance / (10 ** decimals));

      fetchTotalSupply();
    } catch (e) {
      openSnack('error', e.message);
    }
  }

  const fetchTotalSupply = async (LocalContract) => {
    const Contract = LocalContract ?? CHENDollasContract;
    const totalSupply = await Contract.totalSupply();
    setTokenSupply(totalSupply / (10 ** decimals));
  }

  const handleConnect = async (e) => {
    try {
      const account = await getAccount();
      setDecimals(await CHENDollasContract.decimals());

      // pass in account address as it's available in state yet
      await updatePage(account);
    } catch (e) {
      openSnack('error', e.message);
    }
  }

  const handleDrip = async (e) => {
    try {
      const result = await CHENDollasContract.drip({
        from: accountAddress,
      });

      if (result.receipt.status) {
        setOpenDialog(true);
        setTimeout(() => setOpenDialog(false), 3000);
      }
    } catch (e) {
      openSnack('error', e.message);
    }

    await updatePage();
  }

  const handleBurn = async (e) => {
    e.preventDefault();
    try {
      const convertedBurnNumber = new BN(burnNumber).mul(new BN((10 ** decimals).toString()));
      const result = await CHENDollasContract.burn(convertedBurnNumber, {from: accountAddress});
      if (result.receipt.status) {
        openSnack('success', 'Successful burn!');
      }
    } catch (e) {
      openSnack('error', e.message);
    }

    await updatePage();
  }

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      const convertedMintNumber = new BN(mintNumber).mul(new BN((10 ** decimals).toString()));
      const result = await CHENDollasContract.mint(accountAddress, convertedMintNumber.toString(), { from: accountAddress });
      if (result.receipt.status) {
        openSnack('success', 'Successful mint!');
      }
    } catch (e) {
      openSnack('error', e.message);
    }

    await updatePage();
  }

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const convertedTransferAmount = new BN(transferAmount).mul(new BN((10 ** decimals).toString()));
      const result = await CHENDollasContract.transfer(transferAddress, convertedTransferAmount.toString(), {from: accountAddress});

      if (result.receipt.status) {
        openSnack('success', 'Successful transfer!');
      }
    } catch (e) {
      openSnack('error', e.message);
    }

    await updatePage();
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  function openSnack(severity, message) {
    setSnackOpen(true);
    setSnackSeverity(severity);
    setSnackMessage(message);
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
      <Dialog
        scroll="body"
        onClose={handleCloseDialog}
        open={openDialog}>
        <img
          src={printer}
          alt="BRRRRRRR"
        />
      </Dialog>
      <form className="mint_form" onSubmit={handleMint}>
        <TextField
          variant="outlined"
          size="small"
          label="Mint New Tokens"
          InputProps={{
            endAdornment: <InputAdornment position="start">陈CHEN</InputAdornment>,
          }}
          value={mintNumber}
          onChange={ e => setMintNumber(e.target.value) }
        />
        <Button
          className="submit_button"
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          endIcon={<AddIcon />}>
          Mint
        </Button>
      </form>
      <form className="burn_form" onSubmit={handleBurn}>
        <TextField
          variant="outlined"
          size="small"
          label="Burn Tokens"
          InputProps={{
            endAdornment: <InputAdornment position="start">陈CHEN</InputAdornment>,
          }}
          value={burnNumber}
          onChange={ e => setBurnNumber(e.target.value) }
        />
        <Button
          className="submit_button"
          type="submit"
          variant="contained"
          color="primary"
          size="small">
          Burn  &nbsp; 🔥
        </Button>
      </form>
      <form className="transfer_form" onSubmit={handleTransfer}>
        <TextField
          className="transfer_address_input"
          variant="outlined"
          size="small"
          label="Transfer Address"
          value={transferAddress}
          onChange={ e => setTransferAddress(e.target.value) }
        />
        <TextField
          className="transfer_amount_input"
          variant="outlined"
          size="small"
          label="Amount"
          InputProps={{
            endAdornment: <InputAdornment position="start">陈CHEN</InputAdornment>,
          }}
          value={transferAmount}
          onChange={ e => setTransferAmount(e.target.value) }
        />
        <Button
          className="submit_button"
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          endIcon={<SwapHorizRoundedIcon />}>
          Transfer
        </Button>
      </form>
      <span className="my_balance">
        My Balance:&nbsp;
        <CountUp
          end={getCurrentBalance}
          preserveValue={true}
          separator=","
          suffix=" 陈CHEN"
        />
      </span>
      <span className="total_supply">
        Total Token Supply:&nbsp;
        <CountUp
          end={getTokenSupply}
          preserveValue={true}
          separator=","
          suffix=" 陈CHEN"
        />
      </span>
      {TransactionTable()}
      <Snackbar open={snackOpen} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleSnackClose}
          severity={snackSeverity}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );

  function TransactionTable() {
    return (
      <TableContainer
        className="transaction_table"
        component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Address</TableCell>
              <TableCell align="right">Action</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getTableRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Link
                    color="textPrimary"
                    underline="none"
                    href={'https://ropsten.etherscan.io/address/'+row.address}
                    target="_blank">
                    {row.address}
                  </Link>
                </TableCell>
                <TableCell align="right">{row.action}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">
                  {new Date(row.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default App;
