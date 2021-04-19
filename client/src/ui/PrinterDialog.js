import React from 'react';
import printer from '../img/money-printer.gif';
import '../css/PrinterDialog.css';
import 'csshake';

import Dialog from '@material-ui/core/Dialog';

export default function PrinterDialog(props) {
  return (
    <Dialog
      className="print_dialog"
      scroll="body"
      onClose={props.handleCloseDialog}
      open={props.open}>
      <img
        className="shake-constant shake-hard"
        src={printer}
        alt="BRRRRRRR"
      />
    </Dialog>
  );
};
