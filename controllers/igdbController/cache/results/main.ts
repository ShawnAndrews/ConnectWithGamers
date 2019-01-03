import config from "../../../../config";
import {
    GameResponse,
    redisCache, IGDBCacheEntry, RawGameResponse, GameResponseFields } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse, AxiosError } from "axios";
import { buildIGDBRequestBody } from "../../../../util/main";
import { cachePreloadedGame, getCachedGame } from "../game/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function resultsGamesKeyExists(queryString: string): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, queryString, (error: string, value: boolean) => {
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
export function getCachedResultsGames(queryString: string): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, queryString, (error: string, stringifiedGameIds: string) => {
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
 * Cache results game.
 */
export function cacheResultsGames(queryString: string): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];
    const queryStringObj: any = JSON.parse(queryString);
    const whereFilters: string[] = [];

    Object.keys(queryStringObj).forEach((key: string) => {

        if (key === "genres") {
            const genres: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`genres = (${genres.join()})`);
        }

        if (key === "platforms") {
            const platforms: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`platforms = (${platforms.join()})`);
        }

        if (key === "categories") {
            const categories: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`category = ${categories.join()}`);
        }

        if (key === "popularity") {
            const popularity: number = parseInt(queryStringObj[key]);

            whereFilters.push(`aggregated_rating >= ${popularity}`);
        }

    });

    const URL: string = `${config.igdb.apiURL}/games`;
    const body: string = buildIGDBRequestBody(
        whereFilters,
        GameResponseFields.join(),
        undefined,
        undefined,
        queryStringObj.query
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
        .then( (response: AxiosResponse) => {
            const rawGamesResponses: RawGameResponse[] = response.data;
            const ids: number[] = rawGamesResponses.map((rawGameResponse: RawGameResponse) => rawGameResponse.id);
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((rawGameResponse: RawGameResponse) => cachePreloadedGame(rawGameResponse));

            redisClient.hset(cacheEntry.key, queryString, JSON.stringify(ids));
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
            if (error.response && error.response.status !== 200) {
                return reject("Retry");
            }
            return reject(error);
        });

    });

}