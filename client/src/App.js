import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import classNames from 'classnames';
import printer from './money-printer.gif';
import { CHENDollasAbi } from './abis';

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

const CHENDollasAddr = '0xd36f4FE394829CE309C0907C13A7c3A1233AF013';
const CHENDollasContract = new web3.eth.Contract(CHENDollasAbi, CHENDollasAddr);

function App() {
  const [accountAddress, setAccountAddress] = useState('0x0');
  const [decimals, setDecimals] = useState(18);

  const [mintNumber, setMintNumber] = useState(0);
  const [burnNumber, setBurnNumber] = useState(0);
  const [transferAddress, setTransferAddress] = useState('0x0');
  const [transferAmount, setTransferAmount] = useState(0);
  const [getTokenSupply, setTokenSupply] = useState(0);
  const [getCurrentBalance, setCurrentBalance] = useState(0);
  const [getDripRows, setDripRows] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState('success');
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    fetchTotalSupply();

    CHENDollasContract.events.Drip({
      fromBlock: 0,
    }).on('data', async (event) => {
      let {
        blockHash,
        returnValues,
        id,
      } = event;
      const to = returnValues.to;
      const amount = returnValues.amount / (10 ** decimals);
      const timestamp = (await web3.eth.getBlock(blockHash)).timestamp * 1000;

      const row = {
        to,
        amount,
        id,
        timestamp,
      };

      setDripRows(dripRows => [row, ...dripRows]);
    });
  }, []);

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
      const currentBalance = await CHENDollasContract.methods.balanceOf(account).call();
      setCurrentBalance(currentBalance / (10 ** decimals));

      fetchTotalSupply();
    } catch (e) {
      openSnack('error', e.message);
    }
  }

  const fetchTotalSupply = async () => {
    const totalSupply = await CHENDollasContract.methods.totalSupply().call();
    setTokenSupply(totalSupply / (10 ** decimals));
  }

  const handleConnect = async (e) => {
    try {
      const account = await getAccount();
      setDecimals(await CHENDollasContract.methods.decimals().call());

      // pass in account address as it's available in state yet
      await updatePage(account);
    } catch (e) {
      openSnack('error', e.message);
    }
  }

  const handleDrip = async (e) => {
    try {
      const gas = await CHENDollasContract.methods.drip().estimateGas({from: accountAddress});
      const result = await CHENDollasContract.methods.drip().send({
        from: accountAddress,
        gas
      });

      if (result.status) {
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
      const gas = await CHENDollasContract.methods.burn(convertedBurnNumber).estimateGas();
      const result = await CHENDollasContract.methods.burn(convertedBurnNumber).send({
        from: accountAddress,
        gas
      });

      if (result.status) {
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
      const gas = await CHENDollasContract.methods.mint(accountAddress, convertedMintNumber.toString()).estimateGas();
      const result = await CHENDollasContract.methods.mint(accountAddress, convertedMintNumber.toString()).send({
        from: accountAddress,
        gas
      });
      if (result.status) {
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
      const gas = await CHENDollasContract.methods.transfer(transferAddress, convertedTransferAmount.toString()).estimateGas();
      const result = await CHENDollasContract.methods.transfer(transferAddress, convertedTransferAmount.toString()).send({
        from: accountAddress,
        gas,
      });

      if (result.status) {
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
      {DripTable()}
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

  function DripTable() {
    return (
      <TableContainer
        className="drip_table"
        component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Address</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getDripRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Link
                    color="textPrimary"
                    underline="none"
                    href={'https://ropsten.etherscan.io/address/'+row.to}
                    target="_blank">
                    {row.to}
                  </Link>
                </TableCell>
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
