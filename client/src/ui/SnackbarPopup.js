import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectSnackOpen,
  selectSnackSeverity,
  selectSnackMessage,
  selectSnackAutoHide,
} from '../store/snackSlice';

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function SnackbarPopup(props) {
  const open = useSelector(selectSnackOpen);
  const severity = useSelector(selectSnackSeverity);
  const message = useSelector(selectSnackMessage);
  const autoHide = useSelector(selectSnackAutoHide);

  const progressStyle = {
    marginLeft: '8px',
    verticalAlign: 'text-top',
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHide ? 5000 : undefined}
      onClose={props.onClose}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={props.onClose}
        severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
