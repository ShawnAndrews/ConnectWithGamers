import config from "../../../../config";
import { PredefinedGameResponse, RawPredefinedGameResponse, PredefinedGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { getAllGenrePairs } from "../genreList/main";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function reviewedGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[9];

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
 * Get redis-cached reviewed games.
 */
export function getCachedReviewedGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[9];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedReviewedGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedReviewedGames));
        });
    });

}

/**
 * Cache reviewed games.
 */

export function cacheReviewedGames(): Promise<PredefinedGameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[9];
    const CURRENT_UNIX_TIME_MS: number = new Date().getTime();

    return new Promise((resolve: any, reject: any) => {

        axios.get(
            `https://api-endpoint.igdb.com/games/?fields=${PredefinedGameResponseFields}&filter[first_release_date][gt]=2018-06-01&filter[release_dates.platform][eq]=6&order=updated_at:desc&limit=${config.igdb.pageLimit}&filter[cover][exists]=1`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then( (response: AxiosResponse) => {
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