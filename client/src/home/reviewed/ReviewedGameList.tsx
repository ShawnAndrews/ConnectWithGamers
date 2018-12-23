import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IReviewedGameListProps {
    randomFilterVals: number[];
    reviewedGames: GameResponse[];
    onClickGame: (id: number) => void;
}

const PopularGameList: React.SFC<IReviewedGameListProps> = (props: IReviewedGameListProps) => {

    const row1col1: GameResponse = props.reviewedGames[0];
    const row1col2: GameResponse = props.reviewedGames[1];
    const row1col3: GameResponse = props.reviewedGames[2];
    const row23col12: GameResponse = props.reviewedGames[3];
    const row2col3: GameResponse = props.reviewedGames[4];
    const row3col3: GameResponse = props.reviewedGames[5];
    const rollColor = (): boolean => {
        return Math.random() >= 0.5;
    };
    
    return (
        <div className="reviewed-table col-lg-7 px-md-1 px-lg-3">
            <div className="reviewed-header">
                <a className="mr-2">Highlights</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <div className="reviewed-games">
                <div className="row">
                    <div className="cursor-pointer col-4 p-2">
                        <Card className="custom-shadow position-relative h-100" onClick={() => { props.onClickGame(row1col1.id); }}>
                            <div className={`${rollColor() ? 'cover-overlay-green' : 'cover-overlay-yellow'} w-100`}/>
                            <div className="reviewed-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row1col1.name}
                                </Textfit>
                                <div className="genre">
                                    {row1col1.genres[0].name}
                                </div>
                                {row1col1.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col1.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col1.screenshots ? row1col1.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                    <div className="cursor-pointer col-4 p-2">
                        <Card className="custom-shadow position-relative h-100" onClick={() => { props.onClickGame(row1col2.id); }}>
                            <div className={`${rollColor() ? 'cover-overlay-green' : 'cover-overlay-yellow'} w-100`}/>
                            <div className="reviewed-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row1col2.name}
                                </Textfit>
                                <div className="genre">
                                    {row1col2.genres[0].name}
                                </div>
                                {row1col2.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col2.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col2.screenshots ? row1col2.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                    <div className="cursor-pointer col-4 p-2">
                        <Card className="custom-shadow position-relative h-100" onClick={() => { props.onClickGame(row1col3.id); }}>
                            <div className={`${rollColor() ? 'cover-overlay-green' : 'cover-overlay-yellow'} w-100`}/>
                            <div className="reviewed-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row1col3.name}
                                </Textfit>
                                <div className="genre">
                                    {row1col3.genres[0].name}
                                </div>
                                {row1col3.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col3.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col3.screenshots ? row1col3.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div className="cursor-pointer col-8 p-2">
                        <Card className="custom-shadow position-relative h-100" onClick={() => { props.onClickGame(row23col12.id); }}>
                            <div className={`${rollColor() ? 'cover-overlay-green' : 'cover-overlay-yellow'} w-100`}/>
                            <div className="reviewed-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row23col12.name}
                                </Textfit>
                                <div className="genre">
                                    {row23col12.genres[0].name}
                                </div>
                                {row23col12.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row23col12.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row23col12.screenshots ? row23col12.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                    <div className="col-4 p-0">
                        <div className="cursor-pointer col-12 h-50 p-2">
                            <Card className="custom-shadow position-relative h-100" onClick={() => { props.onClickGame(row2col3.id); }}>
                                <div className={`${rollColor() ? 'cover-overlay-green' : 'cover-overlay-yellow'} w-100`}/>
                                <div className="reviewed-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {row2col3.name}
                                    </Textfit>
                                    <div className="genre">
                                        {row2col3.genres[0].name}
                                    </div>
                                    {row2col3.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row2col3.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row2col3.screenshots ? row2col3.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>
                        </div>
                        <div className="cursor-pointer col-12 h-50 p-2">
                            <Card className="custom-shadow position-relative h-100" onClick={() => { props.onClickGame(row3col3.id); }}>
                                <div className={`${rollColor() ? 'cover-overlay-green' : 'cover-overlay-yellow'} w-100`}/>
                                <div className="reviewed-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {row3col3.name}
                                    </Textfit>
                                    <div className="genre">
                                        {row3col3.genres[0].name}
                                    </div>
                                    {row3col3.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row3col3.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row3col3.screenshots ? row3col3.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>   
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    );   

};

export default PopularGameList;