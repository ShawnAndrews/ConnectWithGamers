import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Main from './main';
import { SidenavEnums } from '../../client-server-common/common';

interface IMainContainerProps extends RouteComponentProps<any> { }

interface IMainContainerState {
    sidebarActiveEnum: SidenavEnums;
}

class MainContainer extends React.Component<IMainContainerProps, IMainContainerState> {

    constructor(props: IMainContainerProps) {
        super(props);
        this.onSidenavItemClick = this.onSidenavItemClick.bind(this);

        const width: number = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        this.state = {
            sidebarActiveEnum: width > 800 ? SidenavEnums.home : undefined
        };
    }

    onSidenavItemClick(itemEnum: SidenavEnums): void {
        const clickedCurrentlyActiveEnum: boolean = itemEnum === this.state.sidebarActiveEnum;

        if (itemEnum === SidenavEnums.news) {
            this.props.history.push(`/news`);
        }

        this.setState({
            sidebarActiveEnum: itemEnum === SidenavEnums.news ? undefined : !clickedCurrentlyActiveEnum ? itemEnum : undefined
        });
        
    }

    render() {
        return (
            <Main
                onSidenavItemClick={this.onSidenavItemClick}
                sidebarActiveEnum={this.state.sidebarActiveEnum}
            />
        );
    }

}

export default withRouter(MainContainer);