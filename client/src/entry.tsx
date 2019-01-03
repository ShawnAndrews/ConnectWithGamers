import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/app';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Reducer from './reducers/main';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './scroll/ScrollToTop';

import './styles/main';

const store = createStore(Reducer);


ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<ScrollToTop>
				<App/>	
			</ScrollToTop>
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
