const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
import config from "../../config";
import { formatDate, formatTimestamp, addMonths, SteamAPIGetPriceInfoResponse, steamAPIGetPriceInfo } from "../../util/main";
import {
    GameListEntryResponse, GameListEntryResponseFields,
    GameResponse, GameResponseFields,
    UpcomingGameResponse, UpcomingGameResponseFields,
    RecentGameResponse, RecentGameResponseFields,
    PlatformGameResponse, PlatformGameResponseFields } from "../../client/client-server-common/common";

const igdbClient = igdb(config.igdb.key);

const ONE_DAY: number = 60 * 60 * 24;
const ONE_WEEK: number = 60 * 60 * 24 * 7;
const INFINITE: number = -1;

interface IGDBCacheEntry {
    key: string;
    expiry: number; // seconds
}

export const redisCache: IGDBCacheEntry[] = [
    {key: "upcominggames", expiry: ONE_DAY},
    {key: "games", expiry: ONE_WEEK},
    {key: "searchgames", expiry: ONE_DAY},
    {key: "platformgames", expiry: ONE_DAY},
    {key: "recentgames", expiry: ONE_DAY},
];

// register redis error handler
redisClient.on("error", function (err: any) {
    console.log("Error " + err);
});

/**
 *  UPCOMING GAMES
 */
export function upcomingGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.exists(cacheEntry.key, (err: any, value: boolean) => {
            console.log(`err: ${err}`);
            console.log(`value: ${JSON.stringify(value)}`);
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedUpcomingGames(): Promise<UpcomingGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.lrange(cacheEntry.key, 0, -1, (err: any, stringifiedUpcomingGames: string) => {
            console.log(`err: ${err}`);
            console.log(`value: ${stringifiedUpcomingGames}`);
            if (err) {
                return reject(err);
            }
            return resolve(JSON.parse("[" + stringifiedUpcomingGames + "]"));
        });
    });

}

export function cacheUpcomingGames(): Promise<UpcomingGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];
    const date = new Date();
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

                console.log(`#${id} sorted dates: ${JSON.stringify(sortedReleaseDates)}`);

                if (sortedReleaseDates.length > 0) {
                    unsortedUpcomingGames.push({
                        id: id,
                        name: name,
                        cover: cover,
                        next_release_date: sortedReleaseDates[0].date
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
                        next_release_date: formatTimestamp(x.next_release_date)
                    };
                });

            sortedUpcomingGames.forEach((x: UpcomingGameResponse) => {
                console.log(`Caching upcoming game id #${x.id}`);
                redisClient.rpush(cacheEntry.key, JSON.stringify(x));
            });
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            return resolve(sortedUpcomingGames);
        })
        .catch( (error: any) => {
            return reject(error);
        });
    });

}

/**
 *  RECENTLY RELEASED GAMES
 */
export function recentGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.exists(cacheEntry.key, (err: any, value: boolean) => {
            console.log(`err: ${err}`);
            console.log(`value: ${JSON.stringify(value)}`);
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedRecentGames(): Promise<RecentGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.lrange(cacheEntry.key, 0, -1, (err: any, stringifiedRecentGames: string) => {
            console.log(`err: ${err}`);
            console.log(`value: ${stringifiedRecentGames}`);
            if (err) {
                return reject(err);
            }
            return resolve(JSON.parse("[" + stringifiedRecentGames + "]"));
        });
    });

}

export function cacheRecentGames(): Promise<RecentGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];
    const date = new Date();
    const oneMonthBeforeCurrentDay = formatDate(addMonths(new Date(), -1));
    const currentDay = formatDate(new Date());
    console.log(`gt: ${oneMonthBeforeCurrentDay}`);
    console.log(`lt: ${currentDay}`);
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

            response.body.forEach((x: any) => {
                const id: number = x.id;
                const name: string = x.name;
                let cover: string;
                if (x.cover) {
                    cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
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
                        last_release_date: sortedReleaseDates[sortedReleaseDates.length - 1].date
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
                        last_release_date: formatTimestamp(x.last_release_date)
                    };
                });

            sortedRecentGames.forEach((x: RecentGameResponse) => {
                console.log(`Caching recent game id #${x.id}`);
                redisClient.rpush(cacheEntry.key, JSON.stringify(x));
            });
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            return resolve(sortedRecentGames);
        })
        .catch( (error: any) => {
            return reject(error);
        });
    });

}

/**
 *  PLATFORM GAMES
 */
export function platformGamesKeyExists(platformId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, platformId, (err: any, value: boolean) => {
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedPlatformGames(platformId: number): Promise<PlatformGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, platformId, (err: any, stringifiedUpcomingGames: string) => {
            console.log(`err: ${err}`);
            console.log(`value: ${stringifiedUpcomingGames}`);
            if (err) {
                return reject(err);
            }
            return resolve(JSON.parse(stringifiedUpcomingGames));
        });
    });

}

export function cachePlatformGames(platformId: number): Promise<PlatformGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        igdbClient.games({
            filters: {
                "release_dates.platform-eq": platformId,
            },
            order: "rating_count:desc",
            limit: config.igdb.pageLimit
        }, PlatformGameResponseFields )
        .then( (response: any) => {

            response.body.forEach((x: any) => {
                if (x.cover) {
                    x.cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
                }
            });

            redisClient.hset(cacheEntry.key, platformId, JSON.stringify(response.body));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            console.log(`Platform games: ${JSON.stringify(response.body)}`);

            return resolve(response.body);
        });

    });

}

/**
 *  GAMES
 */
export function gameKeyExists(gameId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, gameId, (err: any, value: boolean) => {
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedGame(gameId: number): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, gameId, (err: any, stringifiedGame: string) => {
            if (err) {
                return reject(err);
            }
            console.log(`GETTING CACHED GAME #${gameId}`);
            return resolve(JSON.parse(stringifiedGame));
        });
    });

}

export function cacheGame(gameId: number): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    const game: GameResponse = { name: "" };

    return new Promise((resolve: any, reject: any) => {
        igdbClient.games({
            ids: [gameId]
        }, GameResponseFields)
        .then( (response: any) => {
            game.name = response.body[0].name;
            game.rating = response.body[0].total_rating;
            game.rating_count = response.body[0].total_rating_count;
            if (response.body[0].cover) {
                game.cover = igdbClient.image(
                    { cloudinary_id: response.body[0].cover.cloudinary_id },
                    "cover_big", "jpg");
            }
            game.summary = response.body[0].summary;
            if (response.body[0].screenshots) {
                game.screenshots = response.body[0].screenshots.map((x: any) => {
                    return igdbClient.image(
                        { cloudinary_id: x.cloudinary_id },
                        "screenshot_huge", "jpg");
                });
            }

            const genresPromise: Promise<string[]> = new Promise((resolve: any, reject: any) => {

                if (response.body[0].genres) {
                    const genreIds: number[] = response.body[0].genres;

                    igdbClient.genres({
                        ids: genreIds
                    }, ["name"])
                    .then( (genreResponse: any) => {
                        const genreNames: string[] = genreResponse.body.map( (x: any) => { return x.name; });
                        resolve(genreNames);
                    })
                    .catch ( (error: any) => {
                        reject(error);
                    });
                } else {
                    resolve([]);
                }
            });

            const platformsPromise: Promise<any> = new Promise((resolve: any, reject: any) => {

                if (response.body[0].platforms) {
                    const platformIds: number[] = response.body[0].platforms;

                    igdbClient.platforms({
                        ids: platformIds
                    }, ["name"])
                    .then( (platformResponse: any) => {
                        const platformAndReleaseDates: any[] = platformResponse.body;
                        const platformsNames: string[] = [];
                        const platformsReleaseDates: string[] = [];

                        platformAndReleaseDates.forEach((x: any) => {
                            const platformId: number = x.id;
                            const indexOfReleaseDateMatch: number = response.body[0].release_dates.findIndex((e: any) => { return e.platform === platformId; });
                            if (indexOfReleaseDateMatch !== -1) {
                                x.release_date = response.body[0].release_dates[indexOfReleaseDateMatch].date;
                            }
                        });

                        platformAndReleaseDates
                        .sort((a: any, b: any) => {
                            if (a.release_date < b.release_date) {
                                return -1;
                            }
                            if (a.release_date > b.release_date) {
                                return 1;
                            }
                            return 0;
                        });

                        if (platformAndReleaseDates.length > 0) {
                            const sortedReleaseDatesAfterToday: number[] = platformAndReleaseDates
                            .filter((x: any) => new Date(x.release_date) > new Date())
                            .map((x: any) => { return x.release_date; });
                            if (sortedReleaseDatesAfterToday.length > 0) {
                                const earliestUpcomingPlatformReleaseDate: number = sortedReleaseDatesAfterToday[0];
                                const readableDateFormat: string = formatTimestamp(earliestUpcomingPlatformReleaseDate);
                                game.next_release_date = readableDateFormat;
                            }
                        }

                        platformAndReleaseDates.forEach((platform: any, index: number) => {
                            platformsNames.push(platform.name);
                            platformsReleaseDates.push(formatTimestamp(platform.release_date));
                        });

                        resolve({platforms: platformsNames, platforms_release_dates: platformsReleaseDates});
                    })
                    . catch ( (error: any) => {
                        reject(error);
                    });
                } else {
                    resolve([]);
                }
            });

            const pricePromise: Promise<SteamAPIGetPriceInfoResponse> = new Promise((resolve: any, reject: any) => {
                if (response.body[0].external) {
                    const steamId: number = response.body[0].external.steam;
                    steamAPIGetPriceInfo(steamId)
                        .then( (steamAPIGetPriceInfoResponse: SteamAPIGetPriceInfoResponse) => {
                            return resolve(steamAPIGetPriceInfoResponse);
                        })
                        . catch ( (error: any) => {
                            return reject(error);
                        });
                } else {
                    return resolve();
                }
            });

            Promise.all([genresPromise, platformsPromise, pricePromise])
            .then((vals: any) => {
                if (vals[0].length > 0) {
                    game.genres = vals[0];
                }
                if (vals[1]) {
                    game.platforms = vals[1].platforms;
                    game.platforms_release_dates = vals[1].platforms_release_dates;
                }
                if (vals[2]) {
                    game.price = vals[2].price;
                    game.discount_percent = vals[2].discount_percent;
                    game.steam_url = vals[2].steam_url;
                }

                redisClient.hset(cacheEntry.key, gameId, JSON.stringify(game));
                if (cacheEntry.expiry !== -1) {
                    redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                }

                console.log(`CACHEING GAME #${gameId}`);
                return resolve(game);
            })
            .catch((error: any) => {
                throw(error);
            });

        });

    });

}

/**
 *  SEARCH GAMES
 */
export function searchGamesKeyExists(query: string): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, query, (err: any, value: boolean) => {
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedSearchGames(query: string): Promise<GameListEntryResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, query, (err: any, stringifiedGameIds: string) => {
            if (err) {
                return reject(err);
            }
            console.log(`GETTING CACHED GAMESLIST.`);
            return resolve(JSON.parse(stringifiedGameIds));
        });
    });

}

export function cacheSearchGames(query: string): Promise<GameListEntryResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {

        igdbClient.games({
            limit: config.igdb.pageLimit,
            order: "release_dates.date:desc",
            search: query
        }, GameListEntryResponseFields)
        .then((result: any) => {
            console.log(`Recieved games list response.`);
            const games: GameListEntryResponse[] = result.body;
            redisClient.hset(cacheEntry.key, query, JSON.stringify(games));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }
            resolve(games);
        })
        .catch((error: any) => {
            console.log(`Error: ${error}`);
            return reject(error);
        });

    });

}