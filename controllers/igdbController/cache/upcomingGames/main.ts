import config from "../../../../config";
import { formatDate, formatTimestamp, addMonths, ArrayClean } from "../../../../util/main";
import { UpcomingGameResponse, UpcomingGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function upcomingGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

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
 * Get redis-cached upcoming games.
 */
export function getCachedUpcomingGames(): Promise<UpcomingGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.lrange(cacheEntry.key, 0, -1, (error: string, stringifiedUpcomingGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse("[" + stringifiedUpcomingGames + "]"));
        });
    });

}


/**
 * Cache upcoming games.
 */
export function cacheUpcomingGames(): Promise<UpcomingGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];
    const currentDay = formatDate(new Date());
    const oneMonthAfterCurrentDay = formatDate(addMonths(new Date(), 1));

    return new Promise((resolve: any, reject: any) => {
        igdbClient.games({
            filters: {
                "release_dates.date-gt": currentDay,
                "release_dates.date-lt": oneMonthAfterCurrentDay
            },
            limit: config.igdb.pageLimit
        }, UpcomingGameResponseFields)
        .then( (response: any) => {
            const unsortedUpcomingGames: any[] = [];
            let sortedUpcomingGames: UpcomingGameResponse[];

            getAllGenrePairs()
            .then((genrePair: string[]) => {

                response.body.forEach((x: any) => {
                    const id: number = x.id;
                    const name: string = x.name;
                    let cover: string;
                    if (x.cover) {
                        cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
                    }

                    x.release_dates.forEach(function(ele: any, index: number, arr: any[]) {
                        const duplicate: any = arr.find((x: any) => { return new Date(x.date) < new Date(ele.date); });
                        if (duplicate) {
                            arr.splice(index, 1);
                        }
                    });

                    const sortedReleaseDates: any[] = x.release_dates
                        .filter((releaseDate: any) => new Date(releaseDate.date) > new Date())
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
                        unsortedUpcomingGames.push({
                            id: id,
                            name: name,
                            cover: cover,
                            next_release_date: sortedReleaseDates[0].date,
                            steam_url: steam_url,
                            genres: genres,
                            linkIcons: linkIcons
                        });
                    }

                });

                sortedUpcomingGames = unsortedUpcomingGames
                    .sort((a: any, b: any) => {
                        if (a.next_release_date < b.next_release_date) {
                            return -1;
                        }
                        if (a.next_release_date > b.next_release_date) {
                            return 1;
                        }
                        return 0;
                    })
                    .map((x: any) => {
                        return {
                            id: x.id,
                            name: x.name,
                            cover: x.cover,
                            next_release_date: formatTimestamp(x.next_release_date),
                            steam_url: x.steam_url,
                            genres: x.genres,
                            linkIcons: x.linkIcons
                        };
                    });

                sortedUpcomingGames.forEach((x: UpcomingGameResponse) => {
                    redisClient.rpush(cacheEntry.key, JSON.stringify(x));
                });
                if (cacheEntry.expiry !== -1) {
                    redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                }

                return resolve(sortedUpcomingGames);

            })
            .catch((error: string) => {
                return reject(error);
            });

        })
        .catch( (error: string) => {
            return reject(error);
        });
    });

}