# Bank of 陈CHEN

Bank of 陈CHEN is a dapp console that provides various controls for managing the biggest currency printer in the world.  The console provides the following functionality:
- PRINT 💸: The CHEN Feds will print 1000 陈CHEN dollas out of thin air into your wallet
- MINT + (admin-only): Mint any amount 陈CHEN dollas you desire straight into your wallet
- BURN 🔥: To help with the out of control inflation patterns we're seeing, destroy your 陈CHEN dollas to remove them from circulation!
- TRANSFER ↔️: Send 陈CHEN dollas to another address on the blockchain

I built this to experiment with ERC20 Tokens and Dapps.  Maybe also secretly hoping this coin will moon 🚀.  

## Directions
1. Download the Metamask Chrome extension.  Where it says "Ethereum Mainnet", click on it and toggle to "Ropsten Test Network"
2. Find a Ropsten faucet (e.g. https://faucet.ropsten.be/) and get some test ETH
3. Go to {website_url}
4. Click "Connect Wallet" to get started

## Screenshot
![image](https://user-images.githubusercontent.com/394218/129458435-92dabb03-09ac-470f-997b-92179eea97b7.png)

## Technical Details

A HUGE source of help to get me started: https://medium.com/fullstacked/connect-react-to-ethereum-b117986d56c1

Currently, it is deployed to the Ropsten network.  I've only tested this on Chrome and with the Metamask extension, other setups might not work.  Built with Truffle, Material UI, and React.js

To build the blockchain contracts, `npm run install` in `blockchain/` and `truffle develop` and then `migrate` to set up a local testnet.  To deploy onto the blockchain, `truffle deploy --network ropsten`

To build the React app, `npm run install` in `client/` and then `npm run start`.  You'll also need to `cp blockchain/build/contracts/CHENDollas.json client/src/build/contracts/CHENDollas.json` to let `TruffleContract` read the contract's ABI.  

To test the app, configure your Metamask to connect to the local truffle testnet and import the private key of the account truffle created (for admin privileges).  
