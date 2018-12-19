import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PredefinedGameResponse } from '../../../../client/client-server-common/common';
import PopularGameList from './PopularGameList';

enum ScrollDirection {
    'LEFT',
    'RIGHT'
}

interface IPopularGameListContainerProps extends RouteComponentProps<any> {
    popularGames: PredefinedGameResponse[];
}

interface IPopularGameListContainerState {
    popularGames: PredefinedGameResponse[];
    listScrollRef: React.RefObject<HTMLDivElement>;
    clicked: boolean;
    clickedX: number;
    mouseMoved: boolean;
}

class PopularGameListContainer extends React.Component<IPopularGameListContainerProps, IPopularGameListContainerState> {

    constructor(props: IPopularGameListContainerProps) {
        const listScrollRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        super(props);
        this.state = {
            popularGames: props.popularGames,
            listScrollRef: listScrollRef,
            clicked: false,
            clickedX: undefined,
            mouseMoved: false
        };
        this.onScrollLeft = this.onScrollLeft.bind(this);
        this.onScrollRight = this.onScrollRight.bind(this);
        this.onClickGame = this.onClickGame.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    onClickGame(id: number): void {
        if (!this.state.mouseMoved) {
            this.props.history.push(`/games/search/game/${id}`);
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
        const element: Element = document.getElementsByClassName('popular-table-horizontal')[0];
        const scrollDistance: number = 105;
        this.smoothScroll(element, ScrollDirection.LEFT, 25, scrollDistance, 5);
    }

    onScrollRight(): void {
        const element: Element = document.getElementsByClassName('popular-table-horizontal')[0];
        const scrollDistance: number = 105;
        this.smoothScroll(element, ScrollDirection.RIGHT, 25, scrollDistance, 5);
    }

    mouseLeave(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({ clicked: false });
    }

    mouseMove(event: React.MouseEvent<HTMLDivElement>): void {
        if (this.state.clicked) {
            const element: Element = document.getElementsByClassName('popular-table-horizontal')[0];
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
            <PopularGameList
                popularGames={this.state.popularGames}
                onClickGame={this.onClickGame}
                listScrollRef={this.state.listScrollRef}
                onScrollLeft={this.onScrollLeft}
                onScrollRight={this.onScrollRight}
                goToRedirectCallback={this.props.history.push}
                mouseLeave={this.mouseLeave}
                mouseMove={this.mouseMove}
                mouseDown={this.mouseDown}
                mouseUp={this.mouseUp}
            />
        );
    }

}

export default withRouter(PopularGameListContainer);