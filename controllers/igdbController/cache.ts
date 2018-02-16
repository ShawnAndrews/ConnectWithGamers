const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
import config from "../../config";
import { GameListEntryResponse, GameListEntryResponseFields, GameResponse, GameResponseFields } from "../../client/client-server-common/common";

const igdbClient = igdb(config.igdb.key);

const ONE_DAY: number = 60 * 60 * 24;
const ONE_WEEK: number = 60 * 60 * 24 * 7;
const INFINITE: number = -1;

interface IGDBCacheEntry {
    key: string;
    expiry: number; // seconds
}

export const redisCache: IGDBCacheEntry[] = [
    {key: "upcominggames", expiry: ONE_DAY},
    {key: "games", expiry: INFINITE},
    {key: "searchGames", expiry: ONE_DAY}
];

// register redis error handler
redisClient.on("error", function (err: any) {
    console.log("Error " + err);
});

/**
 *  UPCOMINGGAMES
 */
export function upcomingGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.exists(cacheEntry.key, (err: any, value: boolean) => {
            console.log(`err: ${err}`);
            console.log(`value: ${JSON.stringify(value)}`);
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedUpcomingGames(): Promise<number[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.lrange(cacheEntry.key, 0, -1, (err: any, value: number[]) => {
            console.log(`err: ${err}`);
            console.log(`value: ${JSON.stringify(value)}`);
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function cacheUpcomingGames(): Promise<number[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    const formatDate = (date: Date) => {
        const d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = "0" + month;
        }
        if (day.length < 2) {
            day = "0" + day;
        }

        const formattedDate = [year, month, day].join("-");
        return formattedDate;
    };

    const date = new Date();
    const lastDayOfPreviousMonth = formatDate(new Date(date.getFullYear(), date.getMonth(), 0));
    const lastDayOfCurrentMonth = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));

    let upcomingGameIds: number[];
    return new Promise((resolve: any, reject: any) => {
        igdbClient.games({
            filters: {
                "release_dates.date-gt": lastDayOfPreviousMonth,
                "release_dates.date-lt": lastDayOfCurrentMonth
            },
            limit: config.igdb.pageLimit,
            order: "release_dates.date:desc"
        }, ["id"])
        .then( (response: any) => {
            upcomingGameIds = response.body.map((x: any) => { return x.id; });
            upcomingGameIds.forEach((x: number) => {
                console.log(`Caching upcoming game id #${x}`);
                redisClient.rpush(cacheEntry.key, x);
            });
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }
            console.log(`Cached upcoming game ids: ${upcomingGameIds}`);
            return resolve(upcomingGameIds);
        })
        .catch( (error: any) => {
            return reject(error);
        });
    });

}

/**
 *  GAMES
 */
export function gameKeyExists(gameId: number): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, gameId, (err: any, value: boolean) => {
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedGame(gameId: number): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, gameId, (err: any, stringifiedGame: string) => {
            if (err) {
                return reject(err);
            }
            console.log(`GETTING CACHED GAME #${gameId}`);
            return resolve(JSON.parse(stringifiedGame));
        });
    });

}

export function cacheGame(gameId: number): Promise<GameResponse> {
    const cacheEntry: IGDBCacheEntry = redisCache[1];

    const game: GameResponse = { name: "" };

    return new Promise((resolve: any, reject: any) => {
        igdbClient.games({
            ids: [gameId]
        }, GameResponseFields)
        .then( (response: any) => {

            // load game properties
            game.name = response.body[0].name;
            game.rating = response.body[0].total_rating;
            game.rating_count = response.body[0].total_rating_count;
            if (response.body[0].cover) {
                game.cover = igdbClient.image(
                    { cloudinary_id: response.body[0].cover.cloudinary_id },
                    "screenshot_huge", "jpg");
            }
            game.summary = response.body[0].summary;
            if (response.body[0].screenshots) {
                game.screenshots = response.body[0].screenshots.map((x: any) => {
                    return igdbClient.image(
                        { cloudinary_id: x.cloudinary_id },
                        "screenshot_huge", "jpg");
                });
            }

            // async load genre
            if (response.body[0].genres) {
                const genreIds: number[] = response.body[0].genres;

                igdbClient.genres({
                    ids: genreIds
                }, ["name"])
                .then( (genreResponse: any) => {
                    const genreNames: string[] = genreResponse.body.map( (x: any) => { return x.name; });
                    game.genres = genreNames;
                    console.log(`CACHEING GAME #${gameId}`);
                    redisClient.hset(cacheEntry.key, gameId, JSON.stringify(game));
                    if (cacheEntry.expiry !== -1) {
                        redisClient.expire(cacheEntry.key, cacheEntry.expiry);
                    }
                    resolve(game);
                })
                .catch ( (error: any) => {
                    reject(error);
                });
            } else {
                console.log(`CACHEING GAME #${gameId}`);
                redisClient.hset(cacheEntry.key, gameId, JSON.stringify(game));
                resolve(game);
            }
        })
        .catch( (error: any) => {
            reject(error);
        });
    });

}

/**
 *  GAMESLIST
 */
export function searchGamesKeyExists(query: string): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hexists(cacheEntry.key, query, (err: any, value: boolean) => {
            if (err) {
                return reject(err);
            }
            return resolve(value);
        });
    });

}

export function getCachedSearchGames(query: string): Promise<GameListEntryResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {
        redisClient.hget(cacheEntry.key, query, (err: any, stringifiedGameIds: string) => {
            if (err) {
                return reject(err);
            }
            console.log(`GETTING CACHED GAMESLIST ${JSON.parse(stringifiedGameIds)}`);
            return resolve(JSON.parse(stringifiedGameIds));
        });
    });

}

export function cacheSearchGames(query: string): Promise<GameListEntryResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[2];

    return new Promise((resolve: any, reject: any) => {

        igdbClient.games({
            limit: config.igdb.pageLimit,
            order: "release_dates.date:desc",
            search: query
        }, GameListEntryResponseFields)
        .then((result: any) => {
            console.log(`Recieved games list response.`);
            const games: GameListEntryResponse[] = result.body;
            redisClient.hset(cacheEntry.key, query, JSON.stringify(games));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }
            resolve(games);
        })
        .catch((error: any) => {
            console.log(`Error: ${error}`);
            return reject(error);
        });

    });

}