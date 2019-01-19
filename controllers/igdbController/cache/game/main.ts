import config from "../../../../config";
import {
    GameResponse, GameFields, RawGame, redisCache, IGDBCacheEntry, buildIGDBRequestBody } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { convertRawGame } from "../util";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function gameKeyExists(gameId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

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
    const cacheEntry: IGDBCacheEntry = redisCache[1];

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
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            [
                `id = ${gameId}`
            ],
            GameFields.join(),
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
            const RawGame: RawGame = response.data[0];
            convertRawGame([RawGame])
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
export function cachePreloadedGame(RawGame: RawGame): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];
    const gameId: number = RawGame.id;

    return new Promise((resolve: any, reject: any) => {
        gameKeyExists(gameId)
        .then((exists: boolean) => {
            convertRawGame([RawGame])
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