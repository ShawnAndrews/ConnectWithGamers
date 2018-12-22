import config from "../../../../config";
import axios, { AxiosResponse } from "axios";
import { redisCache, IGDBCacheEntry, SearchGameResponseFields, SearchGameResponse, RawSearchGameResponse } from "../../../../client/client-server-common/common";
const redis = require("redis");
const redisClient = redis.createClient();

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

        const URL: string = `${config.igdb.apiURL}/games`;
        let body: string = `fields ${SearchGameResponseFields.join()}; limit ${config.igdb.pageLimit};`;
        body = body.concat(`search "${query}";`);

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