import config from "../../../../config";
import { GameResponse, RawGameResponse, GameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { getCurrentUnixTimestampInSeconds, buildIGDBRequestBody } from "../../../../util/main";
import { cachePreloadedGame, getCachedGame } from "../game/main";
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
export function getCachedUpcomingGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedGameIds: string) => {
            if (error) {
                return reject(error);
            }

            const ids: number[] = JSON.parse(stringifiedGameIds);
            const gamePromises: Promise<GameResponse>[] = ids.map((id: number) => getCachedGame(id));

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
 * Cache upcoming games.
 */
export function cacheUpcomingGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];
    const CURRENT_UNIX_TIME_S: number = getCurrentUnixTimestampInSeconds();

    const URL: string = `${config.igdb.apiURL}/games`;
    const body: string = buildIGDBRequestBody(
        [
            `cover != null`,
            `popularity > 5`,
            `first_release_date >= ${CURRENT_UNIX_TIME_S}`
        ],
        GameResponseFields.join(),
        undefined,
        `sort first_release_date asc`
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
        .then((response: AxiosResponse) => {
            const rawGamesResponses: RawGameResponse[] = response.data;
            const ids: number[] = rawGamesResponses.map((rawGameResponse: RawGameResponse) => rawGameResponse.id);
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((rawGameResponse: RawGameResponse) => cachePreloadedGame(rawGameResponse));

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