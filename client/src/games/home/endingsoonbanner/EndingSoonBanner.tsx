import * as React from 'react';
import { SidenavEnums, GameResponse, PriceInfoResponse, CurrencyType } from '../../../../client-server-common/common';
import Slider from "react-slick";
import TimerBannerContainer from './TimerBannerContainer';
import { getGameBestPricingStatus, getPriceInUserCurrency } from '../../../util/main';
import { Textfit } from 'react-textfit';

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

    const bestPricing: PriceInfoResponse = getGameBestPricingStatus(props.games[props.currentSlideIndex].pricings);
    const bestPricingBasePrice: number = bestPricing.price && bestPricing.discount_percent && + (bestPricing.price / ((100 - bestPricing.discount_percent) / 100)).toFixed(2);

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
        autoplay: true,
        autoplaySpeed: 2200,
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
                        {bestPricing.discount_percent &&
                            <>
                                <div className="discount-percent d-inline-block">-{bestPricing.discount_percent}%</div>
                                <div className="base-price d-inline-block">{getPriceInUserCurrency(bestPricingBasePrice, props.currencyType, props.currencyRate)}</div>
                            </>}
                        <div className="price d-inline-block">{getPriceInUserCurrency(bestPricing.price, props.currencyType, props.currencyRate)}</div>
                    </div>
                </div>
            </div>
            <div className="spotlights align-top d-inline-block pt-4">
                <div className="spotlight align-top d-inline-block w-50 pr-2">
                    <div className="head">
                        <div className="left">Editor's Choice</div>
                    </div>
                    <img className="w-100 cursor-pointer" src="https://steamcdn-a.akamaihd.net/steam/apps/24980/capsule_616x353.jpg"/>
                    <div className="foot">
                        <Textfit className="left name px-2 w-100" max={17} mode="single">{props.games[props.games.length - 1].name}</Textfit>
                    </div>
                </div>
                <div className="spotlight align-top d-inline-block w-50 pl-2">
                    <div className="head">
                        <div className="left">Game of the month</div>
                    </div>
                    <img className="w-100 cursor-pointer" src="https://steamcdn-a.akamaihd.net/steam/apps/244850/capsule_616x353.jpg"/>
                    <div className="foot">
                        <Textfit className="left name px-2 w-100" max={17} mode="single">{props.games[props.games.length - 2].name}</Textfit>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default EndingSoonBanner;
