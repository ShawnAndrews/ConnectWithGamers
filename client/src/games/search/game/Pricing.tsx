import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { PriceInfoResponse, PricingsEnum } from '../../../../client-server-common/common';

interface IPricingProps {
    pricings: PriceInfoResponse[];
    isFree: boolean;
    isDiscounted: boolean;
    basePrice: number;
    onPricingClick: () => void;
    getConvertedPrice: (price: number, skipCurrencyType: boolean) => string;
}

const Pricing: React.SFC<IPricingProps> = (props: IPricingProps) => {

    const mainGame: PriceInfoResponse = props.pricings.find((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.main_game);
    const demoPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.demo) !== -1;
    const dlcPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.dlc) !== -1;
    const bundlesPricingsExist: boolean = props.pricings.findIndex((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.bundles) !== -1;
    const noAdditonalPricingsExist: boolean = !dlcPricingsExist && !bundlesPricingsExist && !bundlesPricingsExist;
    const imgSrc: string = 'https://i.imgur.com/sIw8aIf.png';

    const getEntriesByPricingsEnum = (pricingEnum: PricingsEnum): any[] => {
        return props.pricings
            .filter((priceInfo: PriceInfoResponse) => {
                return priceInfo.pricingEnumSysKeyId === pricingEnum
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
                            {dlcPricingsExist && 
                                <div className="my-2">
                                    <p className="tooltip-header">Downloadable Content</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.dlc)}
                                </div>}
                            {demoPricingsExist && 
                                <div className="my-2">
                                    <p className="tooltip-header">Demos</p>
                                    {getEntriesByPricingsEnum(PricingsEnum.demo)}
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
                    <div onClick={() => props.onPricingClick()}>
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