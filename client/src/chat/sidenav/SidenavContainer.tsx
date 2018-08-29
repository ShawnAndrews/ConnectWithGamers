const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Sidenav from './Sidenav';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';
import { SwipeState } from '../ChatroomMenuContainer';

export interface SidenavOption {
    imageUrl: string;
    redirect: string; 
}

interface ISidenavContainerProps extends RouteComponentProps<any> {
    sidebarWidth: number;
    swipeState: SwipeState;
}

class SidenavContainer extends React.Component<ISidenavContainerProps, any> {

    constructor(props: ISidenavContainerProps) {
        super(props);
        this.onOptionClick = this.onOptionClick.bind(this);
        const sideNavRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        const sidenavOptions: SidenavOption[] = [];
        
        sidenavOptions.push({ imageUrl: `https://i.imgur.com/GDbcIK8.png`, redirect: `/chat` });
        CHATROOMS.forEach((chatroomInfo: ChatroomInfo) => {
            sidenavOptions.push({ imageUrl: chatroomInfo.imagePath, redirect: chatroomInfo.redirect });
        });
        
        this.state = { sidenavOptions: sidenavOptions, sideNavRef: sideNavRef };
    }

    componentWillReceiveProps(newProps: ISidenavContainerProps): void {
        const divNode: HTMLDivElement = this.state.sideNavRef.current;
        
        let newLeftPosition: number;

        if (newProps.swipeState === SwipeState.Left) {
            newLeftPosition = 0;
        } else if (newProps.swipeState === SwipeState.Middle) {
            newLeftPosition = -newProps.sidebarWidth;
        } else {
            newLeftPosition = -newProps.sidebarWidth;
        }
        
        divNode.style.left = `${newLeftPosition}px`;
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
                sideNavRef={this.state.sideNavRef}
            />
        );
    }

}

export default withRouter(SidenavContainer);