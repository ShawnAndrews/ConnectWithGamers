import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/app';
import { BrowserRouter } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './styles/main';

ReactDOM.render(
    <BrowserRouter>
      <MuiThemeProvider>
        <App/>
      </MuiThemeProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
