export function isMetaMaskInstalled() {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
}

export async function isRopstenNetwork() {
  if (!isMetaMaskInstalled()) {
    return false;
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return chainId === '0x3';
}

export const ACTIONS = {
  PRINT: 'Print 💸',
  MINT: 'Mint ＋',
  BURN: 'Burn 🔥',
  TRANSFER: 'Transfer ➡️',
};

export const zeroAddress = '0x0000000000000000000000000000000000000000';
