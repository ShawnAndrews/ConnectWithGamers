import * as React from 'react';
import { SidenavEnums, GameResponse } from '../../../../client-server-common/common';
import GameListContainer, { GameListType } from '../../game/GameListContainer';
import Slider from "react-slick";

interface IHorrorGamesBannerProps {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    games: GameResponse[];
    mediaCarouselElement: any;
}

const HorrorGamesBanner: React.SFC<IHorrorGamesBannerProps> = (props: IHorrorGamesBannerProps) => {

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <i className="fas fa-chevron-right arrow-right" onClick={onClick}/>
        );
      }
      
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <i className="fas fa-chevron-left arrow-left" onClick={onClick}/>
        );
    }

    const settings = {
        dots: false,
        infinite: true,
        arrows: true,
        slidesToScroll: 1,
        adaptiveHeight: true,
        variableWidth: true,
        draggable: false,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    return (
        <div className="horror-games-banner my-2">
            <h5 className="header color-tertiary px-5 mb-3">
                <i className="fas fa-ghost d-inline-block mr-2"/>
                <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/HorrorGames`)}>Horror</div>
            </h5>
            <Slider className="media-carousel mx-5" ref={slider => (props.mediaCarouselElement = slider)} {...settings} >
                {props.games && props.games
                    .filter((game: GameResponse) => game.cover)
                    .sort((a: GameResponse, b: GameResponse) => (b.review.id - a.review.id))
                    .map((game: GameResponse, index: number) => {
                        return (
                            <GameListContainer
                                type={GameListType.ScrollingCover}
                                game={game}
                                index={index}
                            />
                        );
                    })}
            </Slider>
        </div>
    );

};

export default HorrorGamesBanner;
