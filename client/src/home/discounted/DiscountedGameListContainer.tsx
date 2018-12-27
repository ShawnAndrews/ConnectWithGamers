import jQuery = require('jquery');
import 'slick-carousel';
import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import DiscountedGameList from './DiscountedGameList';
import { withRouter, RouteComponentProps } from 'react-router';

interface IDiscountedGameListContainerProps extends RouteComponentProps<any> {
    discountedGames: GameResponse[];
}

interface IDiscountedGameListContainerState {
    hoveredGameId: number;
}

class DiscountedGameListContainer extends React.Component<IDiscountedGameListContainerProps, IDiscountedGameListContainerState> {

    constructor(props: IDiscountedGameListContainerProps) {
        super(props);
        this.onRedirect = this.onRedirect.bind(this);
        this.onHoverGame = this.onHoverGame.bind(this);
        this.onHoverOutGame = this.onHoverOutGame.bind(this);

        this.state = {
            hoveredGameId: -1
        };
    }

    componentDidMount(): void {
        jQuery('.discount-carousel').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            arrows: false,
            responsive: [
              {
                breakpoint: 992,
                settings: {
                  arrows: false,
                  centerMode: true,
                  centerPadding: '40px',
                  slidesToShow: 1
                }
              }
            ]
          });
    }

    onRedirect(id: number): void {
        this.props.history.push(`/games/search/game/${id}`);
    }

    onHoverGame(gameId: number): void {
        this.setState({
            hoveredGameId: gameId
        });
    }

    onHoverOutGame(): void {
        this.setState({
            hoveredGameId: -1
        });
    }

    render() {
        return (
            <DiscountedGameList
                discountedGames={this.props.discountedGames}
                onRedirect={this.onRedirect}
                onHoverGame={this.onHoverGame}
                onHoverOutGame={this.onHoverOutGame}
                hoveredGameId={this.state.hoveredGameId}
            />
        );
    }

}

export default withRouter(DiscountedGameListContainer);