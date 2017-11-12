import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Home extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        console.log("Home rendered");
        return (
            <div>
                <p>
                    HOME HERE
                </p>
            </div>
        );
    }

}
