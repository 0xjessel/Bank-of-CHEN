import { createSlice } from '@reduxjs/toolkit';

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    rows: [],
    maxRows: 10,
  },
  reducers: {
    prependRow: (state, action) => {
      state.rows = [action.payload, ...state.rows].sort(
        (x, y) => y.timestamp - x.timestamp
      ).slice(0, state.maxRows);
    },
  }
});

export const {
  prependRow,
} = transactionsSlice.actions;

export const selectRows = state => state.transactions.rows;

export default transactionsSlice.reducer;
