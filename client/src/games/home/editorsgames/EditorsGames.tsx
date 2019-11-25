import * as React from 'react';
import { SidenavEnums, GameResponse, CurrencyType, PlatformEnum, IdNamePair, PricingStatus } from '../../../../client-server-common/common';
import Slider from "react-slick";
import { getLatestMainGamePricingStatus, getPriceInUserCurrency, getBasePrice } from '../../../util/main';
import { Textfit } from 'react-textfit';
import { Button } from '@material-ui/core';
import GameListContainer, { GameListType } from '../../game/GameListContainer';

interface IEditorsGamesProps {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    editorsGames: GameResponse[];
    recommendedGames: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
    currentIndex: number;
    slideChanged: (index: number) => void;
}

const EditorsGames: React.SFC<IEditorsGamesProps> = (props: IEditorsGamesProps) => {

    const settings = {
        className: "editors-games-carousel d-inline-block align-top",
        infinite: true,
        dots: true,
        swipeToSlide: true,
        variableWidth: false,
        arrows: false
    };

    const mainPrice: PricingStatus = getLatestMainGamePricingStatus(props.editorsGames[props.currentIndex].pricings);

    const isDiscountOver = (discountEndDt: Date): boolean => new Date(discountEndDt) < new Date();
    const getOnSaleText = (discountEndDt: Date): string => {
        const oneDay = 24 * 60 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;
        const daysDifference: number = Math.round(Math.abs((new Date().getTime() - new Date(discountEndDt).getTime()) / oneDay));
        const hoursDifference: number = Math.round(Math.abs((new Date().getTime() - new Date(discountEndDt).getTime()) / oneHour));

        if (daysDifference < 1) {
            return `On sale for ${mainPrice.discount_percent}% for ${hoursDifference < 1 ? '1' : hoursDifference} more ${hoursDifference !== 1 ? 'hours' : 'hour'}!`;
        } else {
            return `On sale for ${mainPrice.discount_percent}% for ${daysDifference} more ${daysDifference !== 1 ? 'days' : 'day'}!`;
        }

    };

    return (
        <div className="editors-games w-100 mb-5">
            <div className="editors-games-container">
                <div className="editors-game-info p-3 d-inline-block align-top">
                    <Textfit className='name mb-3 w-100' min={18} max={30}>
                        {props.editorsGames[props.currentIndex].name}
                    </Textfit>
                    {props.editorsGames[props.currentIndex].platforms &&
                        <div className={`platforms`}>
                            {props.editorsGames[props.currentIndex].platforms.map((platform: IdNamePair) => {
                                if (platform.id === PlatformEnum.windows) return <i className="fab fa-windows mr-2"/>;
                                if (platform.id === PlatformEnum.linux) return <i className="fab fa-linux mr-2"/>;
                                if (platform.id === PlatformEnum.mac) return <i className="fab fa-apple mr-2"/>;
                                })}
                        </div>}
                    {props.editorsGames[props.currentIndex].genres &&
                        <div className={`genres my-2`}>
                            {props.editorsGames[props.currentIndex].genres.slice(0, 5).map((genre: IdNamePair) => {
                                return genre.name;
                                }).join(`, `)}
                        </div>}
                    {mainPrice.discount_percent && !isDiscountOver(mainPrice.discount_end_dt) &&
                        <div className="on-sale mt-4">{getOnSaleText(mainPrice.discount_end_dt)}</div>}
                    <div className="price-btn-container">
                        <div className="price-label text-center mb-2">Buy it now!</div>
                        <Button
                            className="price-btn" 
                            variant="contained"
                            onClick={() => props.goToRedirect(`/search/game/${props.editorsGames[props.currentIndex].steamId}`)}
                        >
                            {mainPrice.discount_percent && !isDiscountOver(mainPrice.discount_end_dt) &&
                                <span className="base-price mr-2">{getPriceInUserCurrency(getBasePrice(mainPrice.price, mainPrice.discount_percent), props.currencyType, props.currencyRate)}</span>}
                            {getPriceInUserCurrency(mainPrice.price, props.currencyType, props.currencyRate)}
                        </Button>
                    </div>
                </div>
                <Slider {...settings} afterChange={props.slideChanged} >
                    {props.editorsGames && 
                        props.editorsGames.map((game: GameResponse, index: number) => (
                            <div className="item">
                                <video className="video-preview" muted={true} autoPlay={true} loop={true} onEnded={() => {}} playsInline={true} onClick={() => {}}>
                                    <source src={game.video} type="Video/mp4"/>
                                    <span>Your browser does not support the video tag.</span>
                                </video>
                            </div>
                        ))}
                </Slider>
            </div>
            <div className="recommended-games align-top">
                <div className="recommended-games-label px-3 py-2">
                    <i className="far fa-user-circle mr-2"/>
                    Recommended for you
                    </div>
                <div className="grid-results">
                    {props.recommendedGames && props.recommendedGames
                        .map((game: GameResponse, index: number) => (
                            <GameListContainer
                                type={GameListType.SmallCover}
                                game={game}
                                index={index}
                            />
                        ))}
                </div>
            </div>
        </div>
    );

};

export default EditorsGames;
