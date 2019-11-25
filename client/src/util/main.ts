import { PriceInfoResponse, PricingsEnum, CurrencyType, CURRENCY_TOKEN_NAME, PricingStatus } from "../../client-server-common/common";
import * as SteamService from '../service/steam/main';

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
        return `Today at ${date.toLocaleTimeString()}`;
    } else if (yesterday.toLocaleDateString() === date.toLocaleDateString()) {
        return `Yesterday at ${date.toLocaleTimeString()}`;
    } else if (date.getTime() > lastweek.getTime()) {
        return `${date.toLocaleString(window.navigator.language, {weekday: "long"})}`;
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
 * Get a game's latest main game pricing. 
 */
export function getLatestMainGamePricingStatus(pricings: PriceInfoResponse[]): PricingStatus {
    let pricingStatus: PricingStatus = { title: null, price: null, discount_end_dt: null, discount_percent: null, state: null };

    pricings && 
        pricings
            .filter((pricing: PriceInfoResponse) => pricing.pricingEnumSysKeyId === PricingsEnum.main_game)
            .sort((a: PriceInfoResponse, b: PriceInfoResponse) => new Date(b.log_dt).getTime() - new Date(a.log_dt).getTime())
            .slice(0, 1)
            .forEach((pricing: PriceInfoResponse) => {
                pricingStatus.title = pricing.title;
                pricingStatus.price = pricing.price;
                pricingStatus.discount_percent = pricing.discount_percent;
                pricingStatus.discount_end_dt = pricing.discount_end_dt;
            })

    return pricingStatus
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

export function getCurrencySymbol(currencyType: CurrencyType): string {
    let currencySymbol: string = undefined;

    if (currencyType === CurrencyType.USD || currencyType === CurrencyType.CAD || currencyType === CurrencyType.AUD) {
        currencySymbol = `$`;
    } else if (currencyType === CurrencyType.GBP) {
        currencySymbol = `£`;
    } else if (currencyType === CurrencyType.EUR) {
        currencySymbol = `€`;
    }

    return currencySymbol;
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

/**
 *  Get pricings without their history.
 */
export function getUniquePricings(pricings: PriceInfoResponse[]): PriceInfoResponse[] {
    const uniquePricings: PriceInfoResponse[] = [];

    pricings.forEach((pricing: PriceInfoResponse) => {
        let isDuplicate: boolean = false;
        uniquePricings.forEach((uniquePricing: PriceInfoResponse) => {
            if (uniquePricing.steamGamesSysKeyId === pricing.steamGamesSysKeyId && uniquePricing.pricingEnumSysKeyId === pricing.pricingEnumSysKeyId && uniquePricing.title === pricing.title) {
                isDuplicate = true; 
            }
        });
        if (!isDuplicate) {
            uniquePricings.push(pricing);
        }
    });

    return uniquePricings;
}

/**
 *  Get base price given a pricing, assuming the pricing is discounted.
 */
export function getBasePrice(price: number, discountPercent: number): number {
    return + (price / ((100 - discountPercent) / 100)).toFixed(2);
}