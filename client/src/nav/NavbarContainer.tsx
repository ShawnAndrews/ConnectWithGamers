import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NAV_PAGE } from '../app/app';
import Navbar from './Navbar';
import { toggleSearchModal } from '../actions/main';

interface INavbarContainerProps extends RouteComponentProps<any> { } 

interface INavbarContainerState {
    index: number;
    searchQuery: string;
    toggleAdvancedSearch: boolean;
}

interface ReduxStateProps {
    
}

interface ReduxDispatchProps {
    toggleSearchModal: () => void;
}

type Props = INavbarContainerProps & ReduxStateProps & ReduxDispatchProps;

class NavbarContainer extends React.Component<Props, INavbarContainerState> {

    constructor(props: Props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
        this.updateNavSelection = this.updateNavSelection.bind(this);
        this.onToggleAdvancedSearch = this.onToggleAdvancedSearch.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);

        const onLoginScreen: boolean = props.history.location.pathname.startsWith(NAV_PAGE.ACCOUNT);

        this.state = {
            index: onLoginScreen ? 3 : undefined,
            searchQuery: '',
            toggleAdvancedSearch: false
        };
    }

    componentWillMount(): void {
        this.updateNavSelection(this.props.history.location.pathname);
    }

    componentWillReceiveProps(newProps: INavbarContainerProps): void {
        this.updateNavSelection(newProps.history.location.pathname);
    }

    updateNavSelection(path: string): void {
        if (path === NAV_PAGE.HOME) {
            this.setState({ index: 0 });
        } else if (path.startsWith(NAV_PAGE.GAMES)) {
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

    onToggleAdvancedSearch(): void {
        this.props.toggleSearchModal();
    }

    onSubmitSearch(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        this.props.history.push(`/games/search/filter/?query=${this.state.searchQuery}`);
    }

    onSearchQueryChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchQuery: e.target.value });
    }

    render() {
        return (
            <Navbar
                index={this.state.index}
                searchQuery={this.state.searchQuery}
                toggleAdvancedSearch={this.state.toggleAdvancedSearch}
                onTabClick={this.onTabClick}
                onToggleAdvancedSearch={this.onToggleAdvancedSearch}
                onSubmitSearch={this.onSubmitSearch}
                onSearchQueryChanged={this.onSearchQueryChanged}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: INavbarContainerProps): ReduxStateProps => ({});

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: INavbarContainerProps): ReduxDispatchProps => ({
    toggleSearchModal: () => { dispatch(toggleSearchModal()); },
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, INavbarContainerProps>
    (mapStateToProps, mapDispatchToProps)(NavbarContainer));