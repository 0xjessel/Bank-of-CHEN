export function isMetaMaskInstalled() {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
}

export const ACTIONS = {
  PRINT: 'Print 💸',
  MINT: 'Mint ＋',
  BURN: 'Burn 🔥',
  TRANSFER: 'Transfer ➡️',
};

export const zeroAddress = '0x0000000000000000000000000000000000000000';
