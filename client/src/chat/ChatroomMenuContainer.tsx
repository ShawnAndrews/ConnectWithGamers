const popupS = require('popups');
import * as React from 'react';
import ChatroomMenu from './ChatroomMenu';

class ChatroomMenuContainer extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.onSwipingLeft = this.onSwipingLeft.bind(this);
        this.onSwipingRight = this.onSwipingRight.bind(this);
        this.onSwipedLeft = this.onSwipedLeft.bind(this);
        this.onSwipedRight = this.onSwipedRight.bind(this);

        const sidebarWidth: number = 50;

        this.state = {oldLeftPos: -1, oldRightPos: -1, movedXPos: 0, expanded: false, sidebarWidth: sidebarWidth };
    }

    toggleSidebar(): void {
        this.setState({ sidebarActive: !this.state.sidebarActive });
    }

    onSwipingLeft(event: React.TouchEvent, delta: number): void {
        const newLeftPos: number = delta;
        let newDelta: number;
        if (this.state.oldLeftPos !== -1) {
            newDelta = newLeftPos - this.state.oldLeftPos;
            let newMovedXPos: number = -newDelta + this.state.movedXPos;
            let expanded: boolean = false;
            if (newMovedXPos < 0) {
                newMovedXPos = 0;
            } else if (newMovedXPos > this.state.sidebarWidth) {
                newMovedXPos = this.state.sidebarWidth;
                expanded = true;
            }
            this.setState({ oldLeftPos: newLeftPos, movedXPos: newMovedXPos, expanded: expanded });
        } else {
            this.setState({ oldLeftPos: newLeftPos });
        }
    }

    onSwipingRight(event: React.TouchEvent, delta: number): void {
        const newRightPos: number = delta;
        let newDelta: number;
        if (this.state.oldRightPos !== -1) {
            newDelta = newRightPos - this.state.oldRightPos;
            let newMovedXPos: number = newDelta + this.state.movedXPos;
            let expanded: boolean = false;
            if (newMovedXPos < 0) {
                newMovedXPos = 0;
            } else if (newMovedXPos > this.state.sidebarWidth) {
                newMovedXPos = this.state.sidebarWidth;
                expanded = true;
            }
            this.setState({ oldRightPos: newRightPos, movedXPos: newMovedXPos, expanded: expanded });
        } else {
            this.setState({ oldRightPos: newRightPos });
        }
    }

    onSwipedLeft(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        this.setState({ oldLeftPos: -1, movedXPos: 0 });
    }

    onSwipedRight(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        this.setState({ oldRightPos: -1, movedXPos: this.state.sidebarWidth });
    }

    render() {
        return (
            <ChatroomMenu
                onSwipingLeft={this.onSwipingLeft}
                onSwipingRight={this.onSwipingRight}
                onSwipedLeft={this.onSwipedLeft}
                onSwipedRight={this.onSwipedRight}
                movedXPos={this.state.movedXPos}
                expanded={this.state.expanded}
                sidebarWidth={this.state.sidebarWidth}
            />
        );
    }

}

export default ChatroomMenuContainer;