import config from "../../../../config";
import { buildIGDBRequestBody } from "../../../../util/main";
import {
    GameResponse, GameResponseFields, RawGameResponse, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { convertRawGameResponse } from "../util";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function gameKeyExists(gameId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, gameId, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }

            return resolve(value);
        });
    });

}

/**
 * Get redis-cached games.
 */
export function getCachedGame(gameId: number): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, gameId, (error: string, stringifiedGame: string) => {
            if (error) {
                return reject(error);
            }

            const gameResponse: GameResponse = JSON.parse(stringifiedGame);

            return resolve(gameResponse);
        });
    });

}

/**
 * Cache game.
 */
export function cacheGame(gameId: number): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            [
                `id = ${gameId}`
            ],
            GameResponseFields.join(),
            undefined
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
            const rawGameResponse: RawGameResponse = response.data[0];

            convertRawGameResponse([rawGameResponse])
                .then((gameResponses: GameResponse[]) => {

                    redisClient.hset(cacheEntry.key, gameId, JSON.stringify(gameResponses[0]));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }

                    return resolve(gameResponses[0]);
                })
                .catch((error: string) => {
                    return reject(error);
                });

        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}

/**
 * Cache preloaded game.
 */
export function cachePreloadedGame(rawGameResponse: RawGameResponse): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];
    const gameId: number = rawGameResponse.id;

    return new Promise((resolve: any, reject: any) => {

        gameKeyExists(gameId)
        .then((exists: boolean) => {
            convertRawGameResponse([rawGameResponse])
            .then((gameResponses: GameResponse[]) => {

                redisClient.hset(cacheEntry.key, gameId, JSON.stringify(gameResponses[0]));
                if (cacheEntry.expiry !== -1) {
                    redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                }
                return resolve(gameResponses[0]);
            })
            .catch((error: string) => {
                return reject(error);
            });
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}