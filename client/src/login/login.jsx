import * as React from 'react';
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

    handleSubmit(event) {
        console.log('A name was submitted: ' + this.state.value);
      }

    render() {
        console.log("Login rendered with props ", this.props);
        console.log(this.props.store);
        return (
                <div>
                    <div class="login-background">
                        <ul class="login-floats">
                            <li/>
                            <li/>
                            <li/>
                            <li/>
                            <li/>
                            <li/>
                            <li/>
                            <li/>
                            <li/>
                            <li/>
                        </ul>
                    </div>
                    <div class="center">
                        <div class="login-logo"/>
                        <form class="login-form">
                            <input type="text" class="login-form-username" placeholder="Username" />
                            <input type="password" class="login-form-password" placeholder="Password" />
                            <button type="submit" class="login-form-submit" ><i class="fa fa-sign-in" />Login</button>
                            <button type="button" class="login-form-signup" ><i class="fa fa-user-o" />Sign Up</button>
                        </form>
                    </div>
                    <div class="login-icons">
                        <span><a href="https://twitter.com/ConnectWithGamers" target="_blank"><i class="fa fa-twitter fa-2x"></i></a></span>
                        <span><a href="https://github.com/ShawnAndrews/ConnectWithGamers" target="_blank"><i class="fa fa-github fa-2x"></i></a></span>
                        <span><a href="https://www.linkedin.com/in/shawnandrewsur/" target="_blank"><i class="fa fa-linkedin fa-2x"></i></a></span>
                        <span><a href="https://www.youtube.com/channel/UCLrdQcxsSZsYwY69uH9D0QA/videos" target="_blank"><i class="fa fa-youtube fa-2x"></i></a></span>
                        <span><a href="http://www.saportfolio.ca" target="_blank"><i class="fa fa-cloud fa-2x"></i></a></span>
                    </div>
                </div>
        );
    }

}

Login.propTypes = {
    history: PropTypes.object.isRequired,
    authenticated: PropTypes.func.isRequired,
}

export default withRouter(Login);