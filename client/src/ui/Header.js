import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';

export default function Header(props) {

  const handleAddToken = async (e) => {
    if (!window.ethereum) {
      return;
    }

    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: '0x6aeca8bf14f37b5d2399d82e93a1e837b8fe86af', // ropsten
          symbol: '陈CHEN',
          decimals: 18,
          image: 'https://bankofchen.vercel.app/logo512.png',
        },
      },
    })
  }

  return (
    <ul className="header">
      <li>
        <Tooltip title="Add 陈CHEN Token to MetaMask">
          <Avatar
            className="add_token"
            alt="Add 陈CHEN Token"
            src="https://bankofchen.vercel.app/logo512.png"
            onClick={handleAddToken}
          />
        </Tooltip>
      </li>
      <li>
        <Link
          href="https://faucet.ropsten.be/"
          target="_blank">
          <Tooltip title="Get Ropsten ETH">
            <Avatar
              className="get_ropsten"
              alt="Get Ropsten ETH"
              src="/eth-logo.png"
            />
          </Tooltip>
        </Link>
      </li>
      <li>
        <Link
          className="github_link"
          href="https://github.com/0xjessel/Bank-of-CHEN"
          target="_blank">
          <Tooltip title="View source code">
            <GitHubIcon style={{ fontSize: 40 }} />
          </Tooltip>
        </Link>
      </li>
    </ul>
  );
}
