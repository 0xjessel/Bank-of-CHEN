import { createSlice } from '@reduxjs/toolkit';

export const snackSlice = createSlice({
  name: 'snack',
  initialState: {
    autoHide: true,
    open: false,
    severity: undefined,
    message: '',
  },
  reducers: {
    openSnack: (state, action) => {
      state.open = action.payload.open;
      state.severity = action.payload.severity;
      state.message = action.payload.message;
      state.autoHide = action.payload.autoHide ?? true;
    },
    closeSnack: state => {
      state.open = false;
      state.severity = undefined;
      state.message = '';
      state.autoHide = true;
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
export const selectSnackAutoHide = state => state.snack.autoHide;

export default snackSlice.reducer;
