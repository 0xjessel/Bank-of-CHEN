import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CHENTextField from './CHENTextField';

export default function MintForm(props) {
  const [value, setValue] = useState(0);

  return (
    <form
      className="mint_form"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(value);
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
