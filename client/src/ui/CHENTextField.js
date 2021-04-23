import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

export default function CHENTextField(props) {
  const { isCurrency, ...otherProps } = props;

  return (
    <TextField
      {...otherProps}
      variant="outlined"
      size="small"
      type={isCurrency ? "number" : undefined}
      InputProps={{
        endAdornment: isCurrency ?
          <InputAdornment position="start">陈CHEN</InputAdornment> :
          undefined,
      }}
    />
  );
}
