import * as React from 'react';
import { SidenavEnums, GameResponse, CurrencyType, getSteamCoverHugeURL } from '../../../../client-server-common/common';
import Slider from "react-slick";
import TimerBannerContainer from './TimerBannerContainer';
import { Textfit } from 'react-textfit';
import PriceContainer from '../../price/PriceContainer';

interface IEndingSoonBannerProps {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    games: GameResponse[];
    discountEndDt: Date;
    currentSlideIndex: number;
    updateCurrentSlideIndex: (current: number) => void;
    currencyType: CurrencyType;
    currencyRate: number;
}

const EndingSoonBanner: React.SFC<IEndingSoonBannerProps> = (props: IEndingSoonBannerProps) => {

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
        dots: true,
        variableWidth: false,
        arrows: true,
        infinite: true,
        swipe: false,
        slidesToScroll: 1,
        swipeToSlide: false,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        beforeChange: props.updateCurrentSlideIndex,
        afterChange: props.updateCurrentSlideIndex
    };

    return (
        <div className="ending-soon align-top d-inline-block pl-4">
            <div className="today-deals">
                <div className="today-deals-header">
                    <div className="left">Deals ending soon</div>
                    <div className="right">
                        <TimerBannerContainer discountEndDt={props.discountEndDt}/>
                    </div>
                </div>
                <Slider {...settings} >
                    {props.games && 
                        props.games
                            .slice(0, props.games.length - 2)
                            .map((game: GameResponse, index: number) => {
                                return <img src={game.cover_huge} className="cover cursor-pointer" onClick={() => props.goToRedirect(`/search/game/${game.steamId}`)}/>;
                            })}
                </Slider>
                <div className="today-deals-footer">
                    <div className="left name">{props.games[props.currentSlideIndex].name}</div>
                    <div className="right">
                        <PriceContainer
                            game={props.games[props.currentSlideIndex]}
                            showTextStatus={true}
                        />
                    </div>
                </div>
            </div>
            <div className="spotlights align-top d-inline-block pt-4">
                <div className="spotlight align-top d-inline-block w-50 pr-2">
                    <div className="head">
                        <div className="left">Editor's Choice</div>
                    </div>
                    <img className="w-100 cursor-pointer" src={getSteamCoverHugeURL(props.games[2].steamId)}/>
                    <div className="foot">
                        <Textfit className="left name" min={12} max={17} mode="single">{props.games[2].name}</Textfit>
                    </div>
                </div>
                <div className="spotlight align-top d-inline-block w-50 pl-2">
                    <div className="head">
                        <div className="left">Game of the month</div>
                    </div>
                    <img className="w-100 cursor-pointer" src={getSteamCoverHugeURL(props.games[3].steamId)}/>
                    <div className="foot">
                        <Textfit className="left name" min={12} max={17} mode="single">{props.games[3].name}</Textfit>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default EndingSoonBanner;
