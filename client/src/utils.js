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
