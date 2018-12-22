import config from "../../../../../config";
import { PredefinedGamesType, ThumbnailGameResponse, RawThumbnailGameResponse, ThumbnailGameResponseFields, redisCache, IGDBCacheEntry, Genre, Platform, SteamAPIGetPriceInfoResponse, ExternalGame, IGDBExternalCategoryEnum } from "../../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { ArrayClean, steamAPIGetPriceInfo, IGDBImage } from "../../../../../util/main";
import { getAllGenrePairs } from "../../genreList/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function predefinedUpcomingGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[13];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, PredefinedGamesType.Upcoming, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

/**
 * Get redis-cached thumbnail games.
 */
export function getCachedPredefinedUpcomingGames(): Promise<ThumbnailGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[13];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, PredefinedGamesType.Upcoming, (error: string, stringifiedThumbnailGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedThumbnailGames));
        });
    });

}

/**
 * Cache thumbnail games.
 */

export function cachePredefinedUpcomingGames(): Promise<ThumbnailGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[13];
    const CURRENT_UNIX_TIME_MS: number = parseInt(new Date().getTime().toString().slice(0, -3));

    const URL: string = `${config.igdb.apiURL}/games`;
    let body: string = `fields ${ThumbnailGameResponseFields.join()}; limit ${config.igdb.pageLimit};`;
    body = body.concat(`where cover != null & popularity > 5 & first_release_date >= ${CURRENT_UNIX_TIME_MS};`);
    body = body.concat(`sort first_release_date asc;`);

    return new Promise((resolve: any, reject: any) => {

        const pricePromise = (rawResponse: RawThumbnailGameResponse[]): Promise<SteamAPIGetPriceInfoResponse[]> => {

            return new Promise((resolve: any, reject: any) => {
                const pricesResponse: SteamAPIGetPriceInfoResponse[] = [];
                const steamids: number[] = rawResponse
                    .filter((x: RawThumbnailGameResponse) => {
                        let hasSteamLink: boolean = false;

                        if (!x.external_games) {
                            return false;
                        }

                        x.external_games.forEach((y: ExternalGame) => {
                            if (y.category === IGDBExternalCategoryEnum.steam) {
                                hasSteamLink = true;
                            }
                        });
                        return hasSteamLink;
                    })
                    .map((x: RawThumbnailGameResponse) => {
                        let steamId: number;
                        x.external_games.forEach((y: ExternalGame) => {
                            if (y.category === IGDBExternalCategoryEnum.steam) {
                                steamId = parseInt(y.uid);
                            }
                        });
                        return steamId;
                    });

                steamAPIGetPriceInfo(steamids)
                .then( (steamAPIGetPriceInfoResponse: SteamAPIGetPriceInfoResponse[]) => {
                    rawResponse.forEach((x: RawThumbnailGameResponse) => {
                        const priceResponse: SteamAPIGetPriceInfoResponse = {
                            steamgameid: undefined,
                            price: undefined,
                            discount_percent: undefined,
                            steam_url: undefined
                        };

                        if (x.external_games) {
                            let steamId: number = undefined;
                            x.external_games.forEach((y: ExternalGame) => {
                                if (y.category === IGDBExternalCategoryEnum.steam) {
                                    steamId = parseInt(y.uid);
                                }
                            });

                            const foundIndex: number = steamAPIGetPriceInfoResponse.findIndex((priceInfo: SteamAPIGetPriceInfoResponse) => { return priceInfo.steamgameid === steamId; });
                            if (foundIndex !== -1) {
                                priceResponse.steamgameid = steamId;
                                priceResponse.price = steamAPIGetPriceInfoResponse[foundIndex].price;
                                priceResponse.discount_percent = steamAPIGetPriceInfoResponse[foundIndex].discount_percent;
                                priceResponse.steam_url = steamAPIGetPriceInfoResponse[foundIndex].steam_url;
                            }
                        }

                        pricesResponse.push(priceResponse);
                    });

                    return resolve(pricesResponse);
                })
                .catch ( (error: string) => {
                    return reject(error);
                });

            });
        };

        const mainPromise = (rawResponse: RawThumbnailGameResponse[]): Promise<ThumbnailGameResponse[]> => {

            return new Promise((resolve: any, reject: any) => {
                const gamesResponse: ThumbnailGameResponse[] = [];

                getAllGenrePairs()
                .then((genrePair: string[]) => {
                    rawResponse.forEach((x: RawThumbnailGameResponse) => {
                        const id: number = x.id;
                        const name: string = x.name;
                        const rating: number = x.rating;
                        let genres: string;
                        if (x.genres) {
                            genres = x.genres.map((genreid: number) => { return genrePair[genreid]; }).join(`, `);
                        }
                        let steam_url: string;
                        if (x.external_games) {
                            let steamId: number = undefined;
                            x.external_games.forEach((y: ExternalGame) => {
                                if (y.category === IGDBExternalCategoryEnum.steam) {
                                    steamId = parseInt(y.uid);
                                }
                            });
                            steam_url = `${config.steam.appURL}/${steamId}`;
                        }
                        let linkIcons: string[];
                        if (x.platforms) {
                            linkIcons = x.platforms
                            .map((platformid: number) => {
                                if (platformid === 48 || platformid === 45) {
                                    return "fab fa-playstation";
                                } else if (platformid === 34) {
                                    return "fab fa-android";
                                } else if (platformid === 6) {
                                    return "fab fa-windows";
                                } else if (platformid === 14) {
                                    return "fab fa-apple";
                                } else if (platformid === 3) {
                                    return "fab fa-linux";
                                } else if (platformid === 92) {
                                    return "fab fa-steam";
                                } else if (platformid === 49) {
                                    return "fab fa-xbox";
                                } else if (platformid === 130) {
                                    return "fab fa-nintendo-switch";
                                }
                            });
                            linkIcons = ArrayClean(linkIcons, undefined);
                        }
                        let cover: string;
                        if (x.cover) {
                            cover = IGDBImage(x.cover.image_id, "cover_big", "jpg");
                        }

                        const gameResponse: ThumbnailGameResponse = {
                            id: id,
                            name: name,
                            rating: rating,
                            genres: genres,
                            linkIcons: linkIcons,
                            steam_url: steam_url,
                            cover: cover
                        };

                        gamesResponse.push(gameResponse);
                    });

                    return resolve(gamesResponse);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            });
        };

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
            const rawResponse: RawThumbnailGameResponse[] = response.data;
            let gamesResponse: ThumbnailGameResponse[] = [];

            Promise.all([mainPromise(rawResponse), pricePromise(rawResponse)])
            .then((vals: any) => {

                if (vals[0]) {
                    gamesResponse = vals[0];
                }
                if (vals[1]) {
                    gamesResponse.forEach((x: ThumbnailGameResponse, index: number) => {
                        x.price = vals[1][index].price;
                        x.discount_percent = vals[1][index].discount_percent;
                    });
                }

                redisClient.hset(cacheEntry.key, PredefinedGamesType.Upcoming, JSON.stringify(gamesResponse));
                if (cacheEntry.expiry !== -1) {
                    redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                }

                return resolve(gamesResponse);
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