import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectSnackOpen,
  selectSnackSeverity,
  selectSnackMessage,
} from '../store/snackSlice';

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function SnackbarPopup(props) {
  const open = useSelector(selectSnackOpen);
  const severity = useSelector(selectSnackSeverity);
  const message = useSelector(selectSnackMessage);

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
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
