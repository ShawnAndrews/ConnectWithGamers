import config from "../../../../config";
import { PredefinedGameResponse, RawPredefinedGameResponse, PredefinedGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { ArrayClean, IGDBImage } from "../../../../util/main";
const redis = require("redis");
const redisClient = redis.createClient();

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
    const CURRENT_UNIX_TIME_MS: number = parseInt(new Date().getTime().toString().slice(0, -3));

    const URL: string = `${config.igdb.apiURL}/games`;
    let body: string = `fields ${PredefinedGameResponseFields.join()}; limit ${config.igdb.pageLimit};`;
    body = body.concat(`where cover != null & popularity > 5 & first_release_date >= ${CURRENT_UNIX_TIME_MS};`);
    body = body.concat(`sort first_release_date asc;`);

    return new Promise((resolve: any, reject: any) => {
        axios({
            method: "post",
            url: URL,
            headers: {
                "user-key": config.igdb.key,
                "Accept": "application/json"
            },
            data: body
        })
        .then((response: AxiosResponse) => {
            const rawResponse: RawPredefinedGameResponse[] = response.data;
            const gamesResponse: PredefinedGameResponse[] = [];

            rawResponse.forEach((x: RawPredefinedGameResponse) => {
                const id: number = x.id;
                const name: string = x.name;
                const aggregated_rating: number = x.aggregated_rating;
                const first_release_date: number = x.first_release_date;
                const cover: string = x.cover ? IGDBImage(x.cover.image_id, "cover_big", "jpg") : undefined;
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