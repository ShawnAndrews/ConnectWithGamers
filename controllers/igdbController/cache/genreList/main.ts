import config from "../../../../config";
import { GenrePair, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";

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
export function genreListKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[6];

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
    const cacheEntry: IGDBCacheEntry = redisCache[6];

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
    const cacheEntry: IGDBCacheEntry = redisCache[6];

    return new Promise((resolve: any, reject: any) => {
        igdbClient.genres({
            limit: config.igdb.pageLimit
        }, ["name"])
        .then( (response: any) => {
            const genreList: GenrePair[] = response.body;

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