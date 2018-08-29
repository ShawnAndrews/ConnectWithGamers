const popupS = require('popups');
import * as React from 'react';
import ChatroomMenu from './ChatroomMenu';

export enum SwipeState {
    'Left',
    'Middle',
    'Right'
}

class ChatroomMenuContainer extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.onSwipedLeft = this.onSwipedLeft.bind(this);
        this.onSwipedRight = this.onSwipedRight.bind(this);

        const sidebarWidth: number = 50;
        const usersbarWidth: number = 200;

        this.state = { swipeState: SwipeState.Middle, sidebarWidth: sidebarWidth, usersbarWidth: usersbarWidth };
    }

    onSwipedLeft(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        let newSwipeState: SwipeState = this.state.swipeState;

        if (this.state.swipeState === SwipeState.Left) {
            newSwipeState = SwipeState.Middle;
        } else if (this.state.swipeState === SwipeState.Middle) {
            newSwipeState = SwipeState.Right;
        }

        this.setState({ swipeState: newSwipeState });
    }

    onSwipedRight(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        let newSwipeState: SwipeState = this.state.swipeState;

        if (this.state.swipeState === SwipeState.Right) {
            newSwipeState = SwipeState.Middle;
        } else if (this.state.swipeState === SwipeState.Middle) {
            newSwipeState = SwipeState.Left;
        }

        this.setState({ swipeState: newSwipeState });
    }

    render() {
        return (
            <ChatroomMenu
                onSwipedLeft={this.onSwipedLeft}
                onSwipedRight={this.onSwipedRight}
                swipeState={this.state.swipeState}
                sidebarWidth={this.state.sidebarWidth}
                usersbarWidth={this.state.usersbarWidth}
            />
        );
    }

}

export default ChatroomMenuContainer;