const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import { validateCredentials, ResponseModel } from '../../../client/client-server-common/common';
import * as AccountService from '../service/account/main';

interface ISignupFormProps {
    history: any;
}

class SignupForm extends React.Component<ISignupFormProps, any> {

    constructor(props: ISignupFormProps) {
        super(props);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.emailChanged = this.emailChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
        this.onClickBack = this.onClickBack.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            isLoading: false
        };
    }

    usernameChanged(event: any) {
        this.setState({username: event.target.value});
    }

    emailChanged(event: any) {
        this.setState({email: event.target.value});
    }

    passwordChanged(event: any) {
        this.setState({password: event.target.value});
    }

    onClickCreate(event: any) {
        event.preventDefault();

        // validate
        const response: ResponseModel = validateCredentials(this.state.username, this.state.password, this.state.email);
        if (response.errors.length > 0) {
            const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
            popupS.modal({ content: formattedErrors.join('') });
            return;
        }
        
        // request signup
        this.setState({isLoading: true});
        AccountService.httpSignup(this.state.username, this.state.password, this.state.email)
            .then( (response: ResponseModel) => {
                this.props.history.push('/account/login');
            })
            .catch( (response: ResponseModel) => {
                console.log('resp: ', JSON.stringify(response));
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                this.setState({ username: '', email: '', password: '', isLoading: false });
                popupS.modal({ content: formattedErrors.join('') });
            });

    }

    onClickBack() {
        this.props.history.goBack();
    }

    render() {
        
        if (this.state.isLoading) {
            return <Spinner loadingMsg="Creating account..." />;
        }

        return (
            <div>
                <div className="account-logo"/>
                <form className="account-form" onSubmit={this.onClickCreate}>
                    <input type="text" className="account-form" placeholder="Username" onChange={this.usernameChanged} />
                    <input type="email" className="account-form" placeholder="Email" onChange={this.emailChanged} />
                    <input type="password" className="account-form" placeholder="Password" onChange={this.passwordChanged} />
                    <button type="submit" className="account-form-create" ><i className="fa fa-user-plus" />Sign up</button>
                    <button type="button" className="account-form-back" onClick={this.onClickBack}><i className="fa fa-arrow-left" />Back</button>
                </form>
            </div>
        );
    }

}

export default withRouter(SignupForm);