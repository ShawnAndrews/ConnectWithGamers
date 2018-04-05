const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
import config from "../../config";
import { formatDate, formatTimestamp, addMonths, SteamAPIGetPriceInfoResponse, steamAPIGetPriceInfo, SteamAPIGetReviewsResponse, steamAPIGetReviews, ArrayClean } from "../../util/main";
import {
    GameListEntryResponse, GameListEntryResponseFields,
    GameResponse, GameResponseFields,
    UpcomingGameResponse, UpcomingGameResponseFields,
    RecentGameResponse, RecentGameResponseFields,
    DbPlatformGamesResponse, PlatformGameResponseFields,
    GenrePair,
    DbGenreGamesResponse, GenreGameResponseFields } from "../../client/client-server-common/common";

const igdbClient = igdb(config.igdb.key);

const ONE_DAY: number = 60 * 60 * 24;
const ONE_WEEK: number = 60 * 60 * 24 * 7;

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
    {key: "genregames", expiry: ONE_DAY},
    {key: "genrelist", expiry: ONE_WEEK},
];

const getAllGenrePairs = (): Promise<string[]> => {

    return new Promise((resolve: any, reject: any) => {
        genreListKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                getCachedGenreList()
                .then((genreList: GenrePair[]) => {
                    const genrePairs: string[] = [];
                    genreList.forEach((pair: GenrePair) => {
                        genrePairs[pair.id] = pair.name;
                    });
                    return resolve(genrePairs);
                })
                .catch((error: string) => {
                    return reject(error);
                });
            } else {
                cacheGenreList()
                .then((genreList: GenrePair[]) => {
                    const genrePairs: string[] = [];
                    genreList.forEach((pair: GenrePair) => {
                        genrePairs[pair.id] = pair.name;
                    });
                    return resolve(genrePairs);
                })
                .catch((error: string) => {
                    return reject(error);
                });
            }
        })
        .catch((error: string) => {
            return reject(error);
        });
    });
};

/**
 *  UPCOMING GAMES
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

/**
 *  RECENTLY RELEASED GAMES
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

/**
 *  PLATFORM GAMES
 */
export function platformGamesKeyExists(platformId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, platformId, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

export function getCachedPlatformGames(platformId: number): Promise<DbPlatformGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, platformId, (error: string, stringifiedPlatformGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedPlatformGames));
        });
    });

}

export function cachePlatformGames(platformId: number): Promise<DbPlatformGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        igdbClient.platforms({
            ids: [platformId]
        }, ["name"])
        .then( (platformNameResponse: any) => {
            const MAX_IGDB_PLATFORMS: number = 200;
            const platformName: string = platformNameResponse.body[0].name;
            const excludedPlatformIds: number[] = [];

            for (let i = 0; i < MAX_IGDB_PLATFORMS; i++) {
                if (i !== platformId) {
                    excludedPlatformIds.push(i);
                }
            }

            igdbClient.games({
                filters: {
                    "platforms-in": platformId,
                    "platforms-not_in": excludedPlatformIds
                },
                order: "rating:desc",
                limit: config.igdb.pageLimit
            }, PlatformGameResponseFields )
            .then( (response: any) => {

                getAllGenrePairs()
                .then((genrePair: string[]) => {
                    response.body.forEach((x: any) => {
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
                        let cover: string;
                        if (x.cover) {
                            cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
                        }
                        x.cover = cover;
                        x.genres = genres;
                        x.steam_url = steam_url;
                        x.linkIcons = linkIcons;
                    });

                    const dbPlatformGamesResponse: DbPlatformGamesResponse = { platformName: platformName, platformGames: response.body };
                    redisClient.hset(cacheEntry.key, platformId, JSON.stringify(dbPlatformGamesResponse));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }
                    return resolve(dbPlatformGamesResponse);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            })
            .catch ( (error: string) => {
                return reject(`Error retrieving games from IGDB. ${error}`);
            });
        })
        .catch ( () => {
            return reject("Platform does not exist.");
        });

    });

}

/**
 *  GENRE GAMES
 */
export function genreGamesKeyExists(genreId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, genreId, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

export function getCachedGenreGames(genreId: number): Promise<DbGenreGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];
    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, genreId, (error: string, stringifiedGenreGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedGenreGames));
        });
    });

}

export function cacheGenreGames(genreId: number): Promise<DbGenreGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];
    return new Promise((resolve: any, reject: any) => {
        igdbClient.genres({
            ids: [genreId]
        }, ["name"])
        .then( (genreNameResponse: any) => {

            const genreName: string = genreNameResponse.body[0].name;
            igdbClient.games({
                filters: {
                    "genres-eq": genreId,
                },
                order: "release_dates.date:desc",
                limit: config.igdb.pageLimit
            }, GenreGameResponseFields )
            .then( (response: any) => {

                getAllGenrePairs()
                .then((genrePair: string[]) => {
                    response.body.forEach((x: any) => {
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
                        let cover: string;
                        if (x.cover) {
                            cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
                        }
                        x.cover = cover;
                        x.genres = genres;
                        x.steam_url = steam_url;
                        x.linkIcons = linkIcons;
                    });

                    const dbGenreGamesResponse: DbGenreGamesResponse = { genreName: genreName, genreGames: response.body };
                    redisClient.hset(cacheEntry.key, genreId, JSON.stringify(dbGenreGamesResponse));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }
                    return resolve(dbGenreGamesResponse);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            })
            .catch( (error: string) => {
                return reject(`Error retrieving genre games from IGDB. ${error}`);
            });
        })
        .catch ( () => {
            return reject("Genre does not exist.");
        });

    });

}

/**
 *  GAMES
 */
export function gameKeyExists(gameId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, gameId, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

export function getCachedGame(gameId: number): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, gameId, (error: string, stringifiedGame: string) => {
            if (error) {
                return reject(error);
            }
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

            getAllGenrePairs()
            .then((genrePair: string[]) => {

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
                if (response.body[0].videos) {
                    response.body[0].videos.forEach((videoInfo: any) => {
                        if (videoInfo.name === `Trailer`) {
                            const videoName: string = videoInfo.name;
                            const videoLink: string = `https://www.youtube.com/embed/${videoInfo.video_id}`;
                            game.video = { name: videoName, youtube_link: videoLink };
                        }
                    });
                }
                game.genre_ids = response.body[0].genres;
                if (response.body[0].genres) {
                    game.genres = response.body[0].genres.map((genreId: number) => { return genrePair[genreId]; });
                }

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
                            const orderedPlatformIds: number[] = [];

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
                                platformResponse.body.forEach((platformPair: any) => {
                                    if (platformPair.name === platform.name) {
                                        orderedPlatformIds.push(platformPair.id);
                                    }
                                });
                                platformsReleaseDates.push(formatTimestamp(platform.release_date));
                            });

                            resolve({platformIds: orderedPlatformIds, platforms: platformsNames, platforms_release_dates: platformsReleaseDates});
                        })
                        .catch ( (error: string) => {
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
                            .catch ( (error: string) => {
                                return reject(error);
                            });
                    } else {
                        return resolve();
                    }
                });

                const reviewsPromise: Promise<SteamAPIGetReviewsResponse> = new Promise((resolve: any, reject: any) => {
                    if (response.body[0].external) {
                        const steamId: number = response.body[0].external.steam;
                        steamAPIGetReviews(steamId)
                            .then( (steamAPIGetReviewsResponse: SteamAPIGetReviewsResponse) => {
                                return resolve(steamAPIGetReviewsResponse);
                            })
                            .catch ( (error: string) => {
                                return reject(error);
                            });
                    } else {
                        return resolve();
                    }
                });

                Promise.all([platformsPromise, pricePromise, reviewsPromise])
                .then((vals: any) => {
                    if (vals[0]) {
                        game.platform_ids = vals[0].platformIds;
                        game.platforms = vals[0].platforms;
                        game.platforms_release_dates = vals[0].platforms_release_dates;
                    }
                    if (vals[1]) {
                        game.price = vals[1].price;
                        game.discount_percent = vals[1].discount_percent;
                        game.steam_url = vals[1].steam_url;
                    }
                    if (vals[2]) {
                        game.reviews = vals[2].reviews;
                    }

                    redisClient.hset(cacheEntry.key, gameId, JSON.stringify(game));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }

                    return resolve(game);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            })
            .catch((error: string) => {
                return reject(error);
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
        redisClient.hexists(cacheEntry.key, query, (err: string, value: boolean) => {
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
        redisClient.hget(cacheEntry.key, query, (error: string, stringifiedGameIds: string) => {
            if (error) {
                return reject(error);
            }
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
            search: query,
        }, GameListEntryResponseFields)
        .then((result: any) => {
            const games: GameListEntryResponse[] = result.body;
            redisClient.hset(cacheEntry.key, query, JSON.stringify(games));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }
            resolve(games);
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}

/**
 *  GENRE LIST
 */
export function genreListKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[6];

    return new Promise((resolve: any, reject: any) => {
        redisClient.exists(cacheEntry.key, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

export function getCachedGenreList(): Promise<GenrePair[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[6];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedGenreList: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedGenreList));
        });
    });

}

export function cacheGenreList(): Promise<GenrePair[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[6];

    return new Promise((resolve: any, reject: any) => {
        igdbClient.genres({
            limit: config.igdb.pageLimit
        }, ["name"])
        .then( (response: any) => {
            const genreList: GenrePair[] = response.body;

            redisClient.set(cacheEntry.key, JSON.stringify(genreList));

            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            return resolve(genreList);
        })
        .catch( (error: any) => {
            return reject(error);
        });
    });

}