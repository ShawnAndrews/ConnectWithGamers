import config from "../../../../config";
import { GameResponse, RawGameResponse, GameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { buildIGDBRequestBody, getCurrentUnixTimestampInSeconds } from "../../../../util/main";
import { convertRawGameResponse, getGameReponseById } from "../util";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function recentGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

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
export function getCachedRecentGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedGameIds: string) => {
            if (error) {
                return reject(error);
            }

            const ids: number[] = JSON.parse(stringifiedGameIds);
            const gamePromises: Promise<GameResponse>[] = ids.map((id: number) => getGameReponseById(id));

            Promise.all(gamePromises)
            .then((gameResponses: GameResponse[]) => {
                return resolve(gameResponses);
            })
            .catch((error: string) => {
                return reject(error);
            });

        });
    });

}

/**
 * Cache recent games.
 */

export function cacheRecentGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];
    const CURRENT_UNIX_TIME_S: number = getCurrentUnixTimestampInSeconds();

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            [
                `cover != null`,
                `popularity > 5`,
                `first_release_date <= ${CURRENT_UNIX_TIME_S}`
            ],
            `id`,
            undefined,
            `sort first_release_date desc`
        );

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
            const ids: number[] = response.data.map((x: any) => x.id);
            const gamePromises: Promise<GameResponse>[] = ids.map((id: number) => getGameReponseById(id));

            redisClient.set(cacheEntry.key, JSON.stringify(ids));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            Promise.all(gamePromises)
            .then((gameResponses: GameResponse[]) => {
                return resolve(gameResponses);
            })
            .catch((error: string) => {
                return reject(error);
            });

        })
        .catch( (error: any) => {
            return reject(error);
        });
    });

}