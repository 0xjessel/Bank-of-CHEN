import { createSlice } from '@reduxjs/toolkit';

export const currentBalanceSlice = createSlice({
  name: 'currentBalance',
  initialState: {
    count: 0,
  },
  reducers: {
    setCurrentBalance: (state, action) => {
      state.count = action.payload;
    },
  }
});

export const {
  setCurrentBalance,
} = currentBalanceSlice.actions;

export const getCurrentBalance = state => state.currentBalance.count;

export default currentBalanceSlice.reducer;
