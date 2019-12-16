import * as React from 'react';
import Slider from "react-slick";
import { GameResponse, getSteamCoverHugeURL } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import GameListContainer, { GameListType } from '../../game/GameListContainer';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { GamesOptions } from './HomeMenuContainer';

interface IHomeMenusProps {
    isLoading: boolean;
    loadingMsg: string;
    highlightedGames: GameResponse[];
    resultsGames: GameResponse[];
    title: string;
    onChangePage: (page: number, pageSize: number) => void;
    currentPage: number;
    resultGamesOption: GamesOptions;
    changeResultGamesOption: (option: GamesOptions) => void;
    onMouseDownHighlighted: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUpHighlighted: (event: React.MouseEvent<HTMLDivElement>, steamId: number) => void;
}

const HomeMenu: React.SFC<IHomeMenusProps> = (props: IHomeMenusProps) => {

    const pageSize: number = 24;

    const settings = {
        className: "highlighted-games-carousel align-top mb-4",
        arrows: false,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 5000,
        cssEase: "linear"
    };

    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5 pt-5" loadingMsg={props.loadingMsg} />
        );
    }

    return (
        <div className="games-page">
            <div className="title h3 text-center color-secondary my-4">
                {props.title}
            </div>
            <Slider {...settings}>
                {props.highlightedGames && 
                    props.highlightedGames.map((game: GameResponse, index: number) => (
                        <div className="item h-100">
                            <div className="item-container cursor-pointer align-center h-100" onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => props.onMouseDownHighlighted(event)} onMouseUp={(event: React.MouseEvent<HTMLDivElement>) => props.onMouseUpHighlighted(event, game.steamId)}>
                                <div className="cover d-inline-block h-100">
                                    <img className="h-100" src={getSteamCoverHugeURL(game.steamId)} />
                                </div>
                                <div className="screenshots position-relative d-inline-block h-100">
                                    {game.screenshots && 
                                        game.screenshots
                                        .map((screenshot: string) => (
                                            <img className="screenshot" src={screenshot} />
                                        ))
                                        .slice(0, 4)}
                                </div>
                            </div>
                        </div>
                    ))}
            </Slider>
            <div className="px-5">
                <div className="games-options mt-5 w-100 h-100">
                    <div className="button-group">
                        <a className={`button-group-item ${props.resultGamesOption === GamesOptions.Upcoming ? 'active' : ''}`} onClick={() => props.changeResultGamesOption(GamesOptions.Upcoming)}>Upcoming</a>
                        <a className={`button-group-item ${props.resultGamesOption === GamesOptions.Recent ? 'active' : ''}`} onClick={() => props.changeResultGamesOption(GamesOptions.Recent)}>Recent</a>
                        <a className={`button-group-item ${props.resultGamesOption === GamesOptions.Early ? 'active' : ''}`} onClick={() => props.changeResultGamesOption(GamesOptions.Early)}>Early Access</a>
                        <a className={`button-group-item ${props.resultGamesOption === GamesOptions.Preorder ? 'active' : ''}`} onClick={() => props.changeResultGamesOption(GamesOptions.Preorder)}>Pre-order</a>
                        <a className={`button-group-item ${props.resultGamesOption === GamesOptions.TopSelling ? 'active' : ''}`} onClick={() => props.changeResultGamesOption(GamesOptions.TopSelling)}>Top Selling</a>
                    </div>
                    <div className="underline w-100 mt-2 mb-4"/>
                    <div className="games-options-grid">
                        <div className="grid-results horizontal small w-100">
                            {props.resultsGames && props.resultsGames
                                .map((game: GameResponse, index: number) => (
                                    <GameListContainer
                                        type={GameListType.Search}
                                        game={game}
                                        index={index}
                                    />
                                ))
                                .slice(pageSize * (props.currentPage - 1), Math.ceil(props.resultsGames.length / pageSize) !== props.currentPage ? (pageSize * (props.currentPage - 1) + pageSize) : props.resultsGames.length)}
                        </div>
                    </div>
                </div>
                <div className="pagination-container text-center my-4">
                    <Pagination
                        className="pagination"
                        showTitle={false}
                        defaultCurrent={props.currentPage}
                        total={props.resultsGames.length}
                        onChange={props.onChangePage}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        </div>
    );

};

export default HomeMenu;