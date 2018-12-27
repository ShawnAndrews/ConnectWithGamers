import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../client-server-common/common';
import HighlightedGameList from './HighlightedGameList';

interface IHighlightedGameListContainerProps extends RouteComponentProps<any> {
    highlightedGames: GameResponse[];
}

interface IHighlightedGameListContainerState {
    highlightedGames: GameResponse[];
    randColors: boolean[];
    hoveredGameId: number;
}

class HighlightedGameListContainer extends React.Component<IHighlightedGameListContainerProps, IHighlightedGameListContainerState> {

    constructor(props: IHighlightedGameListContainerProps) {
        super(props);
        this.onClickGame = this.onClickGame.bind(this);
        this.onHoverGame = this.onHoverGame.bind(this);
        this.onHoverOutGame = this.onHoverOutGame.bind(this);

        const rollColor = (): boolean => {
            return Math.random() >= 0.5;
        };

        this.state = {
            highlightedGames: props.highlightedGames,
            randColors: [rollColor(), rollColor(), rollColor(), rollColor(), rollColor(), rollColor(), rollColor(), rollColor(), rollColor()],
            hoveredGameId: -1
        };
    }

    onClickGame(id: number): void {
        this.props.history.push(`/games/search/game/${id}`);
    }

    onHoverGame(index: number): void {
        this.setState({
            hoveredGameId: index
        });
    }

    onHoverOutGame(): void {
        this.setState({
            hoveredGameId: -1
        });
    }

    render() {
        return (
            <HighlightedGameList
                highlightedGames={this.state.highlightedGames}
                onClickGame={this.onClickGame}
                randColors={this.state.randColors}
                onHoverGame={this.onHoverGame}
                onHoverOutGame={this.onHoverOutGame}
                hoveredGameId={this.state.hoveredGameId}
            />
        );
    }

}

export default withRouter(HighlightedGameListContainer);