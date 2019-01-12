import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import FullsizeGameContainer from '../game/fullsize/FullsizeGameContainer';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="vh-40" loadingMsg={props.loadingMsg} />
        );
    }

    const featureGames: number[] = [0,42];
    const subFeatureGames: number[] = [10,17,28,33];

    return (
        <div className="home">
            {props.games && props.games
                .map((game: GameResponse, index: number) => {
                    const isEditorsChoiceGame: boolean = index === 0;
                    const isFeatureGame: boolean = featureGames.findIndex((x: number) => x === index) !== -1;
                    const isSubFeatureGame: boolean = subFeatureGames.findIndex((x: number) => x === index) !== -1;

                    return (
                        <FullsizeGameContainer
                            index={index}
                            game={game}
                            isEditorsChoiceGame={isEditorsChoiceGame}
                            isFeatureGame={isFeatureGame}
                            isSubFeatureGame={isSubFeatureGame}
                        />
                    );
                })}
        </div>
    );

};

export default Home;