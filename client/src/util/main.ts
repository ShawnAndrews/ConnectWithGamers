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
 * Convert Unix Timestamp -> X mins ago / X hrs ago / X days ago.
 */
export function formatDate(date: number, dateBeforeCurrent): string {
    const CURRENT_UNIX_TIME_MS: number = parseInt(new Date().getTime().toString().slice(0, -3));
    const TARGET_UNIX_TIME_MS: number = new Date(date).getTime();
    let difference: number = dateBeforeCurrent ? CURRENT_UNIX_TIME_MS - TARGET_UNIX_TIME_MS : TARGET_UNIX_TIME_MS - CURRENT_UNIX_TIME_MS;
    let hoursDifference: number = Math.floor(difference / 60 / 60);
    const textWrap = (num: number, unit: string): string => { return dateBeforeCurrent ? `${num} ${unit} ago` : `in ${num} ${unit}`}

    if (hoursDifference < 1) {
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