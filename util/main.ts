import * as WebRequest from "web-request";
import config from "./../config";

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
 * Returns Steam price info from Steam id.
 */
export interface SteamAPIGetPriceInfoResponse {
    price: string;
    discount_percent: number;
    steam_url: string;
}
export function steamAPIGetPriceInfo(id: number): Promise<SteamAPIGetPriceInfoResponse> {

    return new Promise((resolve: any, reject: any) => {

        WebRequest.get(`${config.steam.apiURL}/appdetails?appids=${id}&cc=us`)
        .then((response: any) => {
            // console.log(`Steam Response: ${JSON.stringify(JSON.parse(response.message.body)[id])}`);

            if (!JSON.parse(response.message.body)[id].data.price_overview) {
                return resolve({ price: "Free"});
            } else {
                const price_unformatted: string = (JSON.parse(response.message.body)[id].data.price_overview.final).toString();
                const price: string = price_unformatted.slice(0, price_unformatted.length - 2) + `.` + price_unformatted.slice(price_unformatted.length - 2);
                const discount_percent: number = JSON.parse(response.message.body)[id].data.price_overview.discount_percent;
                const steam_url: string = `${config.steam.appURL}/${id}`;

                return resolve({ price: price, discount_percent: discount_percent, steam_url: steam_url });
            }
        })
        .catch((error: any): any => {
            console.log(`Error retrieving Steam price info: ${error}`);
            return reject(error);
        });

    });

}