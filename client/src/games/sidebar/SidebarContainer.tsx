import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Sidebar from './Sidebar';

interface ISidebarContainerProps extends RouteComponentProps<any> {
    sidebarExpanded: boolean;
}
interface ISidebarContainerState {
    searchQuery: string;
}

class SidebarContainer extends React.Component<ISidebarContainerProps, ISidebarContainerState> {

    constructor(props: ISidebarContainerProps) {
        super(props);
        this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);
        this.onSearchKeypress = this.onSearchKeypress.bind(this);
        this.goToRedirect = this.goToRedirect.bind(this);

        this.state = {
            searchQuery: ''
        };
    }

    onSearchQueryChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchQuery: e.target.value });
    }

    onSearchKeypress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.props.history.push(`/games/search/filter/?query=${this.state.searchQuery}`);
        }
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    render() {
        return (
            <Sidebar
                goToRedirect={this.goToRedirect}
                onSearchKeypress={this.onSearchKeypress}
                onSearchQueryChanged={this.onSearchQueryChanged}
                sidebarExpanded={this.props.sidebarExpanded}
            />
        );
    }

}

export default withRouter(SidebarContainer);