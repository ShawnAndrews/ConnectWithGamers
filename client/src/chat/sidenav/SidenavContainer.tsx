const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Sidenav from './Sidenav';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';

export interface SidenavOption {
    imageUrl: string;
    redirect: string; 
}

interface ISidenavContainerProps extends RouteComponentProps<any> {
    sidebarWidth: number;
    movedXPos: number;
}

class SidenavContainer extends React.Component<ISidenavContainerProps, any> {

    constructor(props: ISidenavContainerProps) {
        super(props);
        this.onOptionClick = this.onOptionClick.bind(this);
        const sideNavRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        const onUsersPage: boolean = props.location.pathname.startsWith('/chat/users');
        const onSettingsPage: boolean = props.location.pathname.startsWith('/chat/settings');
        const sidenavOptions: SidenavOption[] = [];
        
        sidenavOptions.push({ imageUrl: `https://i.imgur.com/GDbcIK8.png`, redirect: `/chat` });
        CHATROOMS.forEach((chatroomInfo: ChatroomInfo) => {
            sidenavOptions.push({ imageUrl: chatroomInfo.imagePath, redirect: chatroomInfo.redirect });
        });
        
        this.state = { sidenavOptions: sidenavOptions, sideNavRef: sideNavRef, originalSideNavXPos: `-${props.sidebarWidth}px`, onUsersPage: onUsersPage };
    }

    componentWillReceiveProps(newProps: ISidenavContainerProps): void {
        const onUsersPage: boolean = newProps.location.pathname.startsWith('/chat/users');
        const onSettingsPage: boolean = newProps.location.pathname.startsWith('/chat/settings');
        const divNode: HTMLDivElement = this.state.sideNavRef.current;
        let newSideNavXPos: string = parseInt( this.state.originalSideNavXPos, 10 ) + newProps.movedXPos + "px";
        divNode.style.left = newSideNavXPos;
        this.setState({ onUsersPage: onUsersPage, onSettingsPage: onSettingsPage });
    }

    onOptionClick(val: number): void {
        this.props.history.push(this.state.sidenavOptions[val].redirect);
    }

    render() {
        const path: string = this.props.history.location.pathname;
        const optionSelected: boolean[] = new Array<boolean>(this.state.sidenavOptions.length).fill(false);

        this.state.sidenavOptions.forEach((sidenavOption: SidenavOption, index: number) => {
            if (path === sidenavOption.redirect || path.slice(0, -1) === sidenavOption.redirect) {
                optionSelected[index] = true;
            }
        });
        
        return (
            <Sidenav
                optionSelected={optionSelected}
                onOptionClick={this.onOptionClick}
                sidenavOptions={this.state.sidenavOptions}
                onUsersPage={this.state.onUsersPage}
                onSettingsPage={this.state.onSettingsPage}
                sideNavRef={this.state.sideNavRef}
            />
        );
    }

}

export default withRouter(SidenavContainer);