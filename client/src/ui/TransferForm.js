import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentBalance } from '../store/currentBalanceSlice';

import Button from '@material-ui/core/Button';
import CHENTextField from './CHENTextField';
import SwapHorizRoundedIcon from '@material-ui/icons/SwapHorizRounded';

export default function TransferForm(props) {
  const [transferAddress, setTransferAddress] = useState('0x0');
  const [transferAmount, setTransferAmount] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const currentBalance = useSelector(getCurrentBalance);

  const { onSubmit, web3, ...otherProps} = props;

  useEffect(() => {
    setDisabled(
      currentBalance === 0 ||
      transferAmount > currentBalance ||
      !web3.utils.isAddress(transferAddress)
    );
  }, [currentBalance, transferAmount, transferAddress, web3.utils]);

  return (
    <form
      {...otherProps}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          'address': transferAddress,
          'amount': transferAmount,
        });
      }}>
      <CHENTextField
        className="transfer_address_input"
        label="Recipient Address"
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
        disabled={disabled}
        variant="contained"
        color="primary"
        size="small"
        endIcon={<SwapHorizRoundedIcon />}>
        Transfer
      </Button>
    </form>
  );
}
