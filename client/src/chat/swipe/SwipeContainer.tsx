import * as Redux from 'redux';
import * as React from 'react';
import Swipe from "./Swipe";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SwipeState } from '../../../client-server-common/common';
import { ChatroomReduxState } from '../../reducers/main';
import { connect } from 'react-redux';

interface ISwipeContainerProps extends RouteComponentProps<any> { }

interface ISwipeContainerState {
    swipeState: SwipeState;
    leftNavWidth: number;
    rightNavWidth: number;
    swipeContainerRef: React.RefObject<HTMLDivElement>;
}

interface ReduxStateProps {
    swipeState: SwipeState;
    leftNavWidth: number;
    rightNavWidth: number;
}

interface ReduxDispatchProps { }

type Props = ISwipeContainerProps & ReduxStateProps & ReduxDispatchProps;

class SwipeContainer extends React.Component<Props, ISwipeContainerState> {

    constructor(props: Props) {
        super(props);
        this.updatePositionRefs = this.updatePositionRefs.bind(this);

        const swipeContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        this.state = { 
            swipeState: props.swipeState, 
            leftNavWidth: props.leftNavWidth, 
            rightNavWidth: props.rightNavWidth, 
            swipeContainerRef: swipeContainerRef
        };
    }

    componentDidMount(): void {
        this.updatePositionRefs(this.state.swipeState, this.state.leftNavWidth, this.state.rightNavWidth);
    }

    componentWillReceiveProps(newProps: Props): void {
        this.updatePositionRefs(newProps.swipeState, newProps.leftNavWidth, newProps.rightNavWidth);
    }

    updatePositionRefs(swipeState: SwipeState, leftNavWidth: number, rightNavWidth: number): void {
        const divNode: HTMLDivElement = this.state.swipeContainerRef.current;
        let newLeftPosition: number;

        if (swipeState === SwipeState.Left) {
            newLeftPosition = leftNavWidth;
        } else if (swipeState === SwipeState.Middle) {
            newLeftPosition = 0;
        } else {
            newLeftPosition = -rightNavWidth;
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

const mapStateToProps = (state: any, ownProps: ISwipeContainerProps): ReduxStateProps => {
    const chatroomReduxState: ChatroomReduxState = state.chatroom;
    return {
        swipeState: chatroomReduxState.swipeStateChatroom,
        leftNavWidth: chatroomReduxState.leftNavWidth,
        rightNavWidth: chatroomReduxState.rightNavWidth
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ISwipeContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ISwipeContainerProps>
    (mapStateToProps, mapDispatchToProps)(SwipeContainer));