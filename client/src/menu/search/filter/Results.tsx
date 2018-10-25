import * as React from 'react';
import { ThumbnailGameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import ThumbnailGameContainer from '../../game/ThumbnailGameContainer';
import TopnavContainer from './topnav/TopnavContainer';

interface IResultsProps {
    isLoading: boolean;
    title: string;
    games: ThumbnailGameResponse[];
}

const Results: React.SFC<IResultsProps> = (props: IResultsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="middle" loadingMsg="Loading results..." />
        );
    }
    
    return (
        <div className="full-height">
            <TopnavContainer
                title={props.title}
            />
            <div className="page-template scrollable">
                {props.games && 
                    props.games.map((game: ThumbnailGameResponse) => {
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