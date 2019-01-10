import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Sidebar from './Sidebar';

interface ISidebarContainerProps extends RouteComponentProps<any> {
    sidebarExpanded: boolean;
}
interface ISidebarContainerState {
    searchTerm: string;
    filterOptions: string;
}

class SidebarContainer extends React.Component<ISidebarContainerProps, ISidebarContainerState> {

    constructor(props: ISidebarContainerProps) {
        super(props);
        this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);
        this.onSearchKeypress = this.onSearchKeypress.bind(this);
        this.goToRedirect = this.goToRedirect.bind(this);
        this.updateFilterOptions = this.updateFilterOptions.bind(this);

        this.state = {
            searchTerm: '',
            filterOptions: ''
        };
    }

    onSearchQueryChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchTerm: e.target.value });
    }

    onSearchKeypress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.props.history.push(`/games/search/filter/?query=${this.state.searchTerm}`);
        }
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    updateFilterOptions(filterOptions: string): void {
        this.setState({
            filterOptions: filterOptions
        });
    }

    render() {
        return (
            <Sidebar
                goToRedirect={this.goToRedirect}
                onSearchKeypress={this.onSearchKeypress}
                onSearchQueryChanged={this.onSearchQueryChanged}
                sidebarExpanded={this.props.sidebarExpanded}
                updateFilterOptions={this.updateFilterOptions}
                searchTerm={this.state.searchTerm}
            />
        );
    }

}

export default withRouter(SidebarContainer);