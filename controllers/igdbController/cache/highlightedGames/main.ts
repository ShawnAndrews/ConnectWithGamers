import config from "../../../../config";
import { GameResponse, RawGameResponse, GameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse, AxiosError } from "axios";
import { buildIGDBRequestBody, getCurrentUnixTimestampInSeconds } from "../../../../util/main";
import { getCachedGame, cachePreloadedGame } from "../game/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function highlightedGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

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
 * Get redis-cached highlighted games.
 */
export function getCachedHighlightedGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

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
 * Cache highlighted games.
 */

export function cacheHighlightedGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];
    const CURRENT_UNIX_TIME_S: number = getCurrentUnixTimestampInSeconds();
    const THREE_MONTH_AGO_UNIX_TIME_S: number = getCurrentUnixTimestampInSeconds() - (60 * 60 * 24 * 30 * 3);

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            [
                `cover != null`,
                `screenshots != null`,
                `first_release_date > ${THREE_MONTH_AGO_UNIX_TIME_S}`,
                `first_release_date <= ${CURRENT_UNIX_TIME_S}`,
                `platforms = 6`
            ],
            GameResponseFields.join(),
            undefined,
            `sort popularity desc`
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
        .then( (response: AxiosResponse) => {
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
        .catch((error: AxiosError) => {
            return reject(error);
        });

    });

}