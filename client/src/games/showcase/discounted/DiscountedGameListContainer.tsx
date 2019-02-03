import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import DiscountedGameList from './DiscountedGameList';
import { withRouter, RouteComponentProps } from 'react-router';

interface IDiscountedGameListContainerProps extends RouteComponentProps<any> {
    discountedGames: GameResponse[];
}

interface IDiscountedGameListContainerState {
    hoveredGameId: number;
    mouseDragged: boolean;
    mouseClicked: boolean;
}

class DiscountedGameListContainer extends React.Component<IDiscountedGameListContainerProps, IDiscountedGameListContainerState> {

    constructor(props: IDiscountedGameListContainerProps) {
        super(props);
        this.onRedirect = this.onRedirect.bind(this);
        this.onHoverGame = this.onHoverGame.bind(this);
        this.onHoverOutGame = this.onHoverOutGame.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.state = {
            hoveredGameId: -1,
            mouseDragged: false,
            mouseClicked: false
        };
    }

    onRedirect(id: number): void {
        if (!this.state.mouseDragged) {
            this.props.history.push(`/search/game/${id}`);
        }
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

    onMouseMove(event: React.MouseEvent<HTMLDivElement>): void {
        if (this.state.mouseClicked) {
            this.setState({
                mouseDragged: true
            });
        }
    };

    onMouseDown(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({
            mouseClicked: true
        });
    };

    onMouseUp(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({
            mouseClicked: false
        });
        setTimeout(() => 
            this.setState({
                mouseDragged: false
            }), 50);
    };

    render() {
        return (
            <DiscountedGameList
                discountedGames={this.props.discountedGames}
                onRedirect={this.onRedirect}
                onHoverGame={this.onHoverGame}
                onHoverOutGame={this.onHoverOutGame}
                hoveredGameId={this.state.hoveredGameId}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
            />
        );
    }

}

export default withRouter(DiscountedGameListContainer);