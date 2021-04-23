import { createSlice } from '@reduxjs/toolkit';

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    address: '0x0',
    decimals: 18,
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setDecimals: (state, action) => {
      state.decimals = action.payload;
    },
  }
});

export const {
  setAddress,
  setDecimals,
} = accountSlice.actions;

export const getDecimals = state => state.account.decimals;
export const getAddress = state => state.account.address;

export default accountSlice.reducer;
