import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

export default function(props) {
  return (
    <TextField
      {...props}
      variant="outlined"
      size="small"
      InputProps={{
        endAdornment: <InputAdornment position="start">陈CHEN</InputAdornment>,
      }}
    />
  );
}
