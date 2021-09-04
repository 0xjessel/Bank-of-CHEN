# Bank of 陈CHEN

Bank of 陈CHEN is a dapp that provides various controls for managing the biggest currency printer in the world.  The console provides the following functionality:
- PRINT 💸: The CHEN Feds will print 1000 陈CHEN dollas out of thin air into your wallet
- MINT + (admin-only): Mint any amount 陈CHEN dollas you desire straight into your wallet
- BURN 🔥: To help with the out of control inflation patterns we're seeing, destroy your 陈CHEN dollas to remove them from circulation!
- TRANSFER ↔️: Send 陈CHEN dollas to another address on the blockchain

I built this to learn about Ethereum blockchain, ERC20 tokens, and web3.  Also secretly hoping this coin will moon one day 🚀.  

## Instructions
1. Download the [Metamask Chrome extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn).  Where it says "Ethereum Mainnet", click on it and toggle to "Ropsten Test Network"
2. Find a [Ropsten faucet](https://faucet.dimensions.network/) and get some Ropsten ETH to pay for gas fees
3. Go to https://bankofchen.vercel.app/
4. Follow instructions and click "Connect Wallet" to get started

## Screenshot
![image](https://user-images.githubusercontent.com/394218/132078534-7f9e1df6-f2bd-480c-b007-3e3cc9e7d18d.png)

## Technical Details

Currently, it is only deployed to the Ropsten testnet.  I've only tested this on Chrome and with the Metamask extension, other setups likely will not work.  Built with Truffle, Material UI, and React.js

To build the blockchain contracts, `npm run install` in `blockchain/`, `truffle develop` and then `migrate` to set up a local testnet.  To deploy onto the blockchain, `truffle deploy --network ropsten`.

To build the React app, `yarn install` in `client/` and then `yarn run start`.  You'll also need to `cp blockchain/build/contracts/CHENDollas.json client/src/build/contracts/CHENDollas.json` to allow `TruffleContract` to access the contract's ABI.  

To test the app, configure your Metamask to connect to the local truffle testnet and import the private key of the account truffle created (for admin privileges).  

_This [tutorial](https://medium.com/fullstacked/connect-react-to-ethereum-b117986d56c1) was A HUGE source of help to get me started._
