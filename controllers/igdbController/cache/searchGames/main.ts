import config from "../../../../config";
import axios from "axios";
import { redisCache, IGDBCacheEntry, SearchGameResponseFields, SearchGameResponse, RawSearchGameResponse } from "../../../../client/client-server-common/common";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function searchGamesKeyExists(query: string): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, query, (err: string, value: boolean) => {
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

/**
 * Get redis-cached search games.
 */
export function getCachedSearchGames(query: string): Promise<SearchGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, query, (error: string, stringifiedGameIds: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedGameIds));
        });
    });

}

/**
 * Get redis-cached search games.
 */
export function cacheSearchGames(query: string): Promise<SearchGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {

        axios.get(
            `https://api-endpoint.igdb.com/games/?search=${query}&fields=${SearchGameResponseFields}&order=release_dates.date:desc&limit=${config.igdb.pageLimit}`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then( (response: any) => {
            const rawResponse: RawSearchGameResponse[] = response.data;
            const gamesResponse: SearchGameResponse[] = rawResponse;

            redisClient.hset(cacheEntry.key, query, JSON.stringify(gamesResponse));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            return resolve(gamesResponse);

        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}