import { createSlice } from '@reduxjs/toolkit';

export const snackSlice = createSlice({
  name: 'snack',
  initialState: {
    open: false,
    severity: undefined,
    message: '',
  },
  reducers: {
    openSnack: (state, action) => {
      state.open = action.payload.open;
      state.severity = action.payload.severity;
      state.message = action.payload.message;
    },
    closeSnack: state => {
      state.severity = undefined;
      state.message = '';
      state.open = false;
    }
  }
});

export const {
  openSnack,
  closeSnack,
} = snackSlice.actions;

export const selectSnackOpen = state => state.snack.open;
export const selectSnackSeverity = state => state.snack.severity;
export const selectSnackMessage = state => state.snack.message;

export default snackSlice.reducer;
