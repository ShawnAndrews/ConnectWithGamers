import * as React from 'react';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SimilarGames from './SimilarGames';
import { GameResponse, SingleGameResponse } from '../../../../client-server-common/common';

interface ISimilarGamesContainerProps extends RouteComponentProps<any> {
    similarGames: number[];
    hoveredSimilarGameIndex: number;
    goToGame: (id: number) => void;
    onSimilarGamesMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseOver: (index: number) => void;
    onSimilarGamesMouseLeave: () => void;
    getConvertedPrice: (price: number, skipCurrencyType: boolean) => string;
}

interface ISimilarGamesContainerState {
    isLoading: boolean;
    similarGames: GameResponse[];
}

class SimilarGamesContainer extends React.PureComponent<ISimilarGamesContainerProps, ISimilarGamesContainerState> {

    constructor(props: ISimilarGamesContainerProps) {
        super(props);
        this.loadSimilarGames = this.loadSimilarGames.bind(this);

        if (this.props.similarGames) {
            this.loadSimilarGames();   
        }

        this.state = {
            isLoading: true,
            similarGames: undefined
        };
    }

    loadSimilarGames(): void {

        const similarGamePromises: Promise<SingleGameResponse>[] = [];

        this.props.similarGames.forEach((similarGameId: number) => {
            similarGamePromises.push(SteamService.httpGenericGetData<SingleGameResponse>(`/steam/game/${similarGameId}`));
        });

        Promise.all(similarGamePromises)
            .then((vals: SingleGameResponse[]) => {
                const similarGames: GameResponse[] = vals.map((similarGameResponse: SingleGameResponse) => similarGameResponse.data);
                this.setState({ similarGames: similarGames, isLoading: false });
            })
            .catch((err: string) => {
                console.log(`Failed to load similar games. ${JSON.stringify(err)}`);
            });

    }

    render() {
        return (
            <SimilarGames
                isLoading={this.state.isLoading}
                similarGames={this.state.similarGames}
                hoveredSimilarGameIndex={this.props.hoveredSimilarGameIndex}
                goToGame={this.props.goToGame}
                onSimilarGamesMouseDown={this.props.onSimilarGamesMouseDown}
                onSimilarGamesMouseUp={this.props.onSimilarGamesMouseUp}
                onSimilarGamesMouseMove={this.props.onSimilarGamesMouseMove}
                onSimilarGamesMouseOver={this.props.onSimilarGamesMouseOver}
                onSimilarGamesMouseLeave={this.props.onSimilarGamesMouseLeave}
                getConvertedPrice={this.props.getConvertedPrice}
            />
        );
    }

}

export default withRouter(SimilarGamesContainer);