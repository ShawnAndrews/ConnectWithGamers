import { PriceInfoResponse, PricingsEnum, CurrencyType, CURRENCY_TOKEN_NAME } from "../../client-server-common/common";
import * as SteamService from '../service/steam/main';
import { resolve } from "dns";
import { ReactElement } from "react";

/**
 * Convert Date->MM-DD-YYYY/Today at/Yesterday at/<day_of_week> at.
 */
export function getFormattedDate(dateParam: Date) {
    const date = new Date(dateParam);
    const today = new Date();
    const yesterday = new Date();
    const lastweek = new Date();
    yesterday.setDate(today.getDate() - 1);
    lastweek.setDate(today.getDate() - 7);
    if (today.toLocaleDateString() === date.toLocaleDateString()) {
        return "Today at";
    } else if (yesterday.toLocaleDateString() === date.toLocaleDateString()) {
        return "Yesterday at";
    } else if (date.toLocaleDateString() > lastweek.toLocaleDateString()) {
        return `${date.toLocaleString(window.navigator.language, {weekday: "short"})} at`;
    } else {
        return date.toLocaleDateString();
    }
}

/**
 * Convert Unix Timestamp -> (in) X mins (ago) / (in) X hrs (ago) / (in) X days (ago).
 */
export function formatDate(date: number): string {
    const now: Date = new Date();
    const dateBeforeCurrent: boolean = date < Math.floor(now.getTime() / 1000);
    const CURRENT_UNIX_TIME_MS: number = parseInt(new Date().getTime().toString().slice(0, -3));
    const TARGET_UNIX_TIME_MS: number = new Date(date).getTime();
    let difference: number = dateBeforeCurrent ? CURRENT_UNIX_TIME_MS - TARGET_UNIX_TIME_MS : TARGET_UNIX_TIME_MS - CURRENT_UNIX_TIME_MS;
    let hoursDifference: number = Math.floor(difference / 60 / 60);
    const textWrap = (num: number, unit: string): string => { return dateBeforeCurrent ? `${num} ${unit} ago` : `In ${num} ${unit}`}

    if (hoursDifference <= 0) {
        return "now";
    } else if (hoursDifference < 1) {
        const minutes: number = Math.floor(60 * (difference / 60 / 60));
        return textWrap(minutes, "mins");
    } else if (hoursDifference < 24) {
        return textWrap(hoursDifference, "hrs");
    } else {
        return textWrap(Math.floor(hoursDifference / 24), "days");
    }
};

/**
 * Detect image load failure and set a fallback image.
 */
export function onImgError(image: any): any {
    image.target.onerror = "";
    image.target.src = "https://i.imgur.com/WcPkTiF.png";
    return true;
};

/**
 * Get a game's best price. 
 */
export function getGameBestPricingStatus(pricings: PriceInfoResponse[]): PriceInfoResponse {
    let lowestPrice: number = Number.MAX_SAFE_INTEGER;
    let lowestDiscountPercent: number = undefined;
    let comingSoon: boolean = false;
    let preorder: boolean = false;

    pricings && pricings.forEach((pricing: PriceInfoResponse) => {
        if (pricing.pricingEnumSysKeyId === PricingsEnum.main_game) {
            if (!pricing.price) {
                lowestPrice = undefined;
                lowestDiscountPercent = undefined;
            } else {
                if (lowestPrice !== undefined && (pricing.price < lowestPrice)) {
                    lowestPrice = pricing.price;
                    lowestDiscountPercent = pricing.discount_percent;
                }
            }  
        }
    })

    const priceInfo: PriceInfoResponse = { steamGamesSysKeyId: -1, title: undefined, price: lowestPrice, discount_percent: lowestDiscountPercent, pricingEnumSysKeyId: PricingsEnum.main_game, discount_end_dt: undefined, log_dt: undefined };
    return priceInfo;
}

/**
 * Get Font Awesome icon string to display for a given currency.
 */
export function getFAFromCurrency(currencyType: CurrencyType): string {

    if (currencyType === CurrencyType.EUR) {
        return "fa-euro-sign"
    } else if (currencyType === CurrencyType.GBP) {
        return "fa-pound-sign"
    }

    return "fa-dollar-sign";
}

/**
 *  Get user saved currency from cookies. Default to USD if none saved.
 */
export function getCurrencyByCookie(): CurrencyType {

    const cookieMatch: string[] = document.cookie.match(new RegExp(`${CURRENCY_TOKEN_NAME}=([^;]+)`));
    if (cookieMatch) {
        const currencyType: CurrencyType = CurrencyType[cookieMatch[1]];
        return currencyType;
    }

    return CurrencyType.USD;
}

/**
 *  Set user saved currency from cookies.
 */
export function setCurrencyCookie(newCurrencyType: CurrencyType): void {
    document.cookie = `${CURRENCY_TOKEN_NAME}=${newCurrencyType}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;`;
}

/**
 *  Get up-to-date currency rate for a given currency.
 */
export function getCurrencyRate(currencyType: CurrencyType): Promise<number> {

    return new Promise((resolve: any, reject: any) => {
        SteamService.httpGenericGetData<void>(`https://api.exchangeratesapi.io/latest?base=USD`, true)
            .then( (response: any) => {
                const currencyRate: number = response.rates[currencyType];
                return resolve(currencyRate);
            })
            .catch( (error: string) => {
                console.log(error);
                return reject(error);
            });
    });

}

/**
 *  Get price converted to user currency in string form.
 */
export function getPriceInUserCurrency(price: number, currencyType: CurrencyType, currencyRate: number, skipCurrencyType: boolean = false): string {
    let currencySymbol: string = undefined;

    if (currencyType === CurrencyType.USD || currencyType === CurrencyType.CAD || currencyType === CurrencyType.AUD) {
        currencySymbol = `$`;
    } else if (currencyType === CurrencyType.GBP) {
        currencySymbol = `£`;
    } else if (currencyType === CurrencyType.EUR) {
        currencySymbol = `€`;
    }

    return `${currencySymbol} ${(currencyRate * price).toFixed(2)}${!skipCurrencyType ? ` ${currencyType}` : ``}`;
}