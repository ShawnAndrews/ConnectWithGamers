const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PopularGameResponse, PopularGamesResponse } from '../../../../client/client-server-common/common';
import PopularGameList from './PopularGameList';

enum ScrollDirection {
    'LEFT',
    'RIGHT'
}

interface IPopularGameListContainerProps extends RouteComponentProps<any> {
    count: number;
}

interface IPopularGameListContainerState {
    isLoading: boolean;
    popularGames: PopularGameResponse[];
    count: number;
    listScrollRef: React.RefObject<HTMLDivElement>;
}

class PopularGameListContainer extends React.Component<IPopularGameListContainerProps, IPopularGameListContainerState> {

    constructor(props: IPopularGameListContainerProps) {
        const listScrollRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        super(props);
        this.state = { 
            isLoading: true,
            popularGames: undefined,
            count: props.count,
            listScrollRef: listScrollRef
        };
        this.onScrollLeft = this.onScrollLeft.bind(this);
        this.onScrollRight = this.onScrollRight.bind(this);
        this.onClickGame = this.onClickGame.bind(this);
        this.loadPopularGames = this.loadPopularGames.bind(this);
        this.loadPopularGames();
    }

    loadPopularGames(): void {
        IGDBService.httpGetPopularGamesList()
            .then( (response: PopularGamesResponse) => {
                const popularGames: PopularGameResponse[] = response.data;
                this.setState({ isLoading: false, popularGames: popularGames });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false });
            });
    }

    onClickGame(id: number): void {
        this.props.history.push(`/menu/search/${id}`);
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

    render() {
        return (
            <PopularGameList
                isLoading={this.state.isLoading}
                popularGames={this.state.popularGames}
                onClickGame={this.onClickGame}
                listScrollRef={this.state.listScrollRef}
                onScrollLeft={this.onScrollLeft}
                onScrollRight={this.onScrollRight}
            />
        );
    }

}

export default withRouter(PopularGameListContainer);