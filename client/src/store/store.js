import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './accountSlice';
import currentBalanceSlice from './currentBalanceSlice';
import printerSlice from './printerSlice';
import snackSlice from './snackSlice';
import tokenSupplySlice from './tokenSupplySlice';
import transactionsSlice from './transactionsSlice';

export default configureStore({
  reducer: {
    account: accountSlice,
    currentBalance: currentBalanceSlice,
    printer: printerSlice,
    snack: snackSlice,
    tokenSupply: tokenSupplySlice,
    transactions: transactionsSlice,
  },
});

