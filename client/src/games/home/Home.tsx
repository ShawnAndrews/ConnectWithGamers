import * as React from 'react';
import { GameResponse, GenreEnums } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import Slider from "react-slick";
import FullsizeGameContainer from '../game/fullsize/FullsizeGameContainer';
import Footer from '../../footer/footer';
import { Textfit } from 'react-textfit';
import { Button } from '@material-ui/core';
import { EditorsChoiceGameInfo } from './HomeContainer';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    editorsChoiceGamesInfo: EditorsChoiceGameInfo[];
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

    const settings = {
        className: "editors-games-carousel mb-5",
        infinite: true,
        dots: true,
        swipeToSlide: true,
        variableWidth: false,
        arrows: false
    };

    return (
        <>
            <Slider {...settings} >
                {props.editorsChoiceGamesInfo && 
                    props.editorsChoiceGamesInfo.map((gameInfo: EditorsChoiceGameInfo) => (
                        <div className="item">
                            <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={true} onEnded={() => {}} playsInline={true} onClick={() => {}}>
                                <source src={`/cache/video-previews/${gameInfo.gameId}.mp4`} type="Video/mp4"/>
                                <span>Your browser does not support the video tag.</span>
                            </video>
                            <div className="highlighted-table-text">
                                <Textfit className='name' min={18} max={30}>
                                    {gameInfo.game.name}
                                </Textfit>
                                <div className='genres'>
                                    {gameInfo.game.genres && gameInfo.game.genres.map((x: number) => GenreEnums[x]).join(', ')}
                                </div>
                                <div className='platforms my-1'>
                                    {gameInfo.game.linkIcons && gameInfo.game.linkIcons.map((x: string) => <i className={`fab ${x} mx-2`}/>)}
                                </div>
                                <Button
                                    className="price-btn mt-1" 
                                    variant="raised"
                                    onClick={() => window.open(`${gameInfo.btnText.link}`)}
                                >
                                    {gameInfo.btnText}
                                </Button>
                            </div>
                        </div>
                    ))}
            </Slider>
            <div className="fullsize-results pb-4">
                {props.games && props.games
                    .map((game: GameResponse, index: number) => {
                        const isEditorsChoiceGame: boolean = props.editorsGamesIndicies.findIndex((x: number) => x === index) !== -1;
                        const isFeatureGame: boolean = props.featureGamesIndicies.findIndex((x: number) => x === index) !== -1;
                        const isSubFeatureGame: boolean = props.subFeatureGamesIndicies.findIndex((x: number) => x === index) !== -1;

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
            <Footer/>
        </>
    );

};

export default Home;