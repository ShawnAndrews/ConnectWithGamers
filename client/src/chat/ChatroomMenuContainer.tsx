import * as Redux from 'redux';
import * as React from 'react';
import ChatroomMenu from './ChatroomMenu';
import { connect } from 'react-redux';
import { swipeLeft, swipeRight } from '../actions/main';

export enum SwipeState {
    'Left',
    'Middle',
    'Right'
}

interface IChatroomMenuContainerProps { }

interface IChatroomMenuContainerState {
    swipeLeft: () => void;
    swipeRight: () => void;
}

interface ReduxStateProps {

}

interface ReduxDispatchProps {
    swipeLeft: () => void;
    swipeRight: () => void;
}

type Props = IChatroomMenuContainerProps & ReduxStateProps & ReduxDispatchProps;

class ChatroomMenuContainer extends React.Component<Props, IChatroomMenuContainerState> {

    constructor(props: Props) {
        super(props);
        this.onSwipedLeft = this.onSwipedLeft.bind(this);
        this.onSwipedRight = this.onSwipedRight.bind(this);

        this.state = { 
            swipeLeft: props.swipeLeft, 
            swipeRight: props.swipeRight 
        };
    }

    onSwipedLeft(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        this.state.swipeLeft();
    }

    onSwipedRight(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        this.state.swipeRight();
    }

    render() {
        return (
            <ChatroomMenu
                onSwipedLeft={this.onSwipedLeft}
                onSwipedRight={this.onSwipedRight}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IChatroomMenuContainerProps): ReduxStateProps => ({
    
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IChatroomMenuContainerProps): ReduxDispatchProps => ({
    swipeLeft: () => { dispatch(swipeLeft()); },
    swipeRight: () => { dispatch(swipeRight()); }
});

export default connect<ReduxStateProps, ReduxDispatchProps, IChatroomMenuContainerProps>
    (mapStateToProps, mapDispatchToProps)(ChatroomMenuContainer);