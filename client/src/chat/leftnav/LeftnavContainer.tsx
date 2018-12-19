import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Leftnav from './Leftnav';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';

export interface LeftnavOption {
    imageUrl: string;
    redirect: string; 
}

interface ILeftnavContainerProps extends RouteComponentProps<any> { }

interface ILeftnavContainerState {
    leftnavOptions: LeftnavOption[];
}

class LeftnavContainer extends React.Component<ILeftnavContainerProps, ILeftnavContainerState> {

    constructor(props: ILeftnavContainerProps) {
        super(props);
        this.onOptionClick = this.onOptionClick.bind(this);
        const leftnavOptions: LeftnavOption[] = [];

        CHATROOMS.forEach((chatroomInfo: ChatroomInfo) => {
            leftnavOptions.push({ imageUrl: chatroomInfo.imagePath, redirect: chatroomInfo.redirect });
        });
        
        this.state = {
            leftnavOptions: leftnavOptions
        };
    }

    onOptionClick(val: number): void {
        this.props.history.push(this.state.leftnavOptions[val].redirect);
    }

    render() {
        const path: string = this.props.history.location.pathname;
        const optionSelected: boolean[] = new Array<boolean>(this.state.leftnavOptions.length).fill(false);

        this.state.leftnavOptions.forEach((leftnavOption: LeftnavOption, index: number) => {
            if (path === leftnavOption.redirect || path.slice(0, -1) === leftnavOption.redirect) {
                optionSelected[index] = true;
            }
        });
        
        return (
            <Leftnav
                optionSelected={optionSelected}
                onOptionClick={this.onOptionClick}
                leftnavOptions={this.state.leftnavOptions}
            />
        );
    }

}

export default withRouter(LeftnavContainer);