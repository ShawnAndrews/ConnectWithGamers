import config from "../../../../config";
import { redisCache, IGDBCacheEntry } from "../redisConstants";
import { ArrayClean } from "../../../../util/main";
import { DbGenreGamesResponse, GenreGameResponseFields } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function genreGamesKeyExists(genreId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, genreId, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

/**
 * Get redis-cached genre games.
 */
export function getCachedGenreGames(genreId: number): Promise<DbGenreGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];
    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, genreId, (error: string, stringifiedGenreGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedGenreGames));
        });
    });

}

/**
 * Cache genre games.
 */
export function cacheGenreGames(genreId: number): Promise<DbGenreGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[5];
    return new Promise((resolve: any, reject: any) => {
        igdbClient.genres({
            ids: [genreId]
        }, ["name"])
        .then( (genreNameResponse: any) => {

            const genreName: string = genreNameResponse.body[0].name;
            igdbClient.games({
                filters: {
                    "genres-eq": genreId,
                },
                order: "release_dates.date:desc",
                limit: config.igdb.pageLimit
            }, GenreGameResponseFields )
            .then( (response: any) => {

                getAllGenrePairs()
                .then((genrePair: string[]) => {
                    response.body.forEach((x: any) => {
                        let genres: string;
                        if (x.genres) {
                            genres = x.genres.map((genreId: number) => { return genrePair[genreId]; }).join(`, `);
                        }
                        let steam_url: string;
                        if (x.external) {
                            const steamId: number = x.external.steam;
                            steam_url = `${config.steam.appURL}/${steamId}`;
                        }
                        let linkIcons: string[];
                        if (x.platforms) {
                            linkIcons = x.platforms
                            .map((platformId: number) => {
                                if (platformId === 48 || platformId === 45) {
                                    return "fab fa-playstation";
                                } else if (platformId === 34) {
                                    return "fab fa-android";
                                } else if (platformId === 6) {
                                    return "fab fa-windows";
                                } else if (platformId === 14) {
                                    return "fab fa-apple";
                                } else if (platformId === 3) {
                                    return "fab fa-linux";
                                } else if (platformId === 92) {
                                    return "fab fa-steam";
                                } else if (platformId === 49) {
                                    return "fab fa-xbox";
                                } else if (platformId === 130) {
                                    return "fab fa-nintendo-switch";
                                }
                            });
                            linkIcons = ArrayClean(linkIcons, undefined);
                        }
                        let cover: string;
                        if (x.cover) {
                            cover = igdbClient.image( { cloudinary_id: x.cover.cloudinary_id }, "cover_big", "jpg");
                        }
                        x.cover = cover;
                        x.genres = genres;
                        x.steam_url = steam_url;
                        x.linkIcons = linkIcons;
                    });

                    const dbGenreGamesResponse: DbGenreGamesResponse = { genreName: genreName, genreGames: response.body };
                    redisClient.hset(cacheEntry.key, genreId, JSON.stringify(dbGenreGamesResponse));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }
                    return resolve(dbGenreGamesResponse);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            })
            .catch( (error: string) => {
                return reject(`Error retrieving genre games from IGDB. ${error}`);
            });
        })
        .catch ( () => {
            return reject("Genre does not exist.");
        });

    });

}