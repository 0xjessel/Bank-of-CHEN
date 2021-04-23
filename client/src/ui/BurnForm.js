import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import CHENTextField from './CHENTextField';

export default function BurnForm(props) {
  const [value, setValue] = useState(0);
  const { onSubmit, ...otherProps} = props;

  return (
    <form
      {...otherProps}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}>
      <CHENTextField
        label="Burn Tokens"
        value={value}
        isCurrency={true}
        onChange={ e => setValue(e.target.value) }
      />
      <Button
        className="submit_button"
        type="submit"
        variant="contained"
        color="primary"
        size="small">
        Burn  &nbsp; 🔥
      </Button>
    </form>
  );
};
