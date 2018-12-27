import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IHighlightedGameListProps {
    highlightedGames: GameResponse[];
    onClickGame: (id: number) => void;
    randColors: boolean[];
    onHoverGame: (index: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
}

const PopularGameList: React.SFC<IHighlightedGameListProps> = (props: IHighlightedGameListProps) => {

    const row1col1: GameResponse = props.highlightedGames[0];
    const row1col2: GameResponse = props.highlightedGames[1];
    const row1col3: GameResponse = props.highlightedGames[2];
    const row1col4: GameResponse = props.highlightedGames[3];
    const row23col12: GameResponse = props.highlightedGames[4];
    const row2col3: GameResponse = props.highlightedGames[5];
    const row2col4: GameResponse = props.highlightedGames[6];
    const row3col3: GameResponse = props.highlightedGames[7];
    const row3col4: GameResponse = props.highlightedGames[8];
    
    return (
        <div className="highlighted-table col-lg-8 px-md-1 px-lg-3">
            <div className="highlighted-header">
                <a className="mr-2">Highlights</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <div className="highlighted-games">
                <div className="row">
                    <div className="cursor-pointer col-6 col-md-3 p-2">
                        <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row1col1.id); }} onMouseOver={() => props.onHoverGame(0)} onMouseOut={() => props.onHoverOutGame()}>
                            <div className={`${props.randColors[0] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 0 && 'active'} w-100`}/>
                            {row1col1.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row1col1.discount_percent}%</div>}
                            <div className="highlighted-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row1col1.name}
                                </Textfit>
                                {row1col1.genres &&
                                    <div className="genre">
                                        {row1col1.genres[0].name}
                                    </div>}
                                {row1col1.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col1.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col1.screenshots ? row1col1.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                    <div className="cursor-pointer col-6 col-md-3 p-2">
                        <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row1col2.id); }} onMouseOver={() => props.onHoverGame(1)} onMouseOut={() => props.onHoverOutGame()}>
                            <div className={`${props.randColors[1] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 1 && 'active'} w-100`}/>
                            {row1col2.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row1col2.discount_percent}%</div>}
                            <div className="highlighted-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row1col2.name}
                                </Textfit>
                                {row1col2.genres &&
                                    <div className="genre">
                                        {row1col2.genres[0].name}
                                    </div>}
                                {row1col2.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col2.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col2.screenshots ? row1col2.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                    <div className="cursor-pointer col-3 p-2">
                        <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row1col3.id); }} onMouseOver={() => props.onHoverGame(2)} onMouseOut={() => props.onHoverOutGame()}>
                            <div className={`${props.randColors[2] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId == 2 && 'active'} w-100`}/>
                            {row1col3.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row1col3.discount_percent}%</div>}
                            <div className="highlighted-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row1col3.name}
                                </Textfit>
                                {row1col3.genres &&
                                    <div className="genre">
                                        {row1col3.genres[0].name}
                                    </div>}
                                {row1col3.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col3.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col3.screenshots ? row1col3.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                    <div className="cursor-pointer col-3 p-2">
                        <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row1col4.id); }} onMouseOver={() => props.onHoverGame(3)} onMouseOut={() => props.onHoverOutGame()}>
                            <div className={`${props.randColors[3] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 3 && 'active'} w-100`}/>
                            {row1col4.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row1col4.discount_percent}%</div>}
                            <div className="highlighted-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row1col4.name}
                                </Textfit>
                                {row1col4.genres &&
                                    <div className="genre">
                                        {row1col4.genres[0].name}
                                    </div>}
                                {row1col4.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row1col4.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row1col4.screenshots ? row1col4.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div className="cursor-pointer col-6 p-2">
                        <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row23col12.id); }} onMouseOver={() => props.onHoverGame(4)} onMouseOut={() => props.onHoverOutGame()}>
                            <div className={`${props.randColors[4] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 4 && 'active'} w-100`}/>
                            {row23col12.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row23col12.discount_percent}%</div>}
                            <div className="highlighted-table-text">
                                <Textfit className="name" min={11} max={15}>
                                    {row23col12.name}
                                </Textfit>
                                {row23col12.genres &&
                                    <div className="genre">
                                        {row23col12.genres[0].name}
                                    </div>}
                                {row23col12.aggregated_rating &&
                                    <div className="rating">
                                        {Math.floor(row23col12.aggregated_rating)}%
                                    </div>}
                            </div>
                            <img className="w-100 h-100" src={row23col12.screenshots ? row23col12.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                        </Card>
                    </div>
                    <div className="col-6 col-lg-3 p-0">
                        <div className="cursor-pointer col-12 h-50 p-2">
                            <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row2col3.id); }} onMouseOver={() => props.onHoverGame(5)} onMouseOut={() => props.onHoverOutGame()}>
                                <div className={`${props.randColors[5] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 5 && 'active'} w-100`}/>
                                {row2col3.discount_percent &&<div className="highlighted-table-discount mt-1 px-1">-{row2col3.discount_percent}%</div>}
                                <div className="highlighted-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {row2col3.name}
                                    </Textfit>
                                    {row2col3.genres &&
                                        <div className="genre">
                                            {row2col3.genres[0].name}
                                        </div>}
                                    {row2col3.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row2col3.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row2col3.screenshots ? row2col3.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>
                        </div>
                        <div className="cursor-pointer col-12 h-50 p-2">
                            <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row3col3.id); }} onMouseOver={() => props.onHoverGame(6)} onMouseOut={() => props.onHoverOutGame()}>
                                <div className={`${props.randColors[6] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 6 && 'active'} w-100`}/>
                                {row3col3.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row3col3.discount_percent}%</div>}
                                <div className="highlighted-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {row3col3.name}
                                    </Textfit>
                                    {row3col3.genres &&
                                        <div className="genre">
                                            {row3col3.genres[0].name}
                                        </div>}
                                    {row3col3.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row3col3.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row3col3.screenshots ? row3col3.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>   
                        </div> 
                    </div>
                    <div className="col-6 col-lg-3 p-0">
                        <div className="cursor-pointer col-12 h-50 p-2">
                            <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row2col4.id); }} onMouseOver={() => props.onHoverGame(7)}onMouseOut={() => props.onHoverOutGame()}>
                                <div className={`${props.randColors[7] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 7 && 'active'} w-100`}/>
                                {row2col4.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row2col4.discount_percent}%</div>}
                                <div className="highlighted-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {row2col4.name}
                                    </Textfit>
                                    {row2col4.genres &&
                                        <div className="genre">
                                            {row2col4.genres[0].name}
                                        </div>}
                                    {row2col4.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row2col4.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row2col4.screenshots ? row2col4.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>
                        </div>
                        <div className="cursor-pointer col-12 h-50 p-2">
                            <Card className="primary-shadow position-relative bg-transparent h-100" onClick={() => { props.onClickGame(row3col4.id); }} onMouseOver={() => props.onHoverGame(8)} onMouseOut={() => props.onHoverOutGame()}>
                                <div className={`${props.randColors[8] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === 8 && 'active'} w-100`}/>
                                {row3col4.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{row3col4.discount_percent}%</div>}
                                <div className="highlighted-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {row3col4.name}
                                    </Textfit>
                                    {row3col4.genres &&
                                        <div className="genre">
                                            {row3col4.genres[0].name}
                                        </div>}
                                    {row3col4.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(row3col4.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={row3col4.screenshots ? row3col4.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>   
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    );   

};

export default PopularGameList;