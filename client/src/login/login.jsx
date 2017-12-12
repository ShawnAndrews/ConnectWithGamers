import * as React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';


const styles = {
    body: {
        height: 'calc(100vh - 120px)',
        width: '100%',
        margin: '20px auto',
        padding: '50px',
        display: 'inline-block',
    },
    logoWrapper: {
        height: '250px',
        width: '250px',
        margin: 'auto',
    },
    logo: {
        margin: '10px',
    },
    loginAndSignUpBlock: {
        margin: 'auto',
        textAlign: 'center'
    },
    loginAndSignUpBtn: {
        width: '100px',
        display: 'inline-block',
        margin: '15px'
    },
    rememberMe: {
        width: '160px',
        textAlign: 'center',
        margin: '15px auto 0 auto'
    },
    rememberMeLabel: {
        color: '#00BCD4'
    },
    loginStyle: {
        textAlign: 'center'
    },
};

class Login extends React.Component {


	constructor(props) {
        super(props);
	}

	componentWillMount(){

    }

	loginBtnClick() {
        //this.props.onLoginClick({type: 'ADD_TODO', data: 'Bob'});
	    console.log('Logged in!');
        //this.props.authenticated();
    }

    signUpBtnClick() {
        //this.props.onLoginClick({type: 'SUB_TODO', newUser: 'Jim'});
        console.log('Signed up in!');
        //this.props.authenticated();
    }

    render() {
        console.log("Login rendered with props ", this.props);
        console.log(this.props.store);
        return (
                <Paper style={styles.body} zDepth={1}>
                    <div style={styles.logoWrapper}>
                        <img src="https://i.imgur.com/U9yx972.png" style={styles.logo} alt="logo"/>
                    </div>
                    <div style={styles.loginStyle}>
                        <TextField
                            hintText="Input your username here"
                            floatingLabelText="Username"
                        /><br />
                        <TextField
                          hintText="Input your password here"
                          floatingLabelText="Password"
                          type="password"
                        /><br />
                    </div>
                    <Toggle
                        label="Remember me"
                        labelStyle={styles.rememberMeLabel}
                        defaultToggled={false}
                        labelPosition="left"
                        style={styles.rememberMe}
                    />
                    <div style={styles.loginAndSignUpBlock}>
                        <RaisedButton label="Login" onClick={this.loginBtnClick.bind(this)} primary={true} style={styles.loginAndSignUpBtn}></RaisedButton>
                        <RaisedButton label="Sign up" secondary={true} onClick={this.signUpBtnClick.bind(this)} style={styles.loginAndSignUpBtn} />
                    </div>
                </Paper>
        );
    }

}

Login.propTypes = {
    history: PropTypes.object.isRequired,
    authenticated: PropTypes.func.isRequired,
}

export default withRouter(Login);