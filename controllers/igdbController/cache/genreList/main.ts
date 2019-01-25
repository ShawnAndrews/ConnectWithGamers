import config from "../../../../config";
import { GenrePair, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { buildIGDBRequestBody } from "../../../../client/client-server-common/common";

const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function genreListKeyExists(): Promise<boolean> {
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
 * Get redis-cached genre list.
 */
export function getCachedGenreList(): Promise<GenrePair[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedGenreList: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedGenreList));
        });
    });

}

/**
 * Cache genre list.
 */
export function cacheGenreList(): Promise<GenrePair[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    const URL: string = `${config.igdb.apiURL}/genres`;
    const body: string = buildIGDBRequestBody(
        [],
        `name`,
        undefined
    );

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
        .then( (response: AxiosResponse) => {
            const genreList: GenrePair[] = response.data;
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

export const getAllGenrePairs = (): Promise<string[]> => {

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