const popupS = require('popups');
import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NAV_PAGE } from '../app/app';
import Navbar from './Navbar';
import { httpGetPublicAccountInfo } from '../service/account/main';
import { AccountInfoResponse } from '../../client-server-common/common';
import { GlobalReduxState } from '../reducers/main';

interface INavbarContainerProps extends RouteComponentProps<any> { } 

interface INavbarContainerState {
    index: number;
    searchQuery: string;
    profileImage: string;
    profileName: string;
}

interface ReduxStateProps {
    loggedIn: boolean;
}

interface ReduxDispatchProps {
    
}

type Props = INavbarContainerProps & ReduxStateProps & ReduxDispatchProps;

class NavbarContainer extends React.Component<Props, INavbarContainerState> {

    constructor(props: Props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
        this.updateNavSelection = this.updateNavSelection.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);
        this.loadPublicAccountInfo = this.loadPublicAccountInfo.bind(this);
        this.onRedirect = this.onRedirect.bind(this);

        const onLoginScreen: boolean = props.history.location.pathname.startsWith(NAV_PAGE.ACCOUNT);

        if (this.props.loggedIn) {
            this.loadPublicAccountInfo();
        }

        this.state = {
            index: onLoginScreen ? 3 : undefined,
            searchQuery: '',
            profileImage: undefined,
            profileName: undefined
        };
    }

    componentWillMount(): void {
        this.updateNavSelection(this.props.history.location.pathname);
    }

    componentWillReceiveProps(newProps: Props): void {
        this.updateNavSelection(newProps.history.location.pathname);
        if (newProps.loggedIn != this.props.loggedIn) {
            if (newProps.loggedIn) {
                this.loadPublicAccountInfo();
            } else {
                this.setState({
                    profileImage: undefined,
                    profileName: undefined
                });
            }
        }
    }

    loadPublicAccountInfo(): void {
        
        httpGetPublicAccountInfo()
        .then((response: AccountInfoResponse) => {
            this.setState({
                profileImage: response.data.image,
                profileName: response.data.username
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• ${error}</div>` });
        });

    }

    updateNavSelection(path: string): void {
        if (path === NAV_PAGE.HOME) {
            this.setState({ index: 0 });
        } else if (path.startsWith(NAV_PAGE.LIBRARY)) {
            this.setState({ index: 1 });
        } else if (path.startsWith(NAV_PAGE.CHATROOM)) {
            this.setState({ index: 2 });
        } else if (path.startsWith(NAV_PAGE.ACCOUNT)) {
            this.setState({ index: 3 });
        } else {
            this.setState({ index: -1 });
        }
    }

    onTabClick(path: string): void {
        this.props.history.push(path);
    }

    onSubmitSearch(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        this.props.history.push(`/search/filter/?query=${this.state.searchQuery}`);
    }

    onSearchQueryChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchQuery: e.target.value });
    }

    onRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    render() {
        return (
            <Navbar
                index={this.state.index}
                searchQuery={this.state.searchQuery}
                onTabClick={this.onTabClick}
                onSubmitSearch={this.onSubmitSearch}
                onSearchQueryChanged={this.onSearchQueryChanged}
                onRedirect={this.onRedirect}
                profileImage={this.state.profileImage}
                profileName={this.state.profileName}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: INavbarContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;
    return {
        loggedIn: globalModalReduxState.topnav.loggedIn
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: INavbarContainerProps): ReduxDispatchProps => ({
    
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, INavbarContainerProps>
    (mapStateToProps, mapDispatchToProps)(NavbarContainer));