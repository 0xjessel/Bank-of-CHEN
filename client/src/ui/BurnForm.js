import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentBalance } from '../store/currentBalanceSlice';

import Button from '@material-ui/core/Button';
import CHENTextField from './CHENTextField';

export default function BurnForm(props) {
  const [value, setValue] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const currentBalance = useSelector(getCurrentBalance);

  const {onSubmit, ...otherProps} = props;

  useEffect(() => {
    setDisabled(currentBalance === 0 || value > currentBalance);
  }, [currentBalance, value]);

  return (
    <form
      {...otherProps}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}>
      <CHENTextField
        label="Amount to burn"
        value={value}
        isCurrency={true}
        onChange={ e => setValue(e.target.value) }
      />
      <Button
        className="submit_button"
        disabled={disabled}
        type="submit"
        variant="contained"
        color="primary"
        size="small">
        Burn  &nbsp; 🔥
      </Button>
    </form>
  );
};
