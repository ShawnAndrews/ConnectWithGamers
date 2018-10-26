import config from "../../../../config";
import {
    ThumbnailGameResponse, ThumbnailGameResponseFields,
    redisCache, IGDBCacheEntry, RawThumbnailGameResponse, Platform, SteamAPIGetPriceInfoResponse } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
import axios from "axios";
import { ArrayClean, steamAPIGetPriceInfo } from "../../../../util/main";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

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
    let URL: string = `https://api-endpoint.igdb.com/games/?fields=${ThumbnailGameResponseFields.join()}`;

    Object.keys(queryStringObj).forEach((key: string) => {

        if (key === "query") {
            const query: string = queryStringObj[key];

            URL = URL.concat(`&search=${query}`);
        }

        if (key === "genres") {
            const genres: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            genres.forEach((genreid: number) => {
                URL = URL.concat(`&filter[genres][eq]=${genreid}`);
            });
        }

        if (key === "platforms") {
            const platforms: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            platforms.forEach((platformid: number) => {
                URL = URL.concat(`&filter[platforms][eq]=${platformid}`);
            });
        }

        if (key === "categories") {
            const categories: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            categories.forEach((categoryid: number) => {
                URL = URL.concat(`&filter[category][eq]=${categoryid}`);
            });
        }

        if (key === "popularity") {
            const popularity: number = parseInt(queryStringObj[key]);

            URL = URL.concat(`&filter[aggregated_rating][gte]=${popularity}`);
        }

        if (key === "sort") {
            const sortName: string = queryStringObj[key].split("-")[0];
            const sortType: string = queryStringObj[key].split("-")[1];

            if (sortName === "alphabetically") {
                if (sortType === "aesc") {
                    URL = URL.concat(`&order=name:asc`);
                } else {
                    URL = URL.concat(`&order=name:desc`);
                }
            } else if (sortName === "releasedate") {
                if (sortType === "aesc") {
                    URL = URL.concat(`&order=first_release_date:asc`);
                } else {
                    URL = URL.concat(`&order=first_release_date:desc`);
                }
            } else if (sortName === "popularity") {
                if (sortType === "aesc") {
                    URL = URL.concat(`&order=popularity:asc`);
                } else {
                    URL = URL.concat(`&order=popularity:desc`);
                }
            }
        }

        URL = URL.concat(`&limit=${config.igdb.pageLimit}`);

    });

    return new Promise((resolve: any, reject: any) => {

        const pricePromise = (rawResponse: RawThumbnailGameResponse[]): Promise<SteamAPIGetPriceInfoResponse[]> => {

            return new Promise((resolve: any, reject: any) => {
                const pricesResponse: SteamAPIGetPriceInfoResponse[] = [];
                const steamids: number[] = rawResponse
                    .filter((x: RawThumbnailGameResponse) => { return x.external; })
                    .map((x: RawThumbnailGameResponse) => { return parseInt(x.external.steam); });

                steamAPIGetPriceInfo(steamids)
                .then( (steamAPIGetPriceInfoResponse: SteamAPIGetPriceInfoResponse[]) => {
                    rawResponse.forEach((x: RawThumbnailGameResponse) => {
                        const priceResponse: SteamAPIGetPriceInfoResponse = {
                            steamgameid: undefined,
                            price: undefined,
                            discount_percent: undefined,
                            steam_url: undefined
                        };

                        if (x.external) {
                            const steamid: number = parseInt(x.external.steam);
                            const foundIndex: number = steamAPIGetPriceInfoResponse.findIndex((priceInfo: SteamAPIGetPriceInfoResponse) => { return priceInfo.steamgameid === steamid; });
                            if (foundIndex !== -1) {
                                priceResponse.steamgameid = steamid;
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
                        if (x.external) {
                            const steamid: string = x.external.steam;
                            steam_url = `${config.steam.appURL}/${steamid}`;
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
                            cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
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

        axios.get(
            URL,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then( (response: any) => {
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