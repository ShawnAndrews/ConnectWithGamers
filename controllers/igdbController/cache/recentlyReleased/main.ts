import config from "../../../../config";
import { formatDate, addMonths, formatTimestamp, ArrayClean } from "../../../../util/main";
import { RecentGameResponse, RecentGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
const redis = require("redis");
let redisClient: any;
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

if (!config.disableListening) {
    redisClient = redis.createClient();
}

/**
 * Check if redis key exists.
 */
export function recentGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.exists(cacheEntry.key, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

/**
 * Get redis-cached recent games.
 */
export function getCachedRecentGames(): Promise<RecentGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.lrange(cacheEntry.key, 0, -1, (error: string, stringifiedRecentGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse("[" + stringifiedRecentGames + "]"));
        });
    });

}

/**
 * Cache recent games.
 */

export function cacheRecentGames(): Promise<RecentGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];
    const oneMonthBeforeCurrentDay = formatDate(addMonths(new Date(), -1));
    const currentDay = formatDate(new Date());

    return new Promise((resolve: any, reject: any) => {
        igdbClient.games({
            filters: {
                "release_dates.date-gt": oneMonthBeforeCurrentDay,
                "release_dates.date-lt": currentDay
            },
            limit: config.igdb.pageLimit
        }, RecentGameResponseFields)
        .then( (response: any) => {
            const unsortedRecentGames: any[] = [];
            let sortedRecentGames: RecentGameResponse[];

            getAllGenrePairs()
            .then((genrePair: string[]) => {
                response.body.forEach((x: any) => {
                    const id: number = x.id;
                    const name: string = x.name;
                    let cover: string;
                    if (x.cover) {
                        cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
                    }
                    let genres: string;
                    if (x.genres) {
                        genres = x.genres.map((genreId: number) => { return genrePair[genreId]; }).join(`, `);
                    }
                    let steam_url: string;
                    if (x.external) {
                        const steamId: number = x.external.steam;
                        steam_url = `${config.steam.appURL}/${steamId}`;
                    }
                    let linkIcons: string[];
                    if (x.platforms) {
                        linkIcons = x.platforms
                        .map((platformId: number) => {
                            if (platformId === 48 || platformId === 45) {
                                return "fab fa-playstation";
                            } else if (platformId === 34) {
                                return "fab fa-android";
                            } else if (platformId === 6) {
                                return "fab fa-windows";
                            } else if (platformId === 14) {
                                return "fab fa-apple";
                            } else if (platformId === 3) {
                                return "fab fa-linux";
                            } else if (platformId === 92) {
                                return "fab fa-steam";
                            } else if (platformId === 49) {
                                return "fab fa-xbox";
                            } else if (platformId === 130) {
                                return "fab fa-nintendo-switch";
                            }
                        });
                        linkIcons = ArrayClean(linkIcons, undefined);
                    }
                    const sortedReleaseDates: any[] = x.release_dates
                        .sort((a: any, b: any) => {
                            if (a.date < b.date) {
                                return -1;
                            }
                            if (a.date > b.date) {
                                return 1;
                            }
                            return 0;
                        })
                        .map((releaseDate: any) => { return releaseDate; });

                    if (sortedReleaseDates.length > 0) {
                        unsortedRecentGames.push({
                            id: id,
                            name: name,
                            cover: cover,
                            last_release_date: sortedReleaseDates[sortedReleaseDates.length - 1].date,
                            steam_url: steam_url,
                            genres: genres,
                            linkIcons: linkIcons
                        });
                    }

                });

                sortedRecentGames = unsortedRecentGames
                    .sort((a: any, b: any) => {
                        if (a.last_release_date < b.last_release_date) {
                            return -1;
                        }
                        if (a.last_release_date > b.last_release_date) {
                            return 1;
                        }
                        return 0;
                    })
                    .map((x: any) => {
                        return {
                            id: x.id,
                            name: x.name,
                            cover: x.cover,
                            last_release_date: formatTimestamp(x.last_release_date),
                            steam_url: x.steam_url,
                            genres: x.genres,
                            linkIcons: x.linkIcons
                        };
                    });

                sortedRecentGames.forEach((x: RecentGameResponse) => {
                    redisClient.rpush(cacheEntry.key, JSON.stringify(x));
                });
                if (cacheEntry.expiry !== -1) {
                    redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                }

                return resolve(sortedRecentGames);
            })
            .catch((error: string) => {
                return reject(error);
            });

        })
        .catch( (error: any) => {
            return reject(error);
        });
    });

}