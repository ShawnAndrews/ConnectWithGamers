import config from "../../../../config";
import {
    PredefinedGameResponse, RawPredefinedGameResponse, PredefinedGameResponseFields,
    redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
import axios, { AxiosResponse } from "axios";
import { ArrayClean, IGDBImage } from "../../../../util/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function popularGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[8];

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
 * Get redis-cached games.
 */
export function getCachedPopularGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[8];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedPopularGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedPopularGames));
        });
    });

}

/**
 * Cache popular game.
 */
export function cachePopularGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[8];
    const CURRENT_UNIX_TIME_MS: number = parseInt(new Date().getTime().toString().slice(0, -3));

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        let body: string = `fields ${PredefinedGameResponseFields.join()}; limit ${config.igdb.pageLimit};`;
        body = body.concat(`where cover != null & popularity > 15 & aggregated_rating < 100 & first_release_date < ${CURRENT_UNIX_TIME_MS} & first_release_date > 1533081600;`);
        body = body.concat(`sort aggregated_rating desc;`);

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
            const rawResponse: RawPredefinedGameResponse[] = response.data;
            const gamesResponse: PredefinedGameResponse[] = [];

            getAllGenrePairs()
            .then((genrePair: string[]) => {

                rawResponse.forEach((x: RawPredefinedGameResponse) => {
                    const id: number = x.id;
                    const name: string =  x.name;
                    const aggregated_rating: number = x.aggregated_rating;
                    let cover: string = undefined;
                    if (x.cover) {
                        cover = IGDBImage(x.cover.image_id, "cover_big", "jpg");
                    }
                    let genre: string = undefined;
                    if (x.genres) {
                        genre = genrePair[x.genres[0]];
                    } else {
                        genre = genrePair[8];
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
                    const gameResponse: PredefinedGameResponse = { id: id, name: name, aggregated_rating: aggregated_rating, linkIcons: linkIcons, cover: cover, genre: genre };
                    gamesResponse.push(gameResponse);
                });

                redisClient.set(cacheEntry.key, JSON.stringify(gamesResponse));
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