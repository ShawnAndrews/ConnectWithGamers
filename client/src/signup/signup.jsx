import * as React from 'react';

// import Paper from 'material-ui/Paper';
// import RaisedButton from 'material-ui/RaisedButton';
// import Toggle from 'material-ui/Toggle';
// import TextField from 'material-ui/TextField';
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
    createBlock: {
        margin: 'auto',
        textAlign: 'center'
    },
    createBtn: {
        width: '200px',
        display: 'inline-block',
        margin: '15px'
    },
    signupStyle: {
        textAlign: 'center',
        color: 'rgb(0, 188, 212)',
    },
    headerTextStyle: {
        fontSize: '30px',
    }
};

class Signup extends React.Component {


    constructor(props) {
        super(props);
    }

    componentWillMount(){

    }

    render() {
        console.log("Signup rendered with props ", this.props);
        console.log(this.props.store);
        return (
            // <Paper style={styles.body} zDepth={1}>
            //     <div style={styles.signupStyle}>
            //         <p style={styles.headerTextStyle}>Create a new account</p>
            //         <TextField
            //             hintText="Input your username here"
            //             floatingLabelText="Username"
            //         /><br />
            //         <TextField
            //             hintText="Input your password here"
            //             floatingLabelText="Password"
            //             type="password"
            //         /><br />
            //         <TextField
            //             hintText="Confirm your password here"
            //             floatingLabelText="Confirm password"
            //             type="password"
            //         /><br />
            //         <TextField
            //             hintText="Enter your email here"
            //             floatingLabelText="Email"
            //         /><br />
            //     </div>
            //     <div style={styles.createBlock}>
            //         <RaisedButton label="Create account" secondary={true} style={styles.createBtn} />
            //     </div>
            // </Paper>
            <div>
                <h1>Sign up page</h1>
            </div>
        );
    }

}

Signup.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(Signup);