import { createSlice } from '@reduxjs/toolkit';

export const printerSlice = createSlice({
  name: 'printer',
  initialState: {
    open: false,
  },
  reducers: {
    turnOnPrinter: state => {
      state.open = true;
    },
    turnOffPrinter: state => {
      state.open = false;
    },
  }
});

export const {
  turnOnPrinter,
  turnOffPrinter,
} = printerSlice.actions;

export const isPrinterOn = state => state.printer.open;
export const turnOffPrinterAsync = () => dispatch => {
  setTimeout(() => dispatch(turnOffPrinter()), 3000);
};

export default printerSlice.reducer;
