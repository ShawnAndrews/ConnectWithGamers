import * as React from 'react';
import { PredefinedGameResponse } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IReviewedGameListProps {
    randomFilterVals: number[];
    reviewedGames: PredefinedGameResponse[];
    onClickGame: (id: number) => void;
}

const PopularGameList: React.SFC<IReviewedGameListProps> = (props: IReviewedGameListProps) => {

    const row1col1: PredefinedGameResponse = props.reviewedGames[0];
    const row1col2: PredefinedGameResponse = props.reviewedGames[1];
    const row1col3: PredefinedGameResponse = props.reviewedGames[2];
    const row23col12: PredefinedGameResponse = props.reviewedGames[3];
    const row2col3: PredefinedGameResponse = props.reviewedGames[4];
    const row3col3: PredefinedGameResponse = props.reviewedGames[5];
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
                                    {row1col1.genre}
                                </div>
                                {row1col1.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col1.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col1.cover ? row1col1.cover : 'https://i.imgur.com/WcPkTiF.png'}/>
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
                                    {row1col2.genre}
                                </div>
                                {row1col2.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col2.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col2.cover ? row1col2.cover : 'https://i.imgur.com/WcPkTiF.png'}/>
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
                                    {row1col3.genre}
                                </div>
                                {row1col3.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col3.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col3.cover ? row1col3.cover : 'https://i.imgur.com/WcPkTiF.png'}/>
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
                                    {row23col12.genre}
                                </div>
                                {row23col12.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row23col12.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row23col12.cover ? row23col12.cover : 'https://i.imgur.com/WcPkTiF.png'}/>
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
                                        {row2col3.genre}
                                    </div>
                                    {row2col3.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row2col3.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row2col3.cover ? row2col3.cover : 'https://i.imgur.com/WcPkTiF.png'}/>
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
                                        {row3col3.genre}
                                    </div>
                                    {row3col3.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row3col3.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row3col3.cover ? row3col3.cover : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>   
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    );   

};

export default PopularGameList;