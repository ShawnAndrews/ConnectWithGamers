import config from "../../../../config";
import { UpcomingGameResponse, RawUpcomingGameResponse, UpcomingGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios from "axios";
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
export function getCachedUpcomingGames(): Promise<UpcomingGameResponse[]> {
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
export function cacheUpcomingGames(): Promise<UpcomingGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];
    const CURRENT_UNIX_TIME_MS: number = new Date().getTime();

    return new Promise((resolve: any, reject: any) => {
        axios.get(
            `https://api-endpoint.igdb.com/games/?fields=${UpcomingGameResponseFields.join()}&order=first_release_date:aes&filter[first_release_date][gte]=${CURRENT_UNIX_TIME_MS}&filter[popularity][gt]=5&limit=${config.igdb.pageLimit}`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then((response: any) => {
            const rawResponse: RawUpcomingGameResponse[] = response.data;
            const gamesResponse: UpcomingGameResponse[] = [];

            rawResponse.forEach((x: RawUpcomingGameResponse) => {
                const id: number = x.id;
                const name: string = x.name;
                const first_release_date: number = x.first_release_date;
                const cover: string = x.cover ? igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg") : undefined;
                const gameResponse: UpcomingGameResponse = { id: id, name: name, first_release_date: first_release_date, cover: cover };
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