import config from "../../../../config";
import { ArrayClean } from "../../../../util/main";
import { DbPlatformGamesResponse, PlatformGameResponseFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import { getAllGenrePairs } from "../genreList/main";
const redis = require("redis");
let redisClient: any;
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

if (!config.disableListening) {
    redisClient = redis.createClient();
}

/**
 * Check if redis key exists.
 */

export function platformGamesKeyExists(platformId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, platformId, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

/**
 * Get redis-cached platform games.
 */
export function getCachedPlatformGames(platformId: number): Promise<DbPlatformGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, platformId, (error: string, stringifiedPlatformGames: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedPlatformGames));
        });
    });

}

/**
 * Cache platform games.
 */
export function cachePlatformGames(platformId: number): Promise<DbPlatformGamesResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        igdbClient.platforms({
            ids: [platformId]
        }, ["name"])
        .then( (platformNameResponse: any) => {
            const MAX_IGDB_PLATFORMS: number = 200;
            const platformName: string = platformNameResponse.body[0].name;
            const excludedPlatformIds: number[] = [];

            for (let i = 0; i < MAX_IGDB_PLATFORMS; i++) {
                if (i !== platformId) {
                    excludedPlatformIds.push(i);
                }
            }

            igdbClient.games({
                filters: {
                    "platforms-in": platformId,
                    "platforms-not_in": excludedPlatformIds
                },
                order: "rating:desc",
                limit: config.igdb.pageLimit
            }, PlatformGameResponseFields )
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

                    const dbPlatformGamesResponse: DbPlatformGamesResponse = { platformName: platformName, platformGames: response.body };
                    redisClient.hset(cacheEntry.key, platformId, JSON.stringify(dbPlatformGamesResponse));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }
                    return resolve(dbPlatformGamesResponse);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            })
            .catch ( (error: string) => {
                return reject(`Error retrieving games from IGDB. ${error}`);
            });
        })
        .catch ( () => {
            return reject("Platform does not exist.");
        });

    });

}