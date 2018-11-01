import config from "../../../../config";
import { PredefinedGameResponse, RawPredefinedGameResponse, PredefinedGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { ArrayClean } from "../../../../util/main";
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
export function getCachedUpcomingGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedUpcomingGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedUpcomingGames));
        });
    });

}


/**
 * Cache upcoming games.
 */
export function cacheUpcomingGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];
    const CURRENT_UNIX_TIME_MS: number = new Date().getTime();

    return new Promise((resolve: any, reject: any) => {
        axios.get(
            `https://api-endpoint.igdb.com/games/?fields=${PredefinedGameResponseFields.join()}&order=first_release_date:aes&filter[first_release_date][gte]=${CURRENT_UNIX_TIME_MS}&filter[popularity][gt]=5&limit=${config.igdb.pageLimit}&filter[cover][exists]=1`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then((response: AxiosResponse) => {
            const rawResponse: RawPredefinedGameResponse[] = response.data;
            const gamesResponse: PredefinedGameResponse[] = [];

            rawResponse.forEach((x: RawPredefinedGameResponse) => {
                const id: number = x.id;
                const name: string = x.name;
                const aggregated_rating: number = x.aggregated_rating;
                const first_release_date: number = x.first_release_date;
                const cover: string = x.cover ? igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg") : undefined;
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
                const gameResponse: PredefinedGameResponse = { id: id, name: name, aggregated_rating: aggregated_rating, linkIcons: linkIcons, first_release_date: first_release_date, cover: cover };
                gamesResponse.push(gameResponse);
            });

            redisClient.set(cacheEntry.key, JSON.stringify(gamesResponse));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            return resolve(gamesResponse);
        })
        .catch( (error: any) => {
            return reject(error);
        });
    });

}