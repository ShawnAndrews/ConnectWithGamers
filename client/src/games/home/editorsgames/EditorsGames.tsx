import * as React from 'react';
import { SidenavEnums, GameResponse, CurrencyType, PricingStatus } from '../../../../client-server-common/common';
import Slider from "react-slick";
import { getLatestMainGamePricingStatus, getPriceInUserCurrency, getBasePrice } from '../../../util/main';
import { Textfit } from 'react-textfit';
import { Button } from '@material-ui/core';

interface IEditorsGamesProps {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    editorsGames: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
    currentIndex: number;
    slideChanged: (index: number) => void;
}

const EditorsGames: React.SFC<IEditorsGamesProps> = (props: IEditorsGamesProps) => {

    const settings = {
        className: "editors-games-carousel d-inline-block align-top w-100 mb-4",
        infinite: true,
        dots: true,
        swipeToSlide: true,
        variableWidth: false,
        arrows: false
    };

    const mainPrice: PricingStatus = getLatestMainGamePricingStatus(props.editorsGames[props.currentIndex].pricings);
    const isDiscounted: boolean = mainPrice.discount_percent && (new Date(mainPrice.discount_end_dt) > new Date());

    return (
        <Slider {...settings} afterChange={props.slideChanged} >
            {props.editorsGames && 
                props.editorsGames.map((game: GameResponse, index: number) => (
                    <div className="item">
                        <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={true} onEnded={() => {}} playsInline={true} onClick={() => {}}>
                            <source src={game.video} type="Video/mp4"/>
                            <span>Your browser does not support the video tag.</span>
                        </video>
                        <div className="highlighted-table-text">
                            <Textfit className='name' min={18} max={30}>
                                {game.name}
                            </Textfit>
                            <Button
                                className={`price-btn ${isDiscounted ? 'discounted' : ''}`}
                                variant="contained"
                                onClick={() => props.goToRedirect(`/search/game/${props.editorsGames[props.currentIndex].steamId}`)}
                            >
                                {isDiscounted &&
                                    <span className="base-price">{getPriceInUserCurrency(getBasePrice(mainPrice.price, mainPrice.discount_percent), props.currencyType, props.currencyRate)}</span>}
                                <span className={`price ${isDiscounted ? 'discounted' : ''}`}>{getPriceInUserCurrency(mainPrice.price, props.currencyType, props.currencyRate)}</span>
                            </Button>
                        </div>
                    </div>
                ))}
        </Slider>
    );

};

export default EditorsGames;
