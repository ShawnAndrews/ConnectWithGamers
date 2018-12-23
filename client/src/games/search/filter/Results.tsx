import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import ThumbnailGameContainer from '../../game/ThumbnailGameContainer';
import TopnavContainer from './topnav/TopnavContainer';

interface IResultsProps {
    isLoading: boolean;
    title: string;
    games: GameResponse[];
}

const Results: React.SFC<IResultsProps> = (props: IResultsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5" loadingMsg="Loading results..." />
        );
    }
    
    return (
        <div className="results container">
            <TopnavContainer
                title={props.title}
            />
            <div className="row">
                {props.games && 
                    props.games.map((game: GameResponse) => {
                        return (
                            <ThumbnailGameContainer
                                key={game.id}
                                game={game}
                            />
                        );
                    })}
            </div>
        </div>
    );

}; 

export default Results;