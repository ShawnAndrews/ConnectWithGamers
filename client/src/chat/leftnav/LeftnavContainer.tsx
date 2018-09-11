import * as Redux from 'redux';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Leftnav from './Leftnav';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';
import { SwipeState } from '../ChatroomMenuContainer';
import { ChatroomReduxState } from '../../reducers/main';
import { connect } from 'react-redux';

export interface LeftnavOption {
    imageUrl: string;
    redirect: string; 
}

interface ILeftnavContainerProps extends RouteComponentProps<any> { }

interface ILeftnavContainerState {
    leftnavOptions: LeftnavOption[];
    sideNavRef: React.RefObject<HTMLDivElement>;
    swipeState: SwipeState;
    leftNavWidth: number;
}

interface ReduxStateProps {
    swipeState: SwipeState;
    leftNavWidth: number;
}

interface ReduxDispatchProps {

}

type Props = ILeftnavContainerProps & ReduxStateProps & ReduxDispatchProps;

class LeftnavContainer extends React.Component<Props, ILeftnavContainerState> {

    constructor(props: Props) {
        super(props);
        this.updateNavPosition = this.updateNavPosition.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        const sideNavRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        const leftnavOptions: LeftnavOption[] = [];

        leftnavOptions.push({ imageUrl: `https://i.imgur.com/GDbcIK8.png`, redirect: `/chat` });
        CHATROOMS.forEach((chatroomInfo: ChatroomInfo) => {
            leftnavOptions.push({ imageUrl: chatroomInfo.imagePath, redirect: chatroomInfo.redirect });
        });
        
        this.state = { 
            leftnavOptions: leftnavOptions, 
            sideNavRef: sideNavRef,
            swipeState: props.swipeState,
            leftNavWidth: props.leftNavWidth
        };
    }

    componentDidMount(): void {
        this.updateNavPosition(this.state.swipeState, this.state.leftNavWidth);
    }

    componentWillReceiveProps(newProps: Props): void {
        this.updateNavPosition(newProps.swipeState, newProps.leftNavWidth);
    }

    updateNavPosition(swipeState: SwipeState, leftNavWidth: number): void {
        const divNode: HTMLDivElement = this.state.sideNavRef.current;
        let newLeftPosition: number;
        
        if (swipeState === SwipeState.Left) {
            newLeftPosition = 0;
        } else if (swipeState === SwipeState.Middle) {
            newLeftPosition = -leftNavWidth;
        } else {
            newLeftPosition = -leftNavWidth;
        }
        divNode.style.left = `${newLeftPosition}px`;
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
                sideNavRef={this.state.sideNavRef}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: ILeftnavContainerProps): ReduxStateProps => {
    const chatroomReduxState: ChatroomReduxState = state.chatroom;
    return {
        swipeState: chatroomReduxState.swipeState,
        leftNavWidth: chatroomReduxState.leftNavWidth
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ILeftnavContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ILeftnavContainerProps>
    (mapStateToProps, mapDispatchToProps)(LeftnavContainer));