import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { useSelector } from 'react-redux';
import { isNUXDialogOpen } from '../store/NUXDialogSlice';
import { getIsRopsten, getHasMetaMask } from '../store/accountSlice';

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import Link from '@material-ui/core/Link';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import '../css/NUXDialog.css';
import network from '../img/network.png';

export default function NUXDialog(props) {
  const open = useSelector(isNUXDialogOpen);
  const isRopsten = useSelector(getIsRopsten);
  const hasMetaMask = useSelector(getHasMetaMask);
  const onboarding = React.useRef();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (hasMetaMask) {
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
  }, [hasMetaMask]);

  const handleMetaMask = () => {
    onboarding.current.startOnboarding();
  };

  return (
    <Dialog
      className="nux_dialog"
      scroll="body"
      open={open}>
      <MuiDialogTitle disableTypography>
        <Typography variant="h6">
          Welcome to Bank of 陈CHEN!
        </Typography>
      </MuiDialogTitle>
      <MuiDialogContent dividers>
        <Typography gutterBottom>
          In order to access the Bank, you must follow the instructions below:
        </Typography>
        <ol>
          <li>
            <Typography gutterBottom>
              Install{' '}
              <Link
                color="secondary"
                href="#"
                onClick={handleMetaMask}>
                MetaMask Chrome Extension
              </Link>
              {' '}as your wallet {hasMetaMask
                ? <CheckCircleIcon className="status_icon" />
                : <CancelIcon className="status_icon" />
              }
            </Typography>
          </li>
          <li>
            <Typography gutterBottom>
              Get some{' '}
              <Link
                color="secondary"
                href="https://faucet.dimensions.network/"
                target="_blank">
                Ropsten ETH
              </Link>
              {' '}to pay for gas fees
            </Typography>
          </li>
          <li>
            <Typography gutterBottom>
              Switch to Ropsten Network {isRopsten
                ? <CheckCircleIcon className="status_icon" />
                : <CancelIcon className="status_icon" />
              }
            </Typography>
            <img
              src={network}
              alt="switch network to Ropsten"
              width="50%"
            />
          </li>
        </ol>
      </MuiDialogContent>
    </Dialog>
  );
};
