import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { useSelector } from 'react-redux';
import { isNUXDialogOpen } from '../store/NUXDialogSlice';
import { getIsRopsten, getHasMetaMask } from '../store/accountSlice';
import { isChrome, isMobile } from "react-device-detect";

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

  let dialogContent;
  if (isMobile) {
    dialogContent =
      <MuiDialogContent dividers>
        <Typography gutterBottom>
          The Bank is dealing with runaway inflation and cannot afford software engineers to support mobile.
          Please come back on desktop!
        </Typography>
      </MuiDialogContent>;
  } else {
    const chromeDisclaimer = !isChrome
      ? <li>
          <Typography gutterBottom>
            The Bank is only supported on the Chrome browser due to being cheap.
            Please switch to Chrome!
          </Typography>
        </li>
      : null;

    dialogContent =
      <MuiDialogContent dividers>
        <Typography gutterBottom>
          In order to access the Bank, you must follow the instructions below:
        </Typography>
        <ol>
          {chromeDisclaimer}
          <li>
            <Typography gutterBottom>
              Install the{' '}
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
      </MuiDialogContent>;
  }

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
      {dialogContent}
    </Dialog>
  );
};
