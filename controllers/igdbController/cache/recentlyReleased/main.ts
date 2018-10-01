import config from "../../../../config";
import { RecentGameResponse, RawRecentGameResponse, RecentGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios from "axios";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function recentGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

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
 * Get redis-cached recent games.
 */
export function getCachedRecentGames(): Promise<RecentGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedRecentGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedRecentGames));
        });
    });

}

/**
 * Cache recent games.
 */

export function cacheRecentGames(): Promise<RecentGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];
    const CURRENT_UNIX_TIME_MS: number = new Date().getTime();

    return new Promise((resolve: any, reject: any) => {
        axios.get(
            `https://api-endpoint.igdb.com/games/?fields=${RecentGameResponseFields.join()}&order=first_release_date:desc&filter[first_release_date][lte]=${CURRENT_UNIX_TIME_MS}&filter[popularity][gt]=5&limit=${config.igdb.pageLimit}`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then((response: any) => {
            const rawResponse: RawRecentGameResponse[] = response.data;
            const gamesResponse: RecentGameResponse[] = [];

            rawResponse.forEach((x: RawRecentGameResponse) => {
                const id: number = x.id;
                const name: string = x.name;
                const first_release_date: number = x.first_release_date;
                const cover: string = x.cover ? igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg") : undefined;
                const gameResponse: RecentGameResponse = { id: id, name: name, first_release_date: first_release_date, cover: cover };
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