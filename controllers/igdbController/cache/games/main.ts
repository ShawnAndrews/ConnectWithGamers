import config from "../../../../config";
import { formatTimestamp, steamAPIGetReviews, steamAPIGetPriceInfo } from "../../../../util/main";
import {
    GameResponse, GameResponseFields,
    SteamAPIGetPriceInfoResponse, SteamAPIGetReviewsResponse, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
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

/**
 * Get redis-cached games.
 */
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

/**
 * Cache game.
 */
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