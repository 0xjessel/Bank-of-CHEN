import { createSlice } from '@reduxjs/toolkit';

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    address: '0x0',
    decimals: 18,
    isOwner: false,
    latestBlockNum: 0,
    name: null,
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setDecimals: (state, action) => {
      state.decimals = action.payload;
    },
    setLatestBlockNum: (state, action) => {
      state.latestBlockNum = action.payload;
    },
    setIsOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
  }
});

export const {
  setAddress,
  setDecimals,
  setLatestBlockNum,
  setIsOwner,
  setName,
} = accountSlice.actions;

export const getDecimals = state => state.account.decimals;
export const getAddress = state => state.account.address;
export const getLatestBlockNum = state => state.account.latestBlockNum;
export const getIsOwner = state => state.account.isOwner;
export const getName = state => state.account.name;

export default accountSlice.reducer;
