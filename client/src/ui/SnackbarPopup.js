import React from 'react';

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function(props) {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={5000}
      onClose={props.onClose}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={props.onClose}
        severity={props.severity}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}
