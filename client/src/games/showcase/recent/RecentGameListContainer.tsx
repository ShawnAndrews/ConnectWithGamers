import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../../../client/client-server-common/common';
import RecentGameList from './RecentGameList';

enum ScrollDirection {
    'LEFT',
    'RIGHT'
}

interface IRecentGameListContainerProps extends RouteComponentProps<any> {
    recentGames: GameResponse[];
}

interface IRecentGameListContainerState {
    listScrollRef: React.RefObject<HTMLDivElement>;
    recentGames: GameResponse[];
    clicked: boolean;
    clickedX: number;
    mouseMoved: boolean;
}

class RecentGameListContainer extends React.Component<IRecentGameListContainerProps, IRecentGameListContainerState> {

    constructor(props: IRecentGameListContainerProps) {
        super(props);
        this.onClickGame = this.onClickGame.bind(this);
        this.onScrollLeft = this.onScrollLeft.bind(this);
        this.onScrollRight = this.onScrollRight.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);

        const listScrollRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        this.state = { 
            listScrollRef: listScrollRef,
            recentGames: props.recentGames,
            clicked: false,
            clickedX: undefined,
            mouseMoved: false
        };
    }

    onClickGame(id: number): void {
        if (!this.state.mouseMoved) {
            this.props.history.push(`/search/game/${id}`);
        }
    }

    smoothScroll(element: any, direction: ScrollDirection, speed: number, distance: number, step: number): void {
        let scrollAmount: number = 0;
        const slideTimer: any = setInterval(() => {
            if (direction === ScrollDirection.LEFT) {
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if (scrollAmount >= distance) {
                window.clearInterval(slideTimer);
            }
        }, speed);
    }

    onScrollLeft(): void {
        const element: Element = document.querySelector('.recently-released-table .scroll-horizontal');
        const scrollDistance: number = 105;
        this.smoothScroll(element, ScrollDirection.LEFT, 25, scrollDistance, 5);
    }

    onScrollRight(): void {
        const element: Element = document.querySelector('.recently-released-table .scroll-horizontal');
        const scrollDistance: number = 105;
        this.smoothScroll(element, ScrollDirection.RIGHT, 25, scrollDistance, 5);
    }

    mouseLeave(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({ clicked: false });
    }

    mouseMove(event: React.MouseEvent<HTMLDivElement>): void {
        if (this.state.clicked) {
            const element: Element = document.querySelector('.recently-released-table .scroll-horizontal');
            element.scrollLeft = element.scrollLeft + (this.state.clickedX - event.pageX);
            this.setState({ mouseMoved: true, clickedX: event.pageX });
        }
    }

    mouseDown(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({ mouseMoved: false, clicked: true, clickedX: event.pageX });
    }

    mouseUp(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({ clicked: false });
    }

    render() {
        return (
            <RecentGameList
                listScrollRef={this.state.listScrollRef}
                recentGames={this.state.recentGames}
                onClickGame={this.onClickGame}
                goToRedirectCallback={this.props.history.push}
                onScrollLeft={this.onScrollLeft}
                onScrollRight={this.onScrollRight}
                mouseLeave={this.mouseLeave}
                mouseMove={this.mouseMove}
                mouseDown={this.mouseDown}
                mouseUp={this.mouseUp}
            />
        );
    }

}

export default withRouter(RecentGameListContainer);