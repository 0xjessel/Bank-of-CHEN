import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

export default function AddTokenIcon(props) {
  return (
    <Tooltip title="Add 陈CHEN Token to MetaMask">
      <Avatar
        className="add_token"
        alt="Add 陈CHEN Token"
        src="https://bankofchen.vercel.app/logo512.png"
        onClick={props.onClick}
      />
    </Tooltip>
  );
}
