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
          address: '0x6D8A0a8b64b9998C2195308F376cA1b6e75DB398', // rinkeby
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
            src="/logo512.png"
            onClick={handleAddToken}
          />
        </Tooltip>
      </li>
      <li>
        <Link
          href="https://faucets.chain.link/rinkeby"
          target="_blank">
          <Tooltip title="Get Rinkeby ETH">
            <Avatar
              className="get_rinkeby"
              alt="Get Rinkeby ETH"
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
