import * as React from 'react';
import { PredefinedGameResponse } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';

interface IReviewedGameListProps {
    randomFilterVals: number[];
    reviewedGames: PredefinedGameResponse[];
    onClickGame: (id: number) => void;
}

const PopularGameList: React.SFC<IReviewedGameListProps> = (props: IReviewedGameListProps) => {

    const imageStyle = (imageUrl: string, randomFilterVal: number): Object => {
        return {
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% calc(100% - 35px)",
            backgroundImage: randomFilterVal 
            ? `linear-gradient(45deg, rgba(16,175,101,0.5), rgba(0,0,0,0.15)), url('${imageUrl}')`
            : `linear-gradient(45deg, rgba(241,196,15,0.5), rgba(0,0,0,0.15)), url('${imageUrl}')`
        };
    };
    
    return (
        <div className="reviewed-table">
            <div className="reviewed-table-grid">
                {props.reviewedGames &&
                    props.reviewedGames.map((game: PredefinedGameResponse, index: number) => {
                        return (
                            <Card key={game.id} className="reviewed-table-grid-item" style={imageStyle(game.cover ? game.cover : 'https://i.imgur.com/WcPkTiF.png', index)} onClick={() => { props.onClickGame(game.id); }}>
                                <div className="reviewed-table-grid-item-content">
                                    <div className="reviewed-table-text-container">
                                        <div className="name">
                                            {game.name}
                                        </div>
                                        <div className="genre">
                                            {game.genre}
                                        </div>
                                        {game.aggregated_rating &&
                                            <div className="rating">
                                                {Math.floor(game.aggregated_rating)}%
                                            </div>}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );   

};

export default PopularGameList;