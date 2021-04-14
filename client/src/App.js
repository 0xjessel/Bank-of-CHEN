import React, { useState } from 'react';
import Web3 from 'web3';
import { CHENDollasAbi } from './abis';
import classNames from 'classnames';
import './App.css';
import './success.css';

const web3 = new Web3(Web3.givenProvider);
const BN = web3.utils.BN;

const CHENDollasAddr = '0x8e6124829e9b1E83bA6f3A1C7Be8435D9Bc4bb46';
const CHENDollasContract = new web3.eth.Contract(CHENDollasAbi, CHENDollasAddr);

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

  const [showSuccess, setShowSuccess] = useState(false);
  const [svgClassname, setSvgClassname] = useState();
  const [circleClassname, setCircleClassname] = useState();
  const [pathClassname, setPathClassname] = useState();

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

      const totalSupply = await CHENDollasContract.methods.totalSupply().call();
      setTokenSupply(totalSupply / (10 ** decimals));
    } catch (e) {
      setErrorMsg(e.message);
    }
  }

  const handleConnect = async (e) => {
    try {
      const account = await getAccount();
      setDecimals(await CHENDollasContract.methods.decimals().call());
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
      const gas = await CHENDollasContract.methods.burn(convertedBurnNumber).estimateGas();
      const result = await CHENDollasContract.methods.burn(convertedBurnNumber).send({
        from: accountAddress,
        gas
      });

      if (result.status) {
        showSuccessPopup();
      }
    } catch (e) {
      setErrorMsg(e.message);
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
        showSuccessPopup();
      }
    } catch (e) {
      setErrorMsg(e.message);
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
        showSuccessPopup();
      }
    } catch (e) {
      setErrorMsg(e.message);
    }

    await updatePage();
  }

  function showSuccessPopup() {
    setShowSuccess(true);
    setSvgClassname('checkmark');
    setCircleClassname('checkmark__circle');
    setPathClassname('checkmark__check');
  }

  const onSuccessAnimationEnd = () => {
    setShowSuccess(false);

    // reset animation
    setSvgClassname('');
    setCircleClassname('');
    setPathClassname('');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bank of 陈CHEN</h1>
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
        My Balance: { round(getCurrentBalance).toLocaleString() } 陈CHEN
        <br />
        <br />
        Total Token Supply: { round(getTokenSupply).toLocaleString() } 陈CHEN
      </header>
      <div
        className={classNames({
          success_dialog: true,
          hidden: !showSuccess,
        })}>
        <svg
          className={svgClassname}
          xmlns="checkmark"
          viewBox="0 0 52 52">
          <circle
            className={circleClassname}
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className={pathClassname}
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            onAnimationEnd={onSuccessAnimationEnd}
          />
        </svg>
      </div>
    </div>
  );

}

export default App;
