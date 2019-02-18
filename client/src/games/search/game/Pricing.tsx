import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { PriceInfo, IGDBExternalCategoryEnum, PricingsEnum } from '../../../../client-server-common/common';

interface IPricingProps {
    pricings: PriceInfo[];
    isFree: boolean;
    isDiscounted: boolean;
    basePrice: number;
    externalCategoryEnum: IGDBExternalCategoryEnum;
}

const Pricing: React.SFC<IPricingProps> = (props: IPricingProps) => {

    const mainGame: PriceInfo = props.pricings.find((priceInfo: PriceInfo) => priceInfo.pricings_enum === PricingsEnum.main_game);
    const xboxPassPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfo) => priceInfo.pricings_enum === PricingsEnum.free_or_discounted_with_xbox_game_pass) !== -1;
    const xboxGoldPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfo) => priceInfo.pricings_enum === PricingsEnum.free_or_discounted_with_xbox_live_gold) !== -1;
    const dlcPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfo) => priceInfo.pricings_enum === PricingsEnum.dlc) !== -1;
    const inAppPurchasePricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfo) => priceInfo.pricings_enum === PricingsEnum.in_app_purchase) !== -1;
    const bundlesPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfo) => priceInfo.pricings_enum === PricingsEnum.bundles) !== -1;
    const noAdditonalPricingsExist: boolean = !xboxPassPricingsExist && !xboxGoldPricingsExist && !dlcPricingsExist && !inAppPurchasePricingsExist && !bundlesPricingsExist && !bundlesPricingsExist;

    let imgSrc: string = undefined;

    if (props.externalCategoryEnum === IGDBExternalCategoryEnum.steam) {
        imgSrc = 'https://i.imgur.com/gs7QHLe.jpg';
    } else if (props.externalCategoryEnum === IGDBExternalCategoryEnum.gog) {
        imgSrc = 'https://i.imgur.com/JwlrTYJ.jpg';
    } else if (props.externalCategoryEnum === IGDBExternalCategoryEnum.microsoft) {
        imgSrc = 'https://i.imgur.com/UT2dYkq.jpg';
    } else if (props.externalCategoryEnum === IGDBExternalCategoryEnum.apple) {
        imgSrc = 'https://i.imgur.com/RXPYHhm.jpg';
    } else if (props.externalCategoryEnum === IGDBExternalCategoryEnum.android) {
        imgSrc = 'https://i.imgur.com/FmAy8k0.jpg';
    }

    const getEntriesByPricingsEnum = (pricingEnum: PricingsEnum): any[] => {
        return props.pricings
            .filter((priceInfo: PriceInfo) => {
                return priceInfo.pricings_enum === pricingEnum
            })
            .map((priceInfo: PriceInfo) => (
                <div>
                    <em>{priceInfo.title}</em> for 
                    {!priceInfo.price
                    ?
                    ` Free`
                    :
                    priceInfo.discount_percent ? ` $${priceInfo.price} ${priceInfo.discount_percent ? ` (-${priceInfo.discount_percent}%)`: ``}` : ` $${priceInfo.price}`}
                </div>
            ));
    };

    return (
        <div className="pricing w-100">
            <img className="w-100 h-100" src={imgSrc} />
            <div className="price cursor-pointer">
                <Tooltip
                    disableFocusListener={true}
                    disableTouchListener={true}
                    title={
                        <>
                            {noAdditonalPricingsExist && <div className="tooltip-header">No additional content available.</div>}
                            {xboxPassPricingsExist && 
                                <>
                                    <p className="tooltip-header mt-3">Xbox Game Pass - Free and Discount games</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.free_or_discounted_with_xbox_game_pass)}
                                </>}
                            {xboxGoldPricingsExist && 
                                <>
                                    <p className="tooltip-header mt-3">Xbox Live Gold - Discounted games</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.free_or_discounted_with_xbox_live_gold)}
                                </>}
                            {dlcPricingsExist && 
                                <>
                                    <p className="tooltip-header mt-3">Downloadable Content</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.dlc)}
                                </>}
                            {inAppPurchasePricingsExist && 
                                <>
                                    <p className="tooltip-header mt-3">In-App Purchases</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.in_app_purchase)}
                                </>}
                            {bundlesPricingsExist && 
                                <>
                                    <p className="tooltip-header mt-3">Bundles</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.bundles)}
                                </>}
                        </>
                    }
                    placement="right"
                >
                    {props.isFree 
                        ? 
                        <div>Free</div>
                        : 
                        <div className="price-container">
                            {props.isDiscounted && <del className="pr-1">${props.basePrice}</del>}
                            ${mainGame.price}
                        </div>}
                </Tooltip>
            </div>
        </div>
    );

};

export default Pricing;