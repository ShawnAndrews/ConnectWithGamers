import { GameResponse, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { parseSteamIds, getGamesBySteamIds } from "../util";
import { getCachedGame } from "../game/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function discountedGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

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
 * Get redis-cached discounted games.
 */
export function getCachedDiscountedGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

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
 * Cache discounted games.
 */

export function cacheDiscountedGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `https://store.steampowered.com/search/?category1=998&specials=1`;

        axios({
            method: "get",
            url: URL
        })
        .then((response: AxiosResponse) => {
            const steamWebpage: string = response.data;
            const steamIds: number[] = parseSteamIds(steamWebpage);

            getGamesBySteamIds(steamIds, true)
            .then((gameResponses: GameResponse[]) => {
                const excludeGameIds: number[] = [111674, 36529, 15108, 103232, 15736, 24462];
                const ids: number[] = gameResponses.filter((x: GameResponse) => excludeGameIds.indexOf(x.id) === -1).map((x: GameResponse) => x.id);
                gameResponses = gameResponses.filter((x: GameResponse) => excludeGameIds.indexOf(x.id) === -1);

                redisClient.set(cacheEntry.key, JSON.stringify(ids));
                if (cacheEntry.expiry !== -1) {
                    redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                }

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