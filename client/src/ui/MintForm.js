import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CHENTextField from './CHENTextField';

export default function MintForm(props) {
  const [value, setValue] = useState(0);
  const { onSubmit, ...otherProps} = props;

  return (
    <form
      {...otherProps}
      className="mint_form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}>
      <CHENTextField
        label="Mint New Tokens"
        isCurrency={true}
        value={value}
        onChange={ e => setValue(e.target.value) }
      />
      <Button
        className="submit_button"
        type="submit"
        variant="contained"
        color="primary"
        size="small"
        endIcon={<AddIcon />}>
        Mint
      </Button>
    </form>
  );
};
