import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Main from './Sidenav';
import { SidenavEnums } from '../../../client-server-common/common';

interface IMainContainerProps extends RouteComponentProps<any> {
    onSidenavItemClick: (itemEnum: SidenavEnums) => void;
    sidebarActiveEnum: SidenavEnums;
}

interface IMainContainerState {

}

class MainContainer extends React.Component<IMainContainerProps, IMainContainerState> {

    constructor(props: IMainContainerProps) {
        super(props);
    }

    render() {
        return (
            <Main
                onSidenavItemClick={this.props.onSidenavItemClick}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
            />
        );
    }

}

export default withRouter(MainContainer);