import * as WebRequest from "web-request";
import config from "./../config";
import { SteamAPIReview, SteamAPIGetPriceInfoResponse, SteamAPIGetReviewsResponse } from "../client/client-server-common/common";

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

    const date = new Date(timestamp);
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
 * Returns Steam price info from Steam id.
 */
export function steamAPIGetPriceInfo(steamgameids: number[]): Promise<SteamAPIGetPriceInfoResponse[]> {

    const createPricePromise = (steamgameid: number): Promise<SteamAPIGetPriceInfoResponse> => {

        return new Promise((resolve: any, reject: any) => {
            WebRequest.get(`${config.steam.apiURL}/appdetails?appids=${steamgameid}&cc=us`)
            .then((response: any) => {
                const formattedResponse: any = JSON.parse(response.message.body)[steamgameid];
                const steam_url: string = `${config.steam.appURL}/${steamgameid}`;
                const steamPriceInfo: SteamAPIGetPriceInfoResponse = {
                    steamgameid: undefined,
                    price: undefined,
                    discount_percent: undefined,
                    steam_url: undefined
                };

                if (formattedResponse.success) {
                    if (formattedResponse.data.is_free) {
                        steamPriceInfo.price = "Free";
                        steamPriceInfo.steam_url = steam_url;
                        steamPriceInfo.steamgameid = steamgameid;

                        return resolve(steamPriceInfo);
                    } else {
                        if (formattedResponse.data.price_overview) {
                            const price_unformatted: string = (formattedResponse.data.price_overview.final).toString();
                            const price: string = price_unformatted.slice(0, price_unformatted.length - 2) + `.` + price_unformatted.slice(price_unformatted.length - 2);
                            const discount_percent: number = formattedResponse.data.price_overview.discount_percent;
                            steamPriceInfo.steamgameid = steamgameid,
                            steamPriceInfo.price = price;
                            steamPriceInfo.discount_percent = discount_percent;
                            steamPriceInfo.steam_url = steam_url;

                            return resolve(steamPriceInfo);
                        }  else {

                            return resolve(steamPriceInfo);
                        }
                    }
                } else {
                    return resolve(steamPriceInfo);
                }
            })
            .catch((error: any): any => {
                return reject(error);
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

/**
 * Returns an array of X Steam reviews from given steam id.
 */
export function steamAPIGetReviews(id: number): Promise<SteamAPIGetReviewsResponse> {

    const steamAPIGetReviewsResponse: SteamAPIGetReviewsResponse = {};

    return new Promise((resolve: any, reject: any) => {

        WebRequest.get(`${config.steam.nonApiURL}/appreviews/${id}?json=1&filter=all&cc=us`)
        .then((response: any) => {
            const rawReviews: any = JSON.parse(response.message.body).reviews;
            if (rawReviews) {
                if (rawReviews.length > 0) {
                    steamAPIGetReviewsResponse.reviews = [];
                }
                rawReviews.forEach((rawReview: any) => {
                    const steamReview: SteamAPIReview = { hours_played: rawReview.author.playtime_forever, text: rawReview.review, up_votes: rawReview.votes_up };
                    steamAPIGetReviewsResponse.reviews.push(steamReview);
                });
            }

            return resolve(steamAPIGetReviewsResponse);
        })
        .catch((error: any): any => {
            console.log(`Error retrieving Steam price info: ${error}`);
            return reject(error);
        });

    });

}