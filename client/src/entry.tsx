import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './styles/main';

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <MuiThemeProvider>
          <App/>
        </MuiThemeProvider>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
