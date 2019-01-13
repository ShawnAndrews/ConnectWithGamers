import axios, { AxiosResponse } from "axios";
import config from "./../config";
import { SteamAPIGetPriceInfoResponse } from "../client/client-server-common/common";

/**
 * Convert Date->YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
    const d = new Date(date);
    let month = `` + (d.getMonth() + 1);
    let day = `` + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
        month = `0` + month;
    }
    if (day.length < 2) {
        day = `0` + day;
    }

    const formattedDate: string = [year, month, day].join(`-`);
    return formattedDate;
}

/**
 * Convert Timestamp->Readable format. ie: 1470873600000->Aug 11, 2016.
 */
export function formatTimestamp(timestamp: number): string {
    const monthsArr = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = monthsArr[date.getMonth()];
    const day = date.getDate();

    const formattedDate = month + `. ` + day + `, ` + year;

    return formattedDate;
}

/**
 * Returns date plus given number of months.
 */
export function addMonths(dateToAdd: Date, numMonthsToAdd: number) {
    const getDaysInMonth = (date: Date) => {
        const getDaysInMonth = (year: number, month: number) => {
            const isLeapYear = (year: number) => {
                return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
            };
            return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        };
        return getDaysInMonth(date.getFullYear(), date.getMonth());
    };

    const d = dateToAdd.getDate();
    dateToAdd.setDate(1);
    dateToAdd.setMonth(dateToAdd.getMonth() + numMonthsToAdd);
    dateToAdd.setDate(Math.min(d, getDaysInMonth(dateToAdd)));
    return dateToAdd;
}

/**
 * Returns an array with all elements of given value deleted.
 */
export function ArrayClean(arr: any[], deleteValue: any): any[] {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == deleteValue) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

/**
 * Return a psuedo-randomly generated string of a given length. URL safe.
 */
