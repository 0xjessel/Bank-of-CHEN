import React, { useState } from 'react';
import Web3 from 'web3';
import { JCHENTokensAbi } from './abis';
import './App.css';

const web3 = new Web3(Web3.givenProvider);
const BN = web3.utils.BN;

const JCHENTokensAddr = '0x1351a8dB5Dbb53b24ceA6E5B138E90B2006a5145';
const JCHENTokensContract = new web3.eth.Contract(JCHENTokensAbi, JCHENTokensAddr);

function round(value) {
  return Number(Math.round(value+'e'+2)+'e-'+2);
}

function App() {
  const [accountAddress, setAccountAddress] = useState('0x0');
  const [decimals, setDecimals] = useState(18);

  const [mintNumber, setMintNumber] = useState(0);
  const [burnNumber, setBurnNumber] = useState(0);
  const [transferAddress, setTransferAddress] = useState('0x0');
  const [transferAmount, setTransferAmount] = useState(0);
  const [getTokenSupply, setTokenSupply] = useState(0);
  const [getCurrentBalance, setCurrentBalance] = useState(0);

  const [errorMsg, setErrorMsg] = useState();

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
      const currentBalance = await JCHENTokensContract.methods.balanceOf(account).call();
      setCurrentBalance(round(currentBalance / (10 ** decimals)));

      const totalSupply = await JCHENTokensContract.methods.totalSupply().call();
      setTokenSupply(round(totalSupply / (10 ** decimals)));
    } catch (e) {
      setErrorMsg(e.message);
    }
  }

  const handleConnect = async (e) => {
    try {
      const account = await getAccount();
      setDecimals(await JCHENTokensContract.methods.decimals().call());
      // pass in account address as it's available in state yet
      await updatePage(account);
    } catch (e) {
      setErrorMsg(e.message);
    }
  }

  const handleBurn = async (e) => {
    e.preventDefault();
    try {
      const convertedBurnNumber = new BN(burnNumber).mul(new BN((10 ** decimals).toString()));
      const gas = await JCHENTokensContract.methods.burn(convertedBurnNumber).estimateGas();
      await JCHENTokensContract.methods.burn(convertedBurnNumber).send({
        from: accountAddress,
        gas
      });
    } catch (e) {
      setErrorMsg(e.message);
    }

    await updatePage();
  }

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      const convertedMintNumber = new BN(mintNumber).mul(new BN((10 ** decimals).toString()));
      const gas = await JCHENTokensContract.methods.mint(accountAddress, convertedMintNumber.toString()).estimateGas();
      await JCHENTokensContract.methods.mint(accountAddress, convertedMintNumber.toString()).send({
        from: accountAddress,
        gas
      });
    } catch (e) {
      setErrorMsg(e.message);
    }

    await updatePage();
  }

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const convertedTransferAmount = new BN(transferAmount).mul(new BN((10 ** decimals).toString()));
      const gas = await JCHENTokensContract.methods.transfer(transferAddress, convertedTransferAmount.toString()).estimateGas();
      await JCHENTokensContract.methods.transfer(transferAddress, convertedTransferAmount.toString()).send({
        from: accountAddress,
        gas,
      });
    } catch (e) {
      setErrorMsg(e.message);
    }

    await updatePage();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bank of $JCHEN</h1>
        <button
          onClick={handleConnect}
          type="Button">
          Connect Wallet
        </button>
        <br />
        My address: { accountAddress }
        <br />
        <br />
        <br />
        <form onSubmit={handleMint}>
          <label>
            Mint New Tokens:
            <input
              type="text"
              name="name"
              value={mintNumber}
              onChange={ e => setMintNumber(e.target.value) }
            />
          </label>
          <input type="submit" value="Mint" />
        </form>
        <form onSubmit={handleBurn}>
          <label>
            Burn Tokens:
            <input
              type="text"
              name="name"
              value={burnNumber}
              onChange={ e => setBurnNumber(e.target.value) }
            />
          </label>
          <input type="submit" value="Burn" />
        </form>
        <br />
        <form onSubmit={handleTransfer}>
          <label className="address_label">
            Transfer Address:
            <input
              type="text"
              name="name"
              value={transferAddress}
              onChange={ e => setTransferAddress(e.target.value) }
            />
          </label>
          <label>
            Amount:
            <input
              type="text"
              name="name"
              value={transferAmount}
              onChange={ e => setTransferAmount(e.target.value) }
            />
          </label>
          <input type="submit" value="Transfer Now" />
        </form>
        <br />
        <span className="error_msg">{errorMsg}</span>
        <br />
        <br />
        My Balance: { getCurrentBalance } $JCHEN
        <br />
        <br />
        Total Token Supply: { getTokenSupply } $JCHEN
      </header>
    </div>
  );

}

export default App;
