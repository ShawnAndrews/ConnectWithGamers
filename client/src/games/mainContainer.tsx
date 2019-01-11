import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Main from './main';
import { Breakpoints } from '../../client-server-common/common';

interface IMainContainerProps extends RouteComponentProps<any> { }
interface IMainContainerState {
    filterExpanded: boolean;
}

class MainContainer extends React.Component<IMainContainerProps, IMainContainerState> {

    constructor(props: IMainContainerProps) {
        super(props);
        this.onHamburgerClick = this.onHamburgerClick.bind(this);

        this.state = {
            filterExpanded: window.innerWidth >= Breakpoints.md
        };
    }

    onHamburgerClick(): void {
        this.setState({
            filterExpanded: !this.state.filterExpanded
        });
    }

    render() {
        return (
            <Main
                onHamburgerClick={this.onHamburgerClick}
                filterExpanded={this.state.filterExpanded}
            />
        );
    }

}

export default withRouter(MainContainer);