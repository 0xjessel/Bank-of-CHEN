import { createSlice } from '@reduxjs/toolkit';

export const NUXDialogSlice = createSlice({
  name: 'nuxDialog',
  initialState: {
    open: false,
  },
  reducers: {
    showNUX: state => {
      state.open = true;
    },
    hideNUX: state => {
      state.open = false;
    },
  }
});

export const {
  showNUX,
  hideNUX,
} = NUXDialogSlice.actions;

export const isNUXDialogOpen = state => state.nuxDialog.open;

export default NUXDialogSlice.reducer;
