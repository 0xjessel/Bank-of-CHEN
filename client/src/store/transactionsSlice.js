import { createSlice } from '@reduxjs/toolkit';

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    rows: [],
  },
  reducers: {
    prependRow: (state, action) => {
      state.rows = [action.payload, ...state.rows].sort(
        (x, y) => y.timestamp - x.timestamp
      );
    },
  }
});

export const {
  prependRow,
} = transactionsSlice.actions;

export const selectRows = state => state.transactions.rows;

export default transactionsSlice.reducer;
