import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { PriceInfoResponse, IGDBExternalCategoryEnum, PricingsEnum } from '../../../../client-server-common/common';

interface IPricingProps {
    pricings: PriceInfoResponse[];
    isFree: boolean;
    isDiscounted: boolean;
    basePrice: number;
    externalCategoryEnum: IGDBExternalCategoryEnum;
    onPricingClick: (externalCategoryEnum: IGDBExternalCategoryEnum) => void;
    getConvertedPrice: (price: number, skipCurrencyType: boolean) => string;
}

const Pricing: React.SFC<IPricingProps> = (props: IPricingProps) => {

    const mainGame: PriceInfoResponse = props.pricings.find((priceInfo: PriceInfoResponse) => priceInfo.pricingEnum === PricingsEnum.main_game);
    const xboxPassPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnum === PricingsEnum.free_or_discounted_with_xbox_game_pass) !== -1;
    const xboxGoldPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnum === PricingsEnum.free_or_discounted_with_xbox_live_gold) !== -1;
    const dlcPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnum === PricingsEnum.dlc) !== -1;
    const inAppPurchasePricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnum === PricingsEnum.in_app_purchase) !== -1;
    const bundlesPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnum === PricingsEnum.bundles) !== -1;
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
            .filter((priceInfo: PriceInfoResponse) => {
                return priceInfo.pricingEnum === pricingEnum
            })
            .map((priceInfo: PriceInfoResponse) => (
                <div>
                    <em>{priceInfo.title}</em> for 
                    {!priceInfo.price
                    ?
                    ` Free`
                    :
                    priceInfo.discount_percent ? ` ${props.getConvertedPrice(priceInfo.price, false)} ${priceInfo.discount_percent ? ` (-${priceInfo.discount_percent}%)`: ``}` : ` ${props.getConvertedPrice(priceInfo.price, false)}`}
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
                                <div className="my-2">
                                    <p className="tooltip-header">Xbox Game Pass - Free and Discount games</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.free_or_discounted_with_xbox_game_pass)}
                                </div>}
                            {xboxGoldPricingsExist && 
                                <div className="my-2">
                                    <p className="tooltip-header">Xbox Live Gold - Discounted games</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.free_or_discounted_with_xbox_live_gold)}
                                </div>}
                            {dlcPricingsExist && 
                                <div className="my-2">
                                    <p className="tooltip-header">Downloadable Content</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.dlc)}
                                </div>}
                            {inAppPurchasePricingsExist && 
                                <div className="my-2">
                                    <p className="tooltip-header">In-App Purchases</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.in_app_purchase)}
                                </div>}
                            {bundlesPricingsExist && 
                                <div className="my-2">
                                    <p className="tooltip-header">Bundles</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.bundles)}
                                </div>}
                        </>
                    }
                    placement="right"
                >
                    <div onClick={() => props.onPricingClick(props.externalCategoryEnum)}>
                        {props.isFree 
                            ? 
                            <div>Free</div>
                            : 
                            <div className="price-container">
                                {props.isDiscounted && <del className="pr-1">{props.getConvertedPrice(props.basePrice, true)}</del>}
                                {props.getConvertedPrice(mainGame.price, true)}
                            </div>}
                    </div>
                </Tooltip>
            </div>
        </div>
    );

};

export default Pricing;