import config from "../../../../config";
import {
    ThumbnailGameResponse, ThumbnailGameResponseFields,
    redisCache, IGDBCacheEntry, RawThumbnailGameResponse, Platform, SteamAPIGetPriceInfoResponse, ExternalGame, IGDBExternalCategoryEnum } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
import axios, { AxiosResponse } from "axios";
import { ArrayClean, steamAPIGetPriceInfo, IGDBImage } from "../../../../util/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function resultsGamesKeyExists(queryString: string): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[14];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, queryString, (error: string, value: boolean) => {
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
export function getCachedResultsGames(queryString: string): Promise<ThumbnailGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[14];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, queryString, (error: string, stringifiedGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedGames));
        });
    });

}

/**
 * Cache results game.
 */
export function cacheResultsGames(queryString: string): Promise<ThumbnailGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[14];
    const queryStringObj: any = JSON.parse(queryString);

    const URL: string = `${config.igdb.apiURL}/games`;
    let body: string = `fields ${ThumbnailGameResponseFields.join()}; limit ${config.igdb.pageLimit};`;
    const whereFilters: string[] = [];

    Object.keys(queryStringObj).forEach((key: string) => {

        if (key === "query") {
            const query: string = queryStringObj[key];

            body = body.concat(`search "${query}";`);
        }

        if (key === "genres") {
            const genres: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`genres = (${genres.join()});`);
        }

        if (key === "platforms") {
            const platforms: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`platforms = (${platforms.join()});`);
        }

        if (key === "categories") {
            const categories: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`category = ${categories.join()};`);
        }

        if (key === "popularity") {
            const popularity: number = parseInt(queryStringObj[key]);

            whereFilters.push(`aggregated_rating >= ${popularity};`);
        }

    });

    if (whereFilters.length > 0) {
        body = body.concat(`where ${whereFilters.join(" & ")};`);
    }

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

                            if (steamId) {
                                const foundIndex: number = steamAPIGetPriceInfoResponse.findIndex((priceInfo: SteamAPIGetPriceInfoResponse) => { return priceInfo.steamgameid === steamId; });
                                if (foundIndex !== -1) {
                                    priceResponse.steamgameid = steamId;
                                    priceResponse.price = steamAPIGetPriceInfoResponse[foundIndex].price;
                                    priceResponse.discount_percent = steamAPIGetPriceInfoResponse[foundIndex].discount_percent;
                                    priceResponse.steam_url = steamAPIGetPriceInfoResponse[foundIndex].steam_url;
                                }
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
                            x.external_games.forEach((y: ExternalGame) => {
                                if (y.category === IGDBExternalCategoryEnum.steam) {
                                    const steamId = parseInt(y.uid);
                                    steam_url = `${config.steam.appURL}/${steamId}`;
                                }
                            });
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

                redisClient.hset(cacheEntry.key, queryString, JSON.stringify(gamesResponse));
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