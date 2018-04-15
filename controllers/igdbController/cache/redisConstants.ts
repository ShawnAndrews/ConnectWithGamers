const ONE_DAY: number = 60 * 60 * 24;
const ONE_WEEK: number = 60 * 60 * 24 * 7;

export interface IGDBCacheEntry {
    key: string;
    expiry: number; // seconds
}

export const redisCache: IGDBCacheEntry[] = [
    {key: "upcominggames", expiry: ONE_DAY},
    {key: "games", expiry: ONE_WEEK},
    {key: "searchgames", expiry: ONE_DAY},
    {key: "platformgames", expiry: ONE_DAY},
    {key: "recentgames", expiry: ONE_DAY},
    {key: "genregames", expiry: ONE_DAY},
    {key: "genrelist", expiry: ONE_WEEK},
];