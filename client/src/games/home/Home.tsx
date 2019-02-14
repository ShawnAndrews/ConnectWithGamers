import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import FullsizeGameContainer from '../game/fullsize/FullsizeGameContainer';
import Footer from '../../footer/footer';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    bigGame: GameResponse;
    editorsGamesIndicies: number[];
    featureGamesIndicies: number[];
    subFeatureGamesIndicies: number[];
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="vh-40" loadingMsg={props.loadingMsg} />
        );
    }

    return (
        <>
            <div className="fullsize-results pb-4">
                {props.games && props.games
                    .map((game: GameResponse, index: number) => {
                        const isEditorsChoiceGame: boolean = props.editorsGamesIndicies.findIndex((x: number) => x === index) !== -1;
                        const isFeatureGame: boolean = props.featureGamesIndicies.findIndex((x: number) => x === index) !== -1;
                        const isSubFeatureGame: boolean = props.subFeatureGamesIndicies.findIndex((x: number) => x === index) !== -1;

                        return (
                            <FullsizeGameContainer
                                index={index}
                                game={isEditorsChoiceGame ? props.bigGame : game}
                                isEditorsChoiceGame={isEditorsChoiceGame}
                                isFeatureGame={isFeatureGame}
                                isSubFeatureGame={isSubFeatureGame}
                            />
                        );
                    })}
            </div>
            <Footer/>
        </>
    );

};

export default Home;