import config from "../../../../config";
import {
    PredefinedGameResponse, RawPredefinedGameResponse, PredefinedGameResponseFields,
    redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
import axios from "axios";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function popularGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[8];

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
 * Get redis-cached games.
 */
export function getCachedPopularGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[8];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedPopularGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedPopularGames));
        });
    });

}

/**
 * Cache popular game.
 */
export function cachePopularGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[8];
    const CURRENT_UNIX_TIME_MS: number = new Date().getTime();

    return new Promise((resolve: any, reject: any) => {
        axios.get(
            `https://api-endpoint.igdb.com/games/?fields=${PredefinedGameResponseFields.join()}&order=aggregated_rating:desc&filter[first_release_date][lte]=${CURRENT_UNIX_TIME_MS}&filter[first_release_date][gt]=2018-06-01&filter[aggregated_rating][lt]=100&filter[popularity][gt]=15&limit=${config.igdb.pageLimit}&filter[cover][exists]=1`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then( (response: any) => {
            const rawResponse: RawPredefinedGameResponse[] = response.data;
            const gamesResponse: PredefinedGameResponse[] = [];

            getAllGenrePairs()
            .then((genrePair: string[]) => {

                rawResponse.forEach((x: RawPredefinedGameResponse) => {
                    const id: number = x.id;
                    const name: string =  x.name;
                    const aggregated_rating: number = x.aggregated_rating;
                    let cover: string = undefined;
                    if (x.cover) {
                        cover = igdbClient.image(
                            { cloudinary_id: x.cover.cloudinary_id },
                            "cover_big", "jpg");
                    }

                    let genre: string = undefined;
                    if (x.genres) {
                        genre = genrePair[x.genres[0]];
                    } else {
                        genre = genrePair[8];
                    }

                    const gameResponse: PredefinedGameResponse = { id: id, name: name, aggregated_rating: aggregated_rating, cover: cover, genre: genre };
                    gamesResponse.push(gameResponse);
                });

                redisClient.set(cacheEntry.key, JSON.stringify(gamesResponse));
                if (cacheEntry.expiry !== -1) {
                    redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                }

                return resolve(gamesResponse);
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