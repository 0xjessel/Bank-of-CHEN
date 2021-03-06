import App from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
import store from './store/store';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import './css/index.css';

import reportWebVitals from './reportWebVitals';

const theme = createTheme({
  palette: {
    type: "dark",
  },
  typography: {
    fontFamily: [
      'Noto Serif',
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
