import * as Redux from 'redux';
import * as React from 'react';
import Home from './Home';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { toggleSearchModal } from '../../actions/main';

interface IHomeContainerProps extends RouteComponentProps<any> { }

interface IHomeContainerState {
    searchQuery: string;
}

interface ReduxStateProps {
    
}

interface ReduxDispatchProps {
    toggleSearchModal: () => void;
}

type Props = IHomeContainerProps & ReduxStateProps & ReduxDispatchProps;

class HomeContainer extends React.Component<Props, IHomeContainerState> {

    constructor(props: Props) {
        super(props);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onAdvancedSearch = this.onAdvancedSearch.bind(this);

        this.state = {
            searchQuery: ''
        };

    }

    onKeyPress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.onSearch();
        }
    }

    onSearchQueryChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchQuery: e.target.value });
    }

    onSearch(): void {
        this.props.history.push(`/games/search/filter/?query=${this.state.searchQuery}&sort=popularity-desc`);
    }

    onAdvancedSearch(): void {
        this.props.toggleSearchModal();
    }

    render() {
        return (
            <Home
                searchQuery={this.state.searchQuery}
                onSearchQueryChanged={this.onSearchQueryChanged}
                onSearch={this.onSearch}
                onAdvancedSearch={this.onAdvancedSearch}
                onKeyPress={this.onKeyPress}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IHomeContainerProps): ReduxStateProps => ({});

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IHomeContainerProps): ReduxDispatchProps => ({
    toggleSearchModal: () => { dispatch(toggleSearchModal()); },
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IHomeContainerProps>
    (mapStateToProps, mapDispatchToProps)(HomeContainer));