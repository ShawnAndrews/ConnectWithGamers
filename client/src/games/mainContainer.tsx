import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Main from './main';
import { Breakpoints } from '../../client-server-common/common';

interface IMainContainerProps extends RouteComponentProps<any> { }
interface IMainContainerState {
    sidebarExpanded: boolean;
}

class MainContainer extends React.Component<IMainContainerProps, IMainContainerState> {

    constructor(props: IMainContainerProps) {
        super(props);
        this.onHamburgerClick = this.onHamburgerClick.bind(this);

        this.state = {
            sidebarExpanded: window.innerWidth >= Breakpoints.md
        };
    }

    onHamburgerClick(): void {
        this.setState({
            sidebarExpanded: !this.state.sidebarExpanded
        });
    }

    render() {
        return (
            <Main
                onHamburgerClick={this.onHamburgerClick}
                sidebarExpanded={this.state.sidebarExpanded}
            />
        );
    }

}

export default withRouter(MainContainer);