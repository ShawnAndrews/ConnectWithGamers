const popupS = require('popups');
import * as React from 'react';
import Swipe from "./Swipe";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SwipeState } from '../ChatroomMenuContainer';

interface ISwipeContainerProps extends RouteComponentProps<any> {
    sidebarWidth: number;
    usersnavWidth: number;
    swipeState: SwipeState;
}

class SwipeContainer extends React.Component<ISwipeContainerProps, any> {

    constructor(props: ISwipeContainerProps) {
        super(props);
        this.updatePositionRefs = this.updatePositionRefs.bind(this);

        const swipeContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        this.state = { swipeState: props.swipeState, sidebarWidth: props.sidebarWidth, usersnavWidth: props.usersnavWidth, swipeContainerRef: swipeContainerRef};
    }

    componentDidMount(): void {
        this.updatePositionRefs(this.state.swipeState, this.state.sidebarWidth, this.state.usersnavWidth);
    }

    componentWillReceiveProps(newProps: ISwipeContainerProps): void {
        this.updatePositionRefs(newProps.swipeState, newProps.sidebarWidth, newProps.usersnavWidth);
    }

    updatePositionRefs(swipeState: SwipeState, sidebarWidth: number, usersnavWidth: number): void {
        const divNode: HTMLDivElement = this.state.swipeContainerRef.current;
        let newLeftPosition: number;

        if (swipeState === SwipeState.Left) {
            newLeftPosition = sidebarWidth;
        } else if (swipeState === SwipeState.Middle) {
            newLeftPosition = 0;
        } else {
            newLeftPosition = -usersnavWidth;
        }
        
        divNode.style.left = `${newLeftPosition}px`;
    }

    render() {
        return (
            <Swipe
                swipeContainerRef={this.state.swipeContainerRef}
            />
        );
    }

}

export default withRouter(SwipeContainer);