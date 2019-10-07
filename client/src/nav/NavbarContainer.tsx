const popupS = require('popups');
import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NAV_PAGE } from '../app/app';
import Navbar from './Navbar';
import { httpGetPublicAccountInfo, httpGetGameSuggestions } from '../service/account/main';
import { AccountInfoResponse, CurrencyType, GameSuggestion, GameSuggestionsResponse } from '../../client-server-common/common';
import { GlobalReduxState } from '../reducers/main';
import { changeCurrency } from '../actions/main';
import { getCurrencyByCookie, getCurrencyRate } from '../util/main';
import { SuggestionSelectedEventData } from 'react-autosuggest';


interface INavbarContainerProps extends RouteComponentProps<any> { } 

interface INavbarContainerState {
    index: number;
    searchQuery: string;
    profileImage: string;
    profileName: string;
    currencyAnchorEl: HTMLElement;
    suggestions: GameSuggestion[];
    searchValue: string;
    allSuggestions: GameSuggestion[];
}

interface ReduxStateProps {
    loggedIn: boolean;
    currencyType: CurrencyType;
}

interface ReduxDispatchProps {
    changeCurrency: (newCurrencyType: CurrencyType, currencyRate: number) => void;
}

type Props = INavbarContainerProps & ReduxStateProps & ReduxDispatchProps;

class NavbarContainer extends React.Component<Props, INavbarContainerState> {

    constructor(props: Props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
        this.updateNavSelection = this.updateNavSelection.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.loadPublicAccountInfo = this.loadPublicAccountInfo.bind(this);
        this.onRedirect = this.onRedirect.bind(this);
        this.onCurrencyClick = this.onCurrencyClick.bind(this);
        this.onCurrencyClose = this.onCurrencyClose.bind(this);
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.setNewCurrency = this.setNewCurrency.bind(this);

        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.loadGameSuggestions = this.loadGameSuggestions.bind(this);

        const onLoginScreen: boolean = props.history.location.pathname.startsWith(NAV_PAGE.ACCOUNT);
        const newCurrencyType: CurrencyType = getCurrencyByCookie();

        this.state = {
            index: onLoginScreen ? 3 : undefined,
            searchQuery: '',
            profileImage: undefined,
            profileName: undefined,
            currencyAnchorEl: null,
            suggestions: [],
            allSuggestions: undefined,
            searchValue: ''
        };

        if (this.props.loggedIn) {
            this.loadPublicAccountInfo();
        }

        this.loadGameSuggestions();

        this.setNewCurrency(newCurrencyType);
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
            const profileLink: string = `/cache/chatroom/profile/${response.data.accountid}.${response.data.profile_file_extension}`;

            this.setState({
                profileImage: Boolean(response.data.profile) ? profileLink : undefined,
                profileName: response.data.username
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• ${error}</div>` });
        });

    }

    loadGameSuggestions(): void {
        
        httpGetGameSuggestions()
        .then((response: GameSuggestionsResponse) => {
            this.setState({
                allSuggestions: response.data
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• ${error}</div>` });
        });

    }

    onSuggestionsFetchRequested({ value }): void {
        const getSuggestions = (x: string) => {
            const inputValue = x.trim().toLowerCase();
            const inputLength = inputValue.length;

            return inputLength === 0 ? [] : this.state.allSuggestions.filter(suggestion => suggestion.name.toLowerCase().includes(inputValue)).slice(0, 5);
        };

        this.setState({
          suggestions: getSuggestions(value)
        });
    };

    onSuggestionSelected(event: React.FormEvent<any>, data: SuggestionSelectedEventData<GameSuggestion>): void {
        this.props.history.push(`/search/game/${data.suggestion.steamId}`);
    }

    onSuggestionsClearRequested(): void {
        this.setState({
            suggestions: []
        });
    };

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

    onRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    onCurrencyClick(e: React.MouseEvent<HTMLElement>): void {
        this.setState({ currencyAnchorEl: e.currentTarget });
    }

    onCurrencyClose(): void {
        this.setState({ currencyAnchorEl: null });
    }

    onCurrencyChange(newCurrencyType: CurrencyType): void {

        if (this.props.currencyType !== newCurrencyType) {
            this.setNewCurrency(newCurrencyType);
            this.onCurrencyClose();
        }

    }

    setNewCurrency(newCurrencyType: CurrencyType): void {

        getCurrencyRate(newCurrencyType)
            .then((newCurrencyRate: number) => {
                this.props.changeCurrency(newCurrencyType, newCurrencyRate);
            })
            .catch((error: string) => {
                console.log(`Error retreiving currency rate information: ${error}`);
            });

    }

    onSearchChange(event: any, { newValue }): void {
        this.setState({
            searchValue: newValue
        });
    };

    render() {
        return (
            <Navbar
                index={this.state.index}
                searchQuery={this.state.searchQuery}
                onTabClick={this.onTabClick}
                onSubmitSearch={this.onSubmitSearch}
                onRedirect={this.onRedirect}
                profileImage={this.state.profileImage}
                profileName={this.state.profileName}
                currencyAnchorEl={this.state.currencyAnchorEl}
                onCurrencyClick={this.onCurrencyClick}
                onCurrencyClose={this.onCurrencyClose}
                onCurrencyChange={this.onCurrencyChange}
                currencyType={this.props.currencyType}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                SearchValue={this.state.searchValue}
                onSearchChange={this.onSearchChange}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: INavbarContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        loggedIn: globalModalReduxState.topnav.loggedIn,
        currencyType: globalModalReduxState.topnav.currencyType
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: INavbarContainerProps): ReduxDispatchProps => ({
    changeCurrency: (newCurrencyType: CurrencyType, newCurrencyRate: number) => { dispatch(changeCurrency(newCurrencyType, newCurrencyRate)); },
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, INavbarContainerProps>
    (mapStateToProps, mapDispatchToProps)(NavbarContainer));