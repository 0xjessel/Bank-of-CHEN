import { createSlice } from '@reduxjs/toolkit';

export const tokenSupplySlice = createSlice({
  name: 'tokenSupply',
  initialState: {
    count: 0,
  },
  reducers: {
    setTokenSupply: (state, action) => {
      state.count = action.payload;
    },
  }
});

export const {
  setTokenSupply,
} = tokenSupplySlice.actions;

export const getTokenSupply = state => state.tokenSupply.count;

export default tokenSupplySlice.reducer;
