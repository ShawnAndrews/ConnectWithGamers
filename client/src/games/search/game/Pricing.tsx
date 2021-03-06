import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { PriceInfoResponse, PricingsEnum, IdNamePair, ReviewEnum, GameResponse } from '../../../../client-server-common/common';
import { Textfit } from 'react-textfit';
import PriceContainer from '../../price/PriceContainer';

interface IPricingProps {
    game: GameResponse;
    onPricingClick: () => void;
    getConvertedPrice: (price: number, skipCurrencyType: boolean) => string;
    review: IdNamePair;
    total_review_count: number;
}

const Pricing: React.SFC<IPricingProps> = (props: IPricingProps) => {

    const demoPricingsExist: boolean = props.game.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.demo) !== -1;
    const dlcPricingsExist: boolean = props.game.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.dlc) !== -1;
    const bundlesPricingsExist: boolean = props.game.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.bundles) !== -1;
    const reviewColor: string = 
        props.review.id === ReviewEnum["Overwhelmingly Negative"] ? "216,20,20" : 
        props.review.id === ReviewEnum["Very Negative"] ? "214,63,63" : 
        props.review.id === ReviewEnum.Negative ? "212,83,83" : 
        props.review.id === ReviewEnum["Mostly Negative"] ? "218,106,106" : 
        props.review.id === ReviewEnum.Mixed ? "210,162,162" : 
        props.review.id === ReviewEnum["Mostly Positive"] ? "162,210,172" : 
        props.review.id === ReviewEnum.Positive ? "140,208,154" : 
        props.review.id === ReviewEnum["Very Positive"] ? "105,206,125" : 
        props.review.id === ReviewEnum["Overwhelmingly Positive"] ? "38,206,71" : "101,104,109";
    const reviewPercent: number = 
        props.review.id === ReviewEnum["Overwhelmingly Negative"] ? 11 : 
        props.review.id === ReviewEnum["Very Negative"] ? 22 : 
        props.review.id === ReviewEnum.Negative ? 33 : 
        props.review.id === ReviewEnum["Mostly Negative"] ? 44 : 
        props.review.id === ReviewEnum.Mixed ? 55 : 
        props.review.id === ReviewEnum["Mostly Positive"] ? 66 : 
        props.review.id === ReviewEnum.Positive ? 77 : 
        props.review.id === ReviewEnum["Very Positive"] ? 88 : 
        props.review.id === ReviewEnum["Overwhelmingly Positive"] ? 100 : 0;

    const getEntriesByPricingsEnum = (pricingEnum: PricingsEnum): any[] => {
        return props.game.pricings
            .filter((priceInfo: PriceInfoResponse) => {
                return priceInfo.pricingEnumSysKeyId === pricingEnum
            })
            .map((priceInfo: PriceInfoResponse) => (
                <div className="entry">
                    <Tooltip title={priceInfo.title}>
                        <div className="entry-name d-inline-block pl-1">{priceInfo.title}</div>
                    </Tooltip>
                    <div className="entry-price d-inline-block">
                        {!priceInfo.price ? `Free` : priceInfo.discount_percent ? `${props.getConvertedPrice(priceInfo.price, false)}` : ` ${props.getConvertedPrice(priceInfo.price, false)}`}
                        {priceInfo.discount_percent && <div className="entry-price-discount d-inline-block ml-1">-{priceInfo.discount_percent}%</div>}
                    </div>
                </div>
            ));
    };

    return (
        <div className="pricing w-100 d-inline-block">
            <div className="price-text d-inline-block w-50">
                <PriceContainer
                    game={props.game}
                    showTextStatus={true}
                />
            </div>
            <div className="review d-inline-block w-50">
                <Textfit className="name" style={{ color: `rgb(${reviewColor})` }} min={10.5}>{props.review.name} <sup>{props.total_review_count !== 0 ? props.total_review_count : ``}</sup></Textfit>
                <div className="stat-bar position-relative mt-2 w-100">
                    <span className="stat-bar-rating" role="stat-bar" style={{ width: `${reviewPercent}%`, backgroundImage: `-webkit-linear-gradient(bottom, rgba(${reviewColor}, 1.0) 0%, rgba(${reviewColor}, 1.0) 47%, rgba(${reviewColor}, 0.65) 50%, rgba(${reviewColor}, 0.65) 100%)` }}/>
                </div>
            </div>
            {demoPricingsExist && 
                <div className="tooltip-container">
                    <div className="tooltip-header mb-2 mt-3">Demos</div>
                    {getEntriesByPricingsEnum(PricingsEnum.demo)}
                </div>}
            {bundlesPricingsExist && 
                <div className="tooltip-container">
                    <div className="tooltip-header mb-2 mt-3">Bundles</div>
                    {getEntriesByPricingsEnum(PricingsEnum.bundles)}
                </div>}
            {dlcPricingsExist && 
                <div className="tooltip-container">
                    <div className="tooltip-header mb-2 mt-3">Downloadable Content</div>
                    {getEntriesByPricingsEnum(PricingsEnum.dlc)}
                </div>}
        </div>
    );

};

export default Pricing;