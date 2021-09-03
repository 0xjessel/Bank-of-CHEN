import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './accountSlice';
import currentBalanceSlice from './currentBalanceSlice';
import NUXDialogSlice from './NUXDialogSlice';
import printerSlice from './printerSlice';
import snackSlice from './snackSlice';
import tokenSupplySlice from './tokenSupplySlice';
import transactionsSlice from './transactionsSlice';

export default configureStore({
  reducer: {
    account: accountSlice,
    currentBalance: currentBalanceSlice,
    nuxDialog: NUXDialogSlice,
    printer: printerSlice,
    snack: snackSlice,
    tokenSupply: tokenSupplySlice,
    transactions: transactionsSlice,
  },
});

