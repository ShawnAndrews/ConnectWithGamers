import config from "../../../../../config";
import { PredefinedGamesType, ThumbnailGameResponse, RawThumbnailGameResponse, ThumbnailGameResponseFields, redisCache, IGDBCacheEntry, Genre, Platform } from "../../../../../client/client-server-common/common";
import axios from "axios";
import { ArrayClean } from "../../../../../util/main";
import { getAllGenrePairs } from "../../genreList/main";
import { platform } from "os";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function predefinedPopularGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[11];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, PredefinedGamesType.Popular, (error: string, value: boolean) => {
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
export function getCachedPredefinedPopularGames(): Promise<ThumbnailGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[11];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, PredefinedGamesType.Popular, (error: string, stringifiedThumbnailGames: string) => {
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

export function cachePredefinedPopularGames(): Promise<ThumbnailGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[11];
    const CURRENT_UNIX_TIME_MS: number = new Date().getTime();

    return new Promise((resolve: any, reject: any) => {
        axios.get(
            `https://api-endpoint.igdb.com/games/?fields=${ThumbnailGameResponseFields.join()}&order=aggregated_rating:desc&filter[first_release_date][lte]=${CURRENT_UNIX_TIME_MS}&filter[first_release_date][gt]=2018-06-01&filter[aggregated_rating][lt]=100&filter[popularity][gt]=15&limit=${config.igdb.pageLimit}`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then((response: any) => {
            const rawResponse: RawThumbnailGameResponse[] = response.data;
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

                    redisClient.hset(cacheEntry.key, PredefinedGamesType.Popular, JSON.stringify(gamesResponse));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }
                    return resolve(gamesResponse);
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