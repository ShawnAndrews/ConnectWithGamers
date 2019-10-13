import * as React from 'react';
import { GameResponse, PriceInfoResponse, ReviewEnum } from '../../../../client-server-common/common';
import { Paper } from '@material-ui/core';
import { Textfit } from 'react-textfit';
import { getFormattedDate, getGameBestPricingStatus } from '../../../util/main';

interface ISearchGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const SearchGame: React.SFC<ISearchGameProps> = (props: ISearchGameProps) => {
    const bestPrice: PriceInfoResponse = getGameBestPricingStatus(props.game.pricings);
    const bestPriceOriginal: number = bestPrice.discount_percent && + (bestPrice.price / ((100 - bestPrice.discount_percent) / 100)).toFixed(2);
    const reviewColor: string = 
        props.game.review.id === ReviewEnum["Overwhelmingly Negative"] ? "216,20,20" : 
        props.game.review.id === ReviewEnum["Very Negative"] ? "214,63,63" : 
        props.game.review.id === ReviewEnum.Negative ? "212,83,83" : 
        props.game.review.id === ReviewEnum["Mostly Negative"] ? "218,106,106" : 
        props.game.review.id === ReviewEnum.Mixed ? "210,162,162" : 
        props.game.review.id === ReviewEnum["Mostly Positive"] ? "162,210,172" : 
        props.game.review.id === ReviewEnum.Positive ? "140,208,154" : 
        props.game.review.id === ReviewEnum["Very Positive"] ? "105,206,125" : 
        props.game.review.id === ReviewEnum["Overwhelmingly Positive"] ? "38,206,71" : "101,104,109";
    const reviewPercent: number = 
        props.game.review.id === ReviewEnum["Overwhelmingly Negative"] ? 11 : 
        props.game.review.id === ReviewEnum["Very Negative"] ? 22 : 
        props.game.review.id === ReviewEnum.Negative ? 33 : 
        props.game.review.id === ReviewEnum["Mostly Negative"] ? 44 : 
        props.game.review.id === ReviewEnum.Mixed ? 55 : 
        props.game.review.id === ReviewEnum["Mostly Positive"] ? 66 : 
        props.game.review.id === ReviewEnum.Positive ? 77 : 
        props.game.review.id === ReviewEnum["Very Positive"] ? 88 : 
        props.game.review.id === ReviewEnum["Overwhelmingly Positive"] ? 100 : 0;

    return (
        <div className="col-12 col-lg-6 col-xl-3 px-4 px-md-2 my-2">
            <Paper className="game hover-tertiary-solid cursor-pointer position-relative" onClick={props.goToGame}>
                <img className="cover-img w-100" src={props.game.cover || 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <Textfit className="name color-secondary font-weight-bold text-nowrap px-2" min={11} max={18}>
                    {props.game.name}
                </Textfit>
                <div className="genres font-italic text-nowrap px-2">
                    {props.game.genres && 
                        props.game.genres.map(x => x.name).join(", ")}
                </div>
                <div className="time">
                    {props.game.first_release_date ? `Released at ${getFormattedDate(new Date(props.game.first_release_date))}` : `Unreleased`}
                </div>
                <div className="pricing position-relative mx-auto">
                    {bestPrice.discount_percent && <div className="original-price d-inline-block">${bestPriceOriginal}</div>}
                    <div className="price d-inline-block">${bestPrice.price}</div>
                    <div className="discount d-inline-block ml-2">{bestPrice.discount_percent && `-${bestPrice.discount_percent}%`}</div>
                </div>
                <div className="stat-bar position-relative mt-2 w-100">
                    <span className="stat-bar-rating" role="stat-bar" style={{ width: `${reviewPercent}%`, backgroundImage: `-webkit-linear-gradient(bottom, rgba(${reviewColor}, 1.0) 0%, rgba(${reviewColor}, 1.0) 47%, rgba(${reviewColor}, 0.65) 50%, rgba(${reviewColor}, 0.65) 100%)` }}/>
                </div>
            </Paper>
        </div>
    );

};

export default SearchGame;