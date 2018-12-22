import config from "../../../../config";
import { formatTimestamp, steamAPIGetReviews, steamAPIGetPriceInfo, IGDBImage } from "../../../../util/main";
import {
    GameResponse, GameResponseFields, RawGameResponse,
    SteamAPIGetPriceInfoResponse, SteamAPIGetReviewsResponse, redisCache, IGDBCacheEntry, ExternalGame, IGDBExternalCategoryEnum } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
import axios, { AxiosResponse } from "axios";
const redis = require("redis");
const redisClient = redis.createClient();

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

        const URL: string = `${config.igdb.apiURL}/games`;
        let body: string = `fields ${GameResponseFields.join()}; limit ${config.igdb.pageLimit};`;
        body = body.concat(`where id = ${gameId};`);

        axios({
            method: "post",
            url: URL,
            headers: {
                "user-key": config.igdb.key,
                "Accept": "application/json"
            },
            data: body
        })
        .then( (response: AxiosResponse) => {
            const rawResponse: RawGameResponse = response.data[0];

            getAllGenrePairs()
            .then((genrePair: string[]) => {

                game.name = rawResponse.name;
                game.rating = rawResponse.total_rating;
                game.rating_count = rawResponse.total_rating_count;
                if (rawResponse.cover) {
                    game.cover = IGDBImage(rawResponse.cover.image_id, "cover_big", "jpg");
                }
                game.summary = rawResponse.summary;
                if (rawResponse.screenshots) {
                    game.screenshots = rawResponse.screenshots.map((x: any) => {
                        return IGDBImage(x.image_id, "screenshot_huge", "jpg");
                    });
                }
                if (rawResponse.videos) {
                    rawResponse.videos.forEach((videoInfo: any) => {
                        if (videoInfo.name === `Trailer`) {
                            const videoName: string = videoInfo.name;
                            const videoLink: string = `https://www.youtube.com/embed/${videoInfo.video_id}`;
                            game.video = { name: videoName, youtube_link: videoLink };
                        }
                    });
                }
                game.genre_ids = rawResponse.genres;
                if (rawResponse.genres) {
                    game.genres = rawResponse.genres.map((genreId: number) => { return genrePair[genreId]; });
                }

                const platformsPromise: Promise<any> = new Promise((resolve: any, reject: any) => {

                    if (rawResponse.platforms) {
                        const platformIds: number[] = rawResponse.platforms;

                        const URL: string = `${config.igdb.apiURL}/platforms`;
                        let body: string = `fields name; limit ${config.igdb.pageLimit};`;
                        body = body.concat(`where id = (${platformIds.join()});`);
                        body = body.concat(`sort updated_at desc;`);

                        axios({
                            method: "post",
                            url: URL,
                            headers: {
                                "user-key": config.igdb.key,
                                "Accept": "application/json"
                            },
                            data: body
                        })
                        .then( (response: AxiosResponse) => {
                            const platformAndReleaseDates: any[] = response.data;
                            const platformsNames: string[] = [];
                            const platformsReleaseDates: string[] = [];
                            const orderedPlatformIds: number[] = [];

                            platformAndReleaseDates.forEach((x: any) => {
                                const platformId: number = x.id;
                                const indexOfReleaseDateMatch: number = rawResponse.release_dates.findIndex((e: any) => { return e.platform === platformId; });
                                if (indexOfReleaseDateMatch !== -1) {
                                    x.release_date = rawResponse.release_dates[indexOfReleaseDateMatch].date;
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
                                response.data.forEach((platformPair: any) => {
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

                    if (rawResponse.external_games) {
                        let steamId: number = undefined;
                        rawResponse.external_games.forEach((y: ExternalGame) => {
                            if (y.category === IGDBExternalCategoryEnum.steam) {
                                steamId = parseInt(y.uid);
                            }
                        });

                        if (!steamId) {
                            return resolve();
                        }

                        steamAPIGetPriceInfo([steamId])
                            .then( (steamAPIGetPriceInfoResponse: SteamAPIGetPriceInfoResponse[]) => {
                                return resolve(steamAPIGetPriceInfoResponse[0]);
                            })
                            .catch ( (error: string) => {
                                return reject(error);
                            });
                    } else {
                        return resolve();
                    }
                });

                Promise.all([platformsPromise, pricePromise])
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

        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}