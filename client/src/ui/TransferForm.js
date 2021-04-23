import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import CHENTextField from './CHENTextField';
import SwapHorizRoundedIcon from '@material-ui/icons/SwapHorizRounded';

export default function TransferForm(props) {
  const [transferAddress, setTransferAddress] = useState('0x0');
  const [transferAmount, setTransferAmount] = useState(0);

  return (
    <form
      className="transfer_form"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit({
          'address': transferAddress,
          'amount': transferAmount,
        });
      }}>
      <CHENTextField
        className="transfer_address_input"
        label="Transfer Address"
        value={transferAddress}
        onChange={ e => setTransferAddress(e.target.value) }
      />
      <CHENTextField
        className="transfer_amount_input"
        label="Amount"
        isCurrency={true}
        value={transferAmount}
        onChange={ e => setTransferAmount(e.target.value) }
      />
      <Button
        className="submit_button"
        type="submit"
        variant="contained"
        color="primary"
        size="small"
        endIcon={<SwapHorizRoundedIcon />}>
        Transfer
      </Button>
    </form>
  );
}