export function genRandStr(length: number) {
    let text: string = "";
    const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Parse steam app page for discount percent.
 */
function getSteamDiscountPercent(webpage: string): number {
    let discountPercent: number = undefined;
    const discardPrefix: string = `<table class="table table-fixed table-prices table-hover table-sortable">`;
    const discardPrefix2: string = `owned`;
    const discardPrefix3: string = `<td>`;
    const discardPrefix4: string = `<td>`;
    const discardSuffix: string = `</table>`;
    const discardSuffix2: string = `</tr>`;
    const discardSuffix4: string = `</td>`;
    const prefix: string = `<span class="price-discount">-`;
    const alternatePrefix: string = `<span class="price-discount-minor">-`;
    const suffix: string = `</span>`;

    // discard prefix and suffix
    const foundDiscardPrefixIndex: number = webpage.search(discardPrefix);
    if (foundDiscardPrefixIndex === -1) {
        return discountPercent;
    }
    webpage = webpage.substring(foundDiscardPrefixIndex);
    const foundDiscardSuffixIndex: number = webpage.search(discardSuffix);
    webpage = webpage.substring(0, foundDiscardSuffixIndex);
    const foundDiscardPrefix2Index: number = webpage.search(discardPrefix2);
    webpage = webpage.substring(foundDiscardPrefix2Index);
    const foundDiscardSuffix2Index: number = webpage.search(discardSuffix2);
    webpage = webpage.substring(0, foundDiscardSuffix2Index);
    const foundDiscardPrefix3Index: number = webpage.search(discardPrefix3);
    webpage = webpage.substring(foundDiscardPrefix3Index);
    const foundDiscardPrefix4Index: number = webpage.search(discardPrefix4);
    webpage = webpage.substring(foundDiscardPrefix4Index);
    const foundDiscardSuffix4Index: number = webpage.search(discardSuffix4);
    webpage = webpage.substring(0, foundDiscardSuffix4Index);

    const foundPrefixIndex: number = webpage.search(prefix);
    const foundAlternatePrefixIndex: number = webpage.search(alternatePrefix);
    const usingAlternative: boolean = foundPrefixIndex === -1;
    let foundSuffixIndex: number;
    if (foundPrefixIndex === -1) {
        if (foundAlternatePrefixIndex === -1) {
            return discountPercent;
        }
    }

    // remove pre-id text
    webpage = webpage.substring((Math.max(foundPrefixIndex, foundAlternatePrefixIndex)) + (usingAlternative ? alternatePrefix.length : prefix.length));

    // get id
    foundSuffixIndex = webpage.search(suffix);
    discountPercent = parseInt(webpage.substring(0, foundSuffixIndex));

    if (isNaN(discountPercent)) {
        discountPercent = undefined;
    }

    return discountPercent;
}

/**
 * Parse steam app page for price.
 */
function getSteamPrice(webpage: string): string {
    let price: string = undefined;
    const discardPrefix: string = `<table class="table table-fixed table-prices table-hover table-sortable">`;
    const discardPrefix2: string = `owned`;
    const discardSuffix: string = `</table>`;
    const discardSuffix2: string = `</tr>`;
    const prefix: string = `data-sort="`;
    const suffix: string = `"`;

    // discard prefix and suffix
    const foundDiscardPrefixIndex: number = webpage.search(discardPrefix);
    if (foundDiscardPrefixIndex === -1) {
        return price;
    }
    webpage = webpage.substring(foundDiscardPrefixIndex);
    const foundDiscardSuffixIndex: number = webpage.search(discardSuffix);
    webpage = webpage.substring(0, foundDiscardSuffixIndex);
    const foundDiscardPrefix2Index: number = webpage.search(discardPrefix2);
    webpage = webpage.substring(foundDiscardPrefix2Index);
    const foundDiscardSuffix2Index: number = webpage.search(discardSuffix2);
    webpage = webpage.substring(0, foundDiscardSuffix2Index);

    let foundPrefixIndex: number = webpage.search(prefix);
    let foundSuffixIndex: number;

    // remove pre-id text
    webpage = webpage.substring(foundPrefixIndex + prefix.length);

    // get id
    foundSuffixIndex = webpage.search(suffix);
    price = webpage.substring(0, foundSuffixIndex);
    if (price === "-1") {
        return undefined;
    }
    price = price.slice(0, price.length - 2) + "." + price.slice(price.length - 2);

    // remove id text
    webpage = webpage.substring(foundSuffixIndex + suffix.length);

    // find next id
    foundPrefixIndex = webpage.search(prefix);

    return price;
}

/**
 * Parse steam app page for price.
 */
function getSteamFreePrice(webpage: string): string {
    let price: string = undefined;
    const prefix: string = `aria-label="Free`;

    const foundPrefixIndex: number = webpage.search(prefix);

    if (foundPrefixIndex !== -1) {
        price = "Free";
    }

    return price;
}

/**
 * Returns Steam price info from Steam id.
 */
export function steamAPIGetPriceInfo(steamgameids: number[]): Promise<SteamAPIGetPriceInfoResponse[]> {

    const createPricePromise = (steamgameid: number): Promise<SteamAPIGetPriceInfoResponse> => {

        return new Promise((resolve: any, reject: any) => {
            const steamPriceInfo: SteamAPIGetPriceInfoResponse = {
                steamgameid: steamgameid,
                price: undefined,
                discount_percent: undefined,
                steam: `${config.steam.dbURL}/${steamgameid}/?cc=us`
            };

            axios({
                method: "get",
                url: steamPriceInfo.steam,
            })
            .then((response: AxiosResponse) => {
                const webpage: string = response.data;
                const freePrice: string = getSteamFreePrice(webpage);
                const finalPrice: string = getSteamPrice(webpage);

                // discount
                steamPriceInfo.discount_percent = getSteamDiscountPercent(webpage);

                // price
                steamPriceInfo.price = freePrice || finalPrice || "Coming Soon";

                return resolve(steamPriceInfo);
            })
            .catch((error: any): any => {
                return resolve(steamPriceInfo);
            });
        });

    };

    return new Promise((resolve: any, reject: any) => {
        const pricePromises: Promise<SteamAPIGetPriceInfoResponse>[] = [];

        steamgameids.forEach((steamgameid: number) => {
            pricePromises.push(createPricePromise(steamgameid));
        });

        Promise.all(pricePromises)
        .then((vals: SteamAPIGetPriceInfoResponse[]) => {
            const steamPrices: SteamAPIGetPriceInfoResponse[] = vals.filter((x: SteamAPIGetPriceInfoResponse) => { return x.price !== undefined; });
            return resolve(steamPrices);
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}