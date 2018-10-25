const popupS = require('popups');
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
    popularMouseDownCallback: () => void;
    popularMouseUpCallback: () => void;
}

interface IPopularGameListContainerState {
    popularGames: PredefinedGameResponse[];
    listScrollRef: React.RefObject<HTMLDivElement>;
}

class PopularGameListContainer extends React.Component<IPopularGameListContainerProps, IPopularGameListContainerState> {

    constructor(props: IPopularGameListContainerProps) {
        const listScrollRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        super(props);
        this.state = {
            popularGames: props.popularGames,
            listScrollRef: listScrollRef
        };
        this.onScrollLeft = this.onScrollLeft.bind(this);
        this.onScrollRight = this.onScrollRight.bind(this);
        this.onClickGame = this.onClickGame.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    onClickGame(id: number): void {
        this.props.history.push(`/menu/search/game/${id}`);
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
        const element: any = document.getElementsByClassName('popular-table-horizontal')[0];
        const scrollDistance: number = 105;
        this.smoothScroll(element, ScrollDirection.LEFT, 25, scrollDistance, 5);
    }

    onScrollRight(): void {
        const element: any = document.getElementsByClassName('popular-table-horizontal')[0];
        const scrollDistance: number = 105;
        this.smoothScroll(element, ScrollDirection.RIGHT, 25, scrollDistance, 5);
    }

    mouseDown(event: React.TouchEvent<HTMLDivElement>): void {
        this.props.popularMouseDownCallback();
    }

    mouseUp(event: React.TouchEvent<HTMLDivElement>): void {
        setTimeout(() => { this.props.popularMouseUpCallback(); }, 200);
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
                mouseDown={this.mouseDown}
                mouseUp={this.mouseUp}
            />
        );
    }

}

export default withRouter(PopularGameListContainer);