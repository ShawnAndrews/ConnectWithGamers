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