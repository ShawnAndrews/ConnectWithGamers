import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Swipe from './Swipe';
import { SwipeState } from '../../../client-server-common/common';
import { swipeLeftFilter, swipeRightFilter } from '../../actions/main';
import { MenuReduxState } from '../../reducers/main';

interface ISwipeContainerProps extends RouteComponentProps<any> {

} 

interface ISwipeContainerState {
    isLoading: boolean;
    filterNavWidth: number;
    swipeState: SwipeState;
    swipeLeft: () => void;
    swipeRight: () => void;
    swipeableRef: React.RefObject<HTMLDivElement>;
}

interface ReduxStateProps {
    swipeState: SwipeState;
    filterNavWidth: number;
    isSwipeInPopular: boolean;
}

interface ReduxDispatchProps {
    swipeLeft: () => void;
    swipeRight: () => void;
}

type Props = ISwipeContainerProps & ReduxStateProps & ReduxDispatchProps;

class SwipeContainer extends React.Component<Props, ISwipeContainerState> {

    constructor(props: Props) {
        super(props);
        this.onSwipedLeft = this.onSwipedLeft.bind(this);
        this.onSwipedRight = this.onSwipedRight.bind(this);

        const swipeableRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        this.state = {
            isLoading: false,
            filterNavWidth: props.filterNavWidth,
            swipeState: props.swipeState,
            swipeLeft: props.swipeLeft,
            swipeRight: props.swipeRight,
            swipeableRef: swipeableRef
        };
    }

    componentDidMount(): void {
        this.updatePositionRefs(this.props.swipeState, this.props.filterNavWidth);
    }

    componentWillReceiveProps(newProps: Props): void {
        this.updatePositionRefs(newProps.swipeState, newProps.filterNavWidth);
    }

    updatePositionRefs(swipeState: SwipeState, filterNavWidth: number): void {
        const divNode: HTMLDivElement = this.state.swipeableRef.current;
        if (divNode !== null) {
            let newLeftPosition: number;

            if (swipeState === SwipeState.Middle) {
                newLeftPosition = 0;
            } else {
                newLeftPosition = -filterNavWidth;
            }
            divNode.style.left = `${newLeftPosition}px`;
        }
    }

    onSwipedLeft(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        if (!this.props.isSwipeInPopular) {
            this.state.swipeLeft();
        }
    }

    onSwipedRight(event: React.TouchEvent, delta: number, isFlick: boolean): void {
        if (!this.props.isSwipeInPopular) {
            this.state.swipeRight();
        }
    }

    render() {
        return (
            <Swipe
                isLoading={this.state.isLoading}
                swipeableRef={this.state.swipeableRef}
                onSwipedLeft={this.onSwipedLeft}
                onSwipedRight={this.onSwipedRight}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: ISwipeContainerProps): ReduxStateProps => {
    const menuReduxState: MenuReduxState = state.menu;
    return {
        swipeState: menuReduxState.swipeStateFilter,
        filterNavWidth: menuReduxState.filterNavWidth,
        isSwipeInPopular: menuReduxState.isSwipeInPopular
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ISwipeContainerProps): ReduxDispatchProps => ({
    swipeLeft: () => { dispatch(swipeLeftFilter()); },
    swipeRight: () => { dispatch(swipeRightFilter()); }
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ISwipeContainerProps>
    (mapStateToProps, mapDispatchToProps)(SwipeContainer));