import config from "../../../../config";
import { redisCache, IGDBCacheEntry } from "../redisConstants";
import {
    GameListEntryResponse, GameListEntryResponseFields } from "../../../../client/client-server-common/common";

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
export function getCachedSearchGames(query: string): Promise<GameListEntryResponse[]> {
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
export function cacheSearchGames(query: string): Promise<GameListEntryResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {

        igdbClient.games({
            limit: config.igdb.pageLimit,
            order: "release_dates.date:desc",
            search: query,
        }, GameListEntryResponseFields)
        .then((result: any) => {
            const games: GameListEntryResponse[] = result.body;
            redisClient.hset(cacheEntry.key, query, JSON.stringify(games));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }
            resolve(games);
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}