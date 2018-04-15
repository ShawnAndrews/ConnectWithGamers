/**
 * Convert Date->MM-DD-YYYY/Today at/Yesterday at/<day_of_week> at.
 */
export function getFormattedDate(dateObj: any) {
    const date = new Date(dateObj);
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
        return `${date.toLocaleString(window.navigator.language, {weekday: "long"})} at`;
    } else {
        return date.toLocaleDateString();
    }
}