const fs = require("fs");
import DatabaseBase from "./../base/dbBase";
import { PriceInfoResponse, SQLErrorCodes, GenericModelResponse, GameResponse, DbTableSteamNewsFields, DbTablePricingsFields, DbTableSteamGenreEnumFields, DbTableGenresFields, DbTableSimilarGamesFields, DbTables, NewsArticle, DbTableRouteCacheFields, RouteCache, DbTableSteamGamesFields } from "../../../client/client-server-common/common";
import { MysqlError } from "mysql";
import config from "../../../config";
import * as ytdl from "ytdl-core";
import { Writable } from "stream";
import Axios, { AxiosResponse, AxiosError } from "axios";
import { WriteStream } from "fs";

const MAX_VIDEO_CAPTURE_LEN_MS: number = 30000;

class SteamModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Check if game already exists.
     */
    gameExists(path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.select(
                DbTables.route_cache,
                DbTableRouteCacheFields,
                `${DbTableRouteCacheFields[0]}=?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Save game to database.
     */
    setGame(game: GameResponse, path: string): Promise<void> {

        return new Promise((resolve, reject) => {
            const filteredSummary: string = game.summary && game.summary.replace(/[^\x00-\x7F]/g, ""); // remove non-ascii
            const gamesColumnValues: any[] = [game.steam_games_sys_key_id, game.name, game.steam_review_enum_sys_key_id, game.total_review_count, filteredSummary, game.first_release_date, game.video];

            this.insert(
                DbTables.steam_games,
                DbTableSteamGamesFields.slice(1),
                gamesColumnValues,
                DbTableSteamGamesFields.slice(1).map(() => "?").join(", "),
                false)
                .then((dbResponse: GenericModelResponse) => {
                    const inserted_steam_games_sys_key_id: number = dbResponse.data.insertId;
                    const gamePromises: Promise<any>[] = [];

                    if (game.cover_small) {
                        gamePromises.push(this.setGameCover(inserted_steam_games_sys_key_id, game.cover_small));
                    }
                    if (game.screenshots) {
                        gamePromises.push(this.setGameScreenshots(inserted_steam_games_sys_key_id, game.screenshots));
                    }
                    if (game.genres) {
                        gamePromises.push(this.setGameGenres(inserted_steam_games_sys_key_id, game.genres));
                    }
                    if (game.similar_games) {
                        gamePromises.push(this.setGameSimilarGames(game.steam_games_sys_key_id, game.similar_games));
                    }
                    if (game.video) {
                        gamePromises.push(this.setGameVideoPreview(game.steam_games_sys_key_id, game.video));
                    }

                    return resolve();
                })
                .catch((err: MysqlError) => {
                    if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                        return reject(err);
                    } else {
                        return resolve();
                    }
                });

        });

    }

    /**
     * Get game from database.
     */
    getGame(path: string): Promise <GameResponse> {

        return new Promise((resolve, reject) => {

            // get game
            this.select(
                DbTables.route_cache,
                DbTableRouteCacheFields,
                `route = ?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const game: GameResponse = JSON.parse(dbResponse.data[0].response).data;

                        return resolve(game);
                    } else {
                        return reject("Database error.");
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Set game's pricings.
     */
    attemptCachePricings(gameId: number): Promise <PriceInfoResponse[]> {

        const updateGamePricing = (pricing: PriceInfoResponse): Promise<void> => {

            return new Promise((resolve, reject) => {
                const pricingsVals: any[] = [pricing.pricingEnumSysKeyId, pricing.steamGamesSysKeyId, pricing.title, pricing.price, pricing.discount_percent, pricing.log_dt];

                this.custom(
                    `UPDATE ${DbTables.pricings}
                    SET ${DbTablePricingsFields.slice(1).map((x: string) => `${x} = ?`).join()}
                    WHERE ${DbTablePricingsFields[1]} = ? AND ${DbTablePricingsFields[2]} = ? AND ${DbTablePricingsFields[3]} = ? AND ${DbTablePricingsFields[4]} = ?`,
                    pricingsVals.concat([pricing.pricingEnumSysKeyId, pricing.steamGamesSysKeyId, pricing.title]))
                    .then(() => {
                        return resolve();
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

            });

        };

        const addGamePricing = (pricing: PriceInfoResponse): Promise<void> => {

            return new Promise((resolve, reject) => {
                const pricingsVals: any[] = [pricing.pricingEnumSysKeyId, pricing.steamGamesSysKeyId, pricing.title, pricing.price, pricing.discount_percent, pricing.log_dt];

                this.custom(
                    `INSERT INTO ${DbTables.pricings}
                    (${DbTablePricingsFields.slice(1).join()})
                    VALUES
                    (${DbTablePricingsFields.slice(1).map(() => "?").join()})`,
                    pricingsVals)
                    .then(() => {
                        return resolve();
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

            });

        };

        return new Promise((resolve, reject) => {

            this.getGameSysKey(gameId)
                .then((steam_games_sys_key_id: number) => {
                    const pricingPromises: Promise<PriceInfoResponse[]>[] = [];

                    this.getGamePricings(gameId)
                        .then((pricings: PriceInfoResponse[]) => {

                            Promise.all(pricingPromises)
                                .then((vals: PriceInfoResponse[][]) => {
                                    const pricings: PriceInfoResponse[] = [].concat(...vals);
                                    const addOrUpdatePricingsPromises: Promise<void>[] = [];

                                    Promise.all(addOrUpdatePricingsPromises)
                                        .then(() => {

                                            // check if route already exists
                                            return this.custom(
                                                `SELECT * FROM ${DbTables.route_cache}
                                                WHERE route = ?`,
                                                [`/game/${gameId}`]);

                                        })
                                        .then((dbResponse: GenericModelResponse) => {

                                            // update pricings in route cache
                                            if (dbResponse.data.length > 0) {
                                                const game: GameResponse = JSON.parse(dbResponse.data[0].response).data;

                                                this.getGamePricings(gameId)
                                                    .then((pricings: PriceInfoResponse[]) => {
                                                        game.pricings = pricings;

                                                        const updatedRouteCache: RouteCache = { data: game };

                                                        this.custom(
                                                            `UPDATE ${DbTables.route_cache}
                                                            SET response = ?
                                                            WHERE route = ?`,
                                                            [JSON.stringify(updatedRouteCache), `/game/${gameId}`])
                                                            .then(() => {
                                                                return resolve(pricings);
                                                            })
                                                            .catch((err: string) => {
                                                                return reject(err);
                                                            });
                                                    })
                                                    .catch((err: string) => {
                                                        return reject(err);
                                                    });

                                            } else {
                                                return resolve(pricings);
                                            }

                                        })
                                        .catch((error: string) => {
                                            return reject(`Failed inserting new pricings for game id #${gameId}: ${error}`);
                                        });

                                })
                                .catch((error: string) => {
                                    return resolve();
                                });

                        })
                        .catch((error: string) => {
                            return reject(error);
                        });

                })
                .catch((error: string) => {
                    return reject(`Failed to get game's sys key id for pricings for game id #${gameId}: ${error}`);
                });

        });

    }

    /**
     * Get game's pricings.
     */
    getGamePricings(gameId: number): Promise <PriceInfoResponse[]> {

        return new Promise((resolve, reject) => {

            // check if pricings exists
            this.gamePricingsExist(gameId)
                .then((exists: boolean) => {

                    if (exists) {

                        this.custom(
                            `SELECT pc.${DbTablePricingsFields[2]}, pc.${DbTablePricingsFields[4]}, pc.${DbTablePricingsFields[5]}, pc.${DbTablePricingsFields[6]}, pc.${DbTablePricingsFields[7]}, pc.${DbTablePricingsFields[8]} FROM ${DbTables.pricings} pc
                            JOIN ${DbTables.steam_games} ig ON pc.${DbTablePricingsFields[3]} = ig.${DbTableSteamGamesFields[0]}
                            WHERE ig.${DbTableSteamGamesFields[1]}=?`,
                            [gameId])
                            .then((dbResponse: GenericModelResponse) => {
                                const pricings: PriceInfoResponse[] = [];
                                dbResponse.data.forEach((rawPricing: any) => {
                                    const pricing: PriceInfoResponse = { steamGamesSysKeyId: undefined, pricingEnumSysKeyId: rawPricing.pricings_enum_sys_key_id, title: rawPricing.title, price: rawPricing.price, discount_percent: rawPricing.discount_percent, discount_end_dt: undefined, log_dt: undefined };
                                    pricings.push(pricing);
                                });
                                return resolve(pricings);
                            })
                            .catch((err: string) => {
                                return reject(err);
                            });

                    } else {
                        return resolve([]);
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Set game cover in database if does not exist.
     */
    setGameCover(inserted_steam_games_sys_key_id: number, cover: string): Promise <void> {

        return new Promise((resolve, reject) => {

            // // check if cover exists
            // this.custom(
            //     `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.covers} cv
            //     JOIN ${DbTables.steam_games} ig ON cv.${DbTableCoversFields[2]} = ig.${DbTableSteamGamesFields[0]}
            //     WHERE ig.${DbTableSteamGamesFields[0]}=?`,
            //     [inserted_steam_games_sys_key_id])
            //     .then((dbResponse: GenericModelResponse) => {

            //         if (dbResponse.data[0][`COUNT(*)`] !== 0) {
            //             return resolve();
            //         } else {

            //             // insert image
            //             this.insert(
            //                 DbTables.steam_images,
            //                 DbTableSteamImagesFields.slice(1),
            //                 [cover],
            //                 DbTableSteamImagesFields.slice(1).map(() => "?").join(", "),
            //                 false)
            //                 .then((dbResponse: GenericModelResponse) => {
            //                     const inserted_steam_images_sys_key_id: number = dbResponse.data.insertId;
            //                     const coverImageColumnValues: any[] = [inserted_steam_images_sys_key_id, inserted_steam_games_sys_key_id];

            //                     // insert cover
            //                     this.insert(
            //                         DbTables.covers,
            //                         DbTableCoversFields.slice(1),
            //                         coverImageColumnValues,
            //                         DbTableCoversFields.slice(1).map(() => "?").join(", "),
            //                         false)
            //                         .then(() => {
            //                             return resolve();
            //                         })
            //                         .catch((err: MysqlError) => {
            //                             if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
            //                                 return reject(err);
            //                             } else {
            //                                 return resolve();
            //                             }
            //                         });

            //                 })
            //                 .catch((err: MysqlError) => {
            //                     if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
            //                         return reject(err);
            //                     } else {
            //                         return resolve();
            //                     }
            //                 });
            //         }
            //     })
            //     .catch((err: string) => {
            //         return reject(err);
            //     });
            return resolve();

        });

    }

    /**
     * Get game's sys key id in database.
     */
    getGameSysKey(gameId: number): Promise <number> {

        return new Promise((resolve, reject) => {

            // check if cover exists
            this.custom(
                `SELECT ${DbTableSteamGamesFields[0]} FROM ${DbTables.steam_games} WHERE id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    const steam_games_sys_key_id: number = dbResponse.data[0].steam_games_sys_key_id;
                    return resolve(steam_games_sys_key_id);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            return;
        });

    }

    /**
     * Get game cover in database if exists.
     */
    getGameCover(gameId: number): Promise <string[]> {

        return new Promise((resolve, reject) => {

            // // check if cover exists
            // this.custom(
            //     `SELECT ii.* FROM ${config.mysql.database}.${DbTables.covers} co
            //     JOIN ${DbTables.steam_games} ig ON ig.${DbTableSteamGamesFields[0]} = co.${DbTableCoversFields[2]}
            //     JOIN ${DbTables.steam_images} ii ON ii.${DbTableSteamImagesFields[0]} = co.${DbTableCoversFields[1]}
            //     WHERE ig.id=?`,
            //     [gameId])
            //     .then((dbResponse: GenericModelResponse) => {

            //         if (dbResponse.data.length > 0) {
            //             const cover: string = dbResponse.data;
            //             return resolve([cover]);
            //         } else {
            //             return resolve(undefined);
            //         }
            //     })
            //     .catch((err: string) => {
            //         return reject(err);
            //     });
            return resolve();

        });

    }

    /**
     * Set game screenshots in database if does not exist.
     */
    setGameScreenshots(inserted_steam_games_sys_key_id: number, screenshots: string[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // // check if screenshots exists
            // this.custom(
            //     `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.screenshots} ss
            //     JOIN ${DbTables.steam_games} ig ON ss.${DbTableScreenshotsFields[2]} = ig.${DbTableSteamGamesFields[0]}
            //     WHERE ig.${DbTableSteamGamesFields[0]}=?`,
            //     [inserted_steam_games_sys_key_id])
            //     .then((dbResponse: GenericModelResponse) => {

            //         if (dbResponse.data[0][`COUNT(*)`] !== 0) {
            //             return resolve();
            //         } else {
            //             screenshots
            //                 .forEach((screenshot: string) => {

            //                     // insert image
            //                     this.insert(
            //                         DbTables.steam_images,
            //                         DbTableSteamImagesFields.slice(1),
            //                         [screenshot],
            //                         DbTableSteamImagesFields.slice(1).map(() => "?").join(", "),
            //                         false)
            //                         .then((dbResponse: GenericModelResponse) => {
            //                             const inserted_steam_images_sys_key_id: number = dbResponse.data.insertId;
            //                             const screenshotImageColumnValues: any[] = [inserted_steam_images_sys_key_id, inserted_steam_games_sys_key_id];

            //                             // insert screenshot
            //                             this.insert(
            //                                 DbTables.screenshots,
            //                                 DbTableScreenshotsFields.slice(1),
            //                                 screenshotImageColumnValues,
            //                                 DbTableScreenshotsFields.slice(1).map(() => "?").join(", "),
            //                                 false)
            //                                 .catch((err: MysqlError) => {
            //                                     if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
            //                                         return reject(err);
            //                                     }
            //                                 });

            //                         })
            //                         .catch((err: MysqlError) => {
            //                             if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
            //                                 return reject(err);
            //                             }
            //                         });

            //                     return resolve();
            //                 });
            //         }
            //     })
            //     .catch((err: string) => {
            //         return reject(err);
            //     });
            return resolve();

        });

    }

    /**
     * Get game screenshots in database if exists.
     */
    getGameScreenshots(gameId: number): Promise <string[]> {

        return new Promise((resolve, reject) => {

            // // check if screenshots exists
            // this.custom(
            //     `SELECT ii.* FROM ${config.mysql.database}.${DbTables.screenshots} ss
            //     JOIN ${DbTables.steam_games} ig ON ig.${DbTableSteamGamesFields[0]} = ss.${DbTableScreenshotsFields[2]}
            //     JOIN ${DbTables.steam_images} ii ON ii.${DbTableSteamImagesFields[0]} = ss.${DbTableScreenshotsFields[1]}
            //     WHERE ig.id=?`,
            //     [gameId])
            //     .then((dbResponse: GenericModelResponse) => {
            //         const screenshots: string[] = [];

            //         if (dbResponse.data.length > 0) {

            //             dbResponse.data.forEach((x: any) => {
            //                 screenshots.push(x);
            //             });
            //             return resolve(screenshots);
            //         } else {
            //             return resolve(undefined);
            //         }

            //     })
            //     .catch((err: string) => {
            //         return reject(err);
            //     });
            return resolve();

        });

    }

    /**
     * Returns if a game pricings exist or not due to expiration.
     */
    gamePricingsExist(gameId: number): Promise<boolean> {

        return new Promise((resolve, reject) => {

            this.custom(
                `SELECT COUNT(*) FROM ${DbTables.pricings} pc
                JOIN ${DbTables.steam_games} ig ON ig.${DbTableSteamGamesFields[0]} = pc.${DbTablePricingsFields[3]}
                WHERE ig.${DbTableSteamGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    }

    // /**
    //  * Update game pricings. If its a new pricings insert it otherwise update record.
    //  */
    // updateGamePricings(pricings: PriceInfoResponse[]): Promise<void> {

    //     return new Promise((resolve, reject) => {

    //         if (isArray(pricings) && pricings.length === 0) {
    //             return resolve();
    //         }
    //         const pricingsVals: any[] = [];

    //         for (let i = 0; i < pricings.length; i++) {
    //             pricingsVals.push(pricings[i].externalEnum);
    //             pricingsVals.push(pricings[i].pricingEnum);
    //             pricingsVals.push(pricings[i].steamGamesSysKeyId);
    //             pricingsVals.push(pricings[i].title);
    //             pricingsVals.push(pricings[i].price);
    //             pricingsVals.push(pricings[i].discount_percent);
    //             pricingsVals.push(pricings[i].coming_soon);
    //             pricingsVals.push(pricings[i].preorder);
    //             pricingsVals.push(pricings[i].expires_dt);
    //         }

    //         this.custom(
    //             `INSERT INTO ${DbTables.pricings}
    //             (${DbTablePricingsFields.slice(1).join()})
    //             VALUES
    //             ${pricings.map(() => `(${DbTablePricingsFields.slice(1).map(() => "?").join()})`).join()}`,
    //             pricingsVals)
    //             .then(() => {
    //                 return resolve();
    //             })
    //             .catch((error: string) => {
    //                 return reject(error);
    //             });

    //     });

    // }

    /**
     * Get game genres in database if exists.
     */
    getGameGenres(gameId: number): Promise <string[]> {

        return new Promise((resolve, reject) => {

            // check if genres exists
            this.custom(
                `SELECT ge.id FROM ${config.mysql.database}.${DbTables.genres} gr
                JOIN ${DbTables.steam_games} ig ON ig.${DbTableSteamGamesFields[0]} = gr.${DbTableGenresFields[2]}
                JOIN ${DbTables.steam_genre_enum} ge ON gr.${DbTableGenresFields[1]} = ge.${DbTableSteamGenreEnumFields[0]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve(dbResponse.data);
                    } else {
                        return resolve(undefined);
                    }
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Set game genres in database if does not exist.
     */
    setGameGenres(inserted_steam_games_sys_key_id: number, genres: number[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if genres exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.genres} gr
                JOIN ${DbTables.steam_games} ig ON gr.${DbTableGenresFields[2]} = ig.${DbTableSteamGamesFields[0]}
                WHERE ig.${DbTableSteamGamesFields[0]}=?`,
                [inserted_steam_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {

                        genres.forEach((genreId: number) => {

                            this.select(
                                DbTables.steam_genre_enum,
                                DbTableSteamGenreEnumFields,
                                `${DbTableSteamGenreEnumFields[1]}=?`,
                                [genreId])
                                .then((dbResponse: GenericModelResponse) => {
                                    const steam_genre_enum_sys_key_id: number = dbResponse.data[0].steam_genre_enum_sys_key_id;
                                    const columnValues: any[] = [steam_genre_enum_sys_key_id, inserted_steam_games_sys_key_id];

                                    // insert genre
                                    this.insert(
                                        DbTables.genres,
                                        DbTableGenresFields.slice(1),
                                        columnValues,
                                        DbTableGenresFields.slice(1).map(() => "?").join(", "),
                                        false)
                                        .catch((err: MysqlError) => {
                                            if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                                return reject(err);
                                            }
                                        });

                                })
                                .catch((err: string) => {
                                    return reject(err);
                                });
                        });

                        return resolve();
                    }
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Check if route cache already exists.
     */
    routeCacheExists(path: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT COUNT(*) FROM ${DbTables.route_cache} WHERE route = ?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Get route cache from database.
     */
    getRouteCache(path: string): Promise <GameResponse[]> {

        return new Promise((resolve, reject) => {

            // getting results
            this.custom(
                `SELECT * FROM ${DbTables.route_cache} WHERE route = ?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const games: GameResponse[] = JSON.parse(dbResponse.data[0].response).data;
                        return resolve(games);
                    } else {
                        return resolve(undefined);
                    }
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Set games route cache in database if does not exist.
     */
    setRouteCache(games: GameResponse[], path: string): Promise <void> {
        const datePlus7Days: Date = new Date();
        datePlus7Days.setDate(datePlus7Days.getDate() + 7);

        return new Promise((resolve, reject) => {

            const expiresDate = new Date();
            expiresDate.setDate(expiresDate.getDate() + 7);
            const routeCache: RouteCache = { data: games };
            const columnValuesInner: any[] = [path, JSON.stringify(routeCache), expiresDate];

            // insert route
            this.custom(
                `INSERT INTO ${DbTables.route_cache} (${DbTableRouteCacheFields})
                VALUES (${DbTableRouteCacheFields.map(() => "?").join()})`,
                columnValuesInner)
                .then(() => {
                    return resolve();
                })
                .catch((err: MysqlError) => {
                    return reject(err);
                });

        });

    }

    /**
     * Check if news exists.
     */
    newsExists(path: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT COUNT(*) FROM ${DbTables.route_cache} WHERE route=?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }

                })
                .catch(() => {
                    return reject(false);
                });

        });

    }

    /**
     * Get news articles.
     */
    getNews(path: string): Promise <NewsArticle[]> {

        return new Promise((resolve, reject) => {

            // get news
            this.select(
                DbTables.route_cache,
                DbTableRouteCacheFields,
                `route = ?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const rawNewsArticles: any[] = JSON.parse(dbResponse.data[0].response).data;
                        const newsArticles: NewsArticle[] = [];

                        rawNewsArticles.forEach((rawNewsArticle: any) => {
                            const newsArticle: NewsArticle = { title: rawNewsArticle.title, author: rawNewsArticle.author, image: rawNewsArticle.image, url: rawNewsArticle.url, created_dt: rawNewsArticle.created_dt, org: rawNewsArticle.org, expires_dt: rawNewsArticle.expires_dt };
                            newsArticles.push(newsArticle);
                        });
                        return resolve(newsArticles);
                    } else {
                        return reject("Database error.");
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Set news articles.
     */
    setNews(newsArticles: NewsArticle[], path: string): Promise <void> {
        const columnValues: any[] = [];

        newsArticles.forEach((newsArticle: any) => {
            for (const key in newsArticle) {
                const value: any = newsArticle[key];
                columnValues.push(value);
            }
        });

        return new Promise((resolve, reject) => {

            // delete old news
            this.custom(
                `TRUNCATE TABLE ${DbTables.steam_news}`,
                [])
                .then(() => {

                    // insert news
                    this.custom(
                        `INSERT INTO ${DbTables.steam_news} (${DbTableSteamNewsFields.slice(1)})
                        VALUES ${newsArticles.map(() => `(${DbTableSteamNewsFields.slice(1).map(() => "?").join()})`).join()}`,
                        columnValues)
                        .then(() => {
                            const expiresDate = new Date();
                            expiresDate.setDate(expiresDate.getDate() + 7);
                            const routeCache: RouteCache = { data: newsArticles };
                            const columnValuesInner: any[] = [path, JSON.stringify(routeCache), expiresDate];

                            // insert route
                            this.custom(
                                `INSERT INTO ${DbTables.route_cache} (${DbTableRouteCacheFields})
                                VALUES (${DbTableRouteCacheFields.map(() => "?").join()})`,
                                columnValuesInner)
                                .then(() => {
                                    return resolve();
                                })
                                .catch((err: MysqlError) => {
                                    return reject(err);
                                });

                        })
                        .catch((err: MysqlError) => {
                            return reject(err);
                        });
                })
                .catch((err: MysqlError) => {
                    return reject(err);
                });

        });

    }

    /**
     * Update video cached flag.
     */
    updateVideoCached(gameId: number, videoCached: boolean): Promise <void> {

        return new Promise((resolve, reject) => {

            // update video cached
            this.update(
                DbTables.steam_games,
                `${DbTableSteamGamesFields[8]}=?`,
                [videoCached],
                `${DbTableSteamGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.affectedRows === 1) {
                        return resolve();
                    } else {
                        return reject(`Database error.`);
                    }
                })
                .catch((error: string) => {
                    return reject(`Database error. Error: ${error}`);
                });

        });

    }

    /**
     * Attempt to get a game's cover images.
     */
    getImageCoverCached(gameId: number): Promise<boolean> {

        return new Promise((resolve: any, reject: any) => {

            this.select(
                DbTables.steam_games,
                DbTableSteamGamesFields,
                `${DbTableSteamGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve(dbResponse.data[0]);
                    } else {
                        return reject(`Failed to get game.`);
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Attempt to download and cache an image to disk with a finite amount of attempts.
     */
    downloadAndSaveImage(inputPath: string, outputPath: string): Promise<boolean> {

        const pipePromise = (imageStream: any): Promise<void> => {

            return new Promise((resolve, reject) => {
                const writer: WriteStream = fs.createWriteStream(outputPath);

                writer
                .on("finish", () => {
                    writer.close();
                    return resolve();
                })
                .on("error", (error: string) => {
                    return reject(error);
                });

                imageStream.pipe(writer);
            });

        };

        return new Promise((resolve, reject) => {
            let successfulImageStream: any;

            Axios(inputPath, { method: "GET", responseType: "stream", timeout: 2000 })
            .then((response: AxiosResponse) => {
                successfulImageStream = response.data;
                pipePromise(successfulImageStream).then(() => { return resolve(true); }).catch((err: string) => { return resolve(false); });
            })
            .catch((err: AxiosError) => {
                if (err && err.response && err.response.status === 200) {
                    pipePromise(successfulImageStream).then(() => { return resolve(true); }).catch((err: string) => { return resolve(false); });
                } else {
                    return resolve(false);
                }

            });
        });
    }

    /**
     * Get similar game ids for given game id.
     */
    getGameSimilarGames(gameId: number): Promise<number[]> {

        return new Promise((resolve: any, reject: any) => {

            this.select(
                DbTables.steam_games,
                DbTableSteamGamesFields,
                `${DbTableSteamGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const steam_games_sys_key_id: number = dbResponse.data[0].steam_games_sys_key_id;

                        this.select(
                            DbTables.similar_games,
                            DbTableSimilarGamesFields,
                            `${DbTableSimilarGamesFields[1]}=?`,
                            [steam_games_sys_key_id])
                            .then((dbResponse: GenericModelResponse) => {

                                if (dbResponse.data.length > 0) {
                                    const similar_games: number[] = [];

                                    dbResponse.data.forEach((x: any) => {
                                        const similarGameId: number = x[DbTableSimilarGamesFields[2]];
                                        similar_games.push(similarGameId);
                                    });
                                    return resolve(similar_games);
                                } else {
                                    return resolve(undefined);
                                }

                            })
                            .catch((err: string) => {
                                return reject(err);
                            });

                    } else {
                        return resolve(false);
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });
    }

    /**
     * Set similar game ids for given game id.
     */
    setGameSimilarGames(gameId: number, similarGameIds: number[]): Promise<number[]> {

        return new Promise((resolve: any, reject: any) => {

            if (!similarGameIds) {
                return resolve();
            }

            this.select(
                DbTables.steam_games,
                DbTableSteamGamesFields,
                `${DbTableSteamGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const steam_games_sys_key_id: number = dbResponse.data[0].steam_games_sys_key_id;
                        const columnVals: number[] = [];

                        similarGameIds.forEach((similarGameId: number) => {
                            columnVals.push(steam_games_sys_key_id);
                            columnVals.push(similarGameId);
                        });

                        this.custom(
                            `INSERT INTO ${DbTables.similar_games}
                            (${DbTableSimilarGamesFields.slice(1).join()})
                            VALUES
                            ${similarGameIds.map(() => `(${DbTableSimilarGamesFields.slice(1).map(() => "?").join()})`).join()}`,
                            columnVals)
                            .then(() => {
                                return resolve(similarGameIds);
                            })
                            .catch((error: string) => {
                                return reject(error);
                            });

                    } else {
                        return resolve(false);
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Attempt to get a game's video preview.
     */
    getGameVideoPreview(gameId: number): Promise<boolean> {

        return new Promise((resolve: any, reject: any) => {

            this.select(
                DbTables.steam_games,
                DbTableSteamGamesFields,
                `${DbTableSteamGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const video: string = dbResponse.data[0].video;
                        const video_cached = dbResponse.data[0].video_cached;

                        if (video_cached) {
                            return resolve(video_cached);
                        } else {

                            if (video) {

                                this.setGameVideoPreview(gameId, video)
                                    .then((cached: boolean) => {
                                        return resolve(cached);
                                    })
                                    .catch((err: string) => {
                                        return reject(err);
                                    });

                            } else {
                                return resolve(false);
                            }

                        }

                    } else {
                        return reject(`Failed to get game's video.`);
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Attempt to set a game's video preview.
     */
    setGameVideoPreview(gameId: number, video: string): Promise<boolean> {
        const outputPath: string = `cache/video-previews/${gameId}.mp4`;

        const getFilesizeInBytes = (path: string): number => {
            const stats = fs.statSync(path);
            const fileSizeInBytes: number = stats.size;
            return fileSizeInBytes;
        };

        return new Promise((resolve: any, reject: any) => {

            if (!video) {
                return resolve(false);
            }

            const failedUploadCached: boolean = fs.existsSync(outputPath) && getFilesizeInBytes(outputPath) === 0;

            if (failedUploadCached) {

                this.updateVideoCached(gameId, false)
                    .then(() => {
                        fs.unlinkSync(outputPath);
                        return resolve(false);
                    })
                    .catch((err: string) => {
                        return resolve(`Failure updating video_preview! ${err}`);
                    });

            } else {

                ytdl.getInfo(video)
                    .then((videoInfo: any) => {
                        const videoLenMs: number = videoInfo.player_response.videoDetails.lengthSeconds * 1000;

                        if (videoLenMs) {
                            const captureStartTimeMs: number = videoLenMs < MAX_VIDEO_CAPTURE_LEN_MS + 3000 ? 0 : videoLenMs - MAX_VIDEO_CAPTURE_LEN_MS;
                            const writable: Writable = fs.createWriteStream(outputPath);
                            const readable: any = ytdl(video, { filter: (format: any) => format.container === "mp4", begin: captureStartTimeMs });

                            writable
                            .on(`close`, () => {
                                if (fs.existsSync(outputPath)) {
                                    fs.chmodSync(outputPath, "777");
                                }

                                this.updateVideoCached(gameId, true)
                                    .then(() => {
                                        writable.end();
                                        readable.destroy();
                                        return resolve(true);
                                    })
                                    .catch((err: string) => {
                                        console.log(`1 YTDL FATAL ERROR CAUGHT!`);
                                        writable.end();
                                        readable.destroy();
                                        return reject(`Failure updating video_preview! ${err}`);
                                    });
                            });

                            readable.on(`error`, (err: string) => {
                                console.log(`YTDL error caught for game id#${gameId}: ${err}`);
                                writable.end();
                                readable.destroy();
                                return resolve(false);
                            });

                            readable.pipe(writable);

                        } else {
                            return reject(`Failure getting video length! ${videoLenMs}`);
                        }
                    })
                    .catch((err: string) => {
                        console.log(`Failure getting video_preview meta data for #${gameId}! ${err}`);
                        return resolve(false);
                    });

            }

        });

    }

}

export const steamModel: SteamModel = new SteamModel();