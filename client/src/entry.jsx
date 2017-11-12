import './css/style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/app';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore, combineReducers  } from 'redux'


const dashboardReducer = (state = null, action) => {

    console.log("Dashboard reducer called with state ", state, "and action ", action);

    if(action.type=='ADD_TODO'){
        console.log("Received ADD_TODO, state: ", state)
        console.log("Received ADD_TODO, action data: ", action.data)
        return {
            state,
            user: action.data
        }
    }else{
        return state;
    }

};

const loginReducer = (state = null, action) => {

    console.log("Login reducer called with state ", state, "and action ", action);

    if(action.type=='ADD_TODO'){
        return state;
    }else{
        return state;
    }

};

let store = createStore(combineReducers({dashboardReducer, loginReducer}));

//store.dispatch({type: 'ADD_TODO', data: 'hi'});

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
          <App/>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
