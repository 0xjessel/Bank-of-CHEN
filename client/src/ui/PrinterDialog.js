import React from 'react';
import { useSelector } from 'react-redux';
import { isPrinterOn } from '../store/printerSlice';

import printer from '../img/money-printer.gif';
import '../css/PrinterDialog.css';
import 'csshake';

import Dialog from '@material-ui/core/Dialog';

export default function PrinterDialog(props) {
  const open = useSelector(isPrinterOn);

  return (
    <Dialog
      className="print_dialog"
      scroll="body"
      onClose={props.handleCloseDialog}
      open={open}>
      <img
        className="shake-constant shake-hard"
        src={printer}
        alt="BRRRRRRR"
      />
    </Dialog>
  );
};
