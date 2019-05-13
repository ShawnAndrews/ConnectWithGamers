const fs = require("fs");
import DatabaseBase from "./../base/dbBase";
import { SQLErrorCodes, GenericModelResponse, GameResponse, IGDBImage, DbTableIGDBGamesFields, DbTableCoversFields, DbTableIGDBImagesFields, DbTableScreenshotsFields, DbTablePricingsFields, PriceInfoResponse, DbTableIconsFields, IconEnums, DbTableReleaseDatesFields, DbTablePlatformsFields, IdNamePair, DbTableGenresFields, DbTableSimilarGamesFields, DbTables, DbTableIGDBPlatformEnumFields, DbTableIGDBGenreEnumFields, DbTableIGDBExternalEnumFields, DbTableIconsEnumFields, NewsArticle, DbTableIGDBNewsFields, IGDBImageSizeEnums, IGDBImageUploadPath, DbTableRouteCacheFields, RouteCache, IGDBExternalCategoryEnum, convertIGDBExternCateEnumToSysKeyId } from "../../../client/client-server-common/common";
import { MysqlError } from "mysql";
import config from "../../../config";
import { isArray } from "util";
import * as ytdl from "ytdl-core";
import { Writable } from "stream";
import Axios, { AxiosResponse, AxiosError } from "axios";
import { WriteStream } from "fs";
import { getSteamPricings } from "./pricings/steam/main";
import { getGogPricings } from "./pricings/gog/main";
import { getMicrosoftPricings } from "./pricings/microsoft/main";
import { getApplePricings } from "./pricings/apple/main";
import { getAndroidPricings } from "./pricings/android/main";

const MAX_VIDEO_CAPTURE_LEN_MS: number = 30000;

class IGDBModel extends DatabaseBase {

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
            const gamesColumnValues: any[] = [game.id, game.name, game.aggregated_rating, game.total_rating_count, filteredSummary, game.first_release_date, game.video, game.video_cached, game.image_micro_cached, game.image_cover_big_cached, game.image_screenshot_med_cached, game.image_screenshot_big_cached, game.steam_link, game.gog_link, game.microsoft_link, game.apple_link, game.android_link, game.multiplayer_enabled];

            this.insert(
                DbTables.igdb_games,
                DbTableIGDBGamesFields.slice(1),
                gamesColumnValues,
                DbTableIGDBGamesFields.slice(1).map(() => "?").join(", "),
                false)
                .then((dbResponse: GenericModelResponse) => {
                    const inserted_igdb_games_sys_key_id: number = dbResponse.data.insertId;
                    const gamePromises: Promise<any>[] = [];
                    let videoIndex: number = -1;

                    if (game.cover) {
                        gamePromises.push(this.setGameCover(inserted_igdb_games_sys_key_id, game.cover));
                    }
                    if (game.screenshots) {
                        gamePromises.push(this.setGameScreenshots(inserted_igdb_games_sys_key_id, game.screenshots));
                    }
                    if (game.linkIcons) {
                        gamePromises.push(this.setGameIcons(inserted_igdb_games_sys_key_id, game.linkIcons));
                    }
                    if (game.release_dates) {
                        gamePromises.push(this.setGameReleaseDates(inserted_igdb_games_sys_key_id, game.release_dates));
                    }
                    if (game.platforms) {
                        gamePromises.push(this.setGamePlatforms(inserted_igdb_games_sys_key_id, game.platforms));
                    }
                    if (game.genres) {
                        gamePromises.push(this.setGameGenres(inserted_igdb_games_sys_key_id, game.genres));
                    }
                    if (game.similar_games) {
                        gamePromises.push(this.setGameSimilarGames(game.id, game.similar_games));
                    }
                    if (game.video) {
                        videoIndex = gamePromises.length;
                        gamePromises.push(this.setGameVideoPreview(game.id, game.video));
                    }

                    Promise.all(gamePromises)
                        .then((vals: any[]) => {
                            if (videoIndex !== -1) {
                                game.video_cached = vals[videoIndex];
                            }

                            // attempt images cache
                            this.attemptCacheGameImages(game.id)
                                .then((sizesCached: IGDBImageSizeEnums[]) => {

                                    sizesCached.forEach((size: IGDBImageSizeEnums) => {
                                        if (size === IGDBImageSizeEnums.micro) {
                                            game.image_micro_cached = true;
                                        } else if (size === IGDBImageSizeEnums.cover_big) {
                                            game.image_cover_big_cached = true;
                                        } else if (size === IGDBImageSizeEnums.screenshot_med) {
                                            game.image_screenshot_med_cached = true;
                                        } else if (size === IGDBImageSizeEnums.screenshot_big) {
                                            game.image_screenshot_big_cached = true;
                                        }
                                    });

                                    return this.attemptCachePricings(game.id, game.steam_link, game.gog_link, game.microsoft_link, game.apple_link, game.android_link);
                                })
                                .then((pricings: PriceInfoResponse[]) => {

                                    game.pricings = pricings;

                                    const expiresDate = new Date();
                                    expiresDate.setDate(expiresDate.getDate() + 30);
                                    const routeCache: RouteCache = { data: game };
                                    const columnValues: any[] = [path, JSON.stringify(routeCache), expiresDate];

                                    // insert route
                                    return this.custom
                                        (`INSERT INTO ${DbTables.route_cache} (${DbTableRouteCacheFields})
                                        VALUES (${DbTableRouteCacheFields.map(() => "?").join()})`,
                                        columnValues);
                                })
                                .then(() => {
                                    return resolve();
                                })
                                .catch((err: MysqlError) => {
                                    return reject(err);
                                });

                        })
                        .catch((err: MysqlError) => {
                            if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                return reject(err);
                            } else {
                                return resolve();
                            }
                        });
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
    attemptCachePricings(gameId: number, steam_link: string, gog_link: string, microsoft_link: string, apple_link: string, android_link: string): Promise <PriceInfoResponse[]> {

        const updateGamePricing = (pricing: PriceInfoResponse): Promise<void> => {

            return new Promise((resolve, reject) => {
                console.log(`Updating pricing (${pricing.externalEnum}) ${pricing.title}`);
                const pricingsVals: any[] = [pricing.externalEnum, pricing.pricingEnum, pricing.igdbGamesSysKeyId, pricing.title, pricing.price, pricing.discount_percent, pricing.coming_soon, pricing.preorder, pricing.expires_dt];

                this.custom(
                    `UPDATE ${DbTables.pricings}
                    SET ${DbTablePricingsFields.slice(1).map((x: string) => `${x} = ?`).join()}
                    WHERE ${DbTablePricingsFields[1]} = ? AND ${DbTablePricingsFields[2]} = ? AND ${DbTablePricingsFields[3]} = ? AND ${DbTablePricingsFields[4]} = ?`,
                    pricingsVals.concat([pricing.externalEnum, pricing.pricingEnum, pricing.igdbGamesSysKeyId, pricing.title]))
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
                console.log(`Adding pricing (${pricing.externalEnum}) ${pricing.title}`);
                const pricingsVals: any[] = [pricing.externalEnum, pricing.pricingEnum, pricing.igdbGamesSysKeyId, pricing.title, pricing.price, pricing.discount_percent, pricing.coming_soon, pricing.preorder, pricing.expires_dt];

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
                .then((igdb_games_sys_key_id: number) => {
                    const pricingPromises: Promise<PriceInfoResponse[]>[] = [];

                    this.getGamePricings(gameId)
                        .then((pricings: PriceInfoResponse[]) => {
                            const steamPricingExists: boolean = !pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.steam) ? false : true;
                            const gogPricingExists: boolean = !pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.gog) ? false : true;
                            const applePricingExists: boolean = !pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.apple) ? false : true;
                            const androidPricingExists: boolean = !pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.android) ? false : true;
                            const microsoftPricingExists: boolean = !pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.microsoft) ? false : true;

                            if (steam_link) {
                                pricingPromises.push(getSteamPricings(igdb_games_sys_key_id, steam_link));
                            }
                            if (gog_link) {
                                pricingPromises.push(getGogPricings(igdb_games_sys_key_id, gog_link));
                            }
                            if (microsoft_link) {
                                pricingPromises.push(getMicrosoftPricings(igdb_games_sys_key_id, microsoft_link));
                            }
                            if (apple_link) {
                                pricingPromises.push(getApplePricings(igdb_games_sys_key_id, apple_link));
                            }
                            if (android_link) {
                                pricingPromises.push(getAndroidPricings(igdb_games_sys_key_id, android_link));
                            }

                            Promise.all(pricingPromises)
                                .then((vals: PriceInfoResponse[][]) => {
                                    const pricings: PriceInfoResponse[] = [].concat(...vals);
                                    const addOrUpdatePricingsPromises: Promise<void>[] = [];
                                    console.log(`Pricing titles: ${pricings.map((x: PriceInfoResponse) => `${x.title} (${x.externalEnum})`).join(`, `)}`);
                                    pricings.forEach((pricing: PriceInfoResponse) => {
                                        if (pricing.externalEnum === convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.steam)) {
                                            addOrUpdatePricingsPromises.push(steamPricingExists ? updateGamePricing(pricing) : addGamePricing(pricing));
                                        } else if (pricing.externalEnum === convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.gog)) {
                                            addOrUpdatePricingsPromises.push(gogPricingExists ? updateGamePricing(pricing) : addGamePricing(pricing));
                                        } else if (pricing.externalEnum === convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.apple)) {
                                            addOrUpdatePricingsPromises.push(applePricingExists ? updateGamePricing(pricing) : addGamePricing(pricing));
                                        } else if (pricing.externalEnum === convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.android)) {
                                            addOrUpdatePricingsPromises.push(androidPricingExists ? updateGamePricing(pricing) : addGamePricing(pricing));
                                        } else if (pricing.externalEnum === convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.microsoft)) {
                                            addOrUpdatePricingsPromises.push(microsoftPricingExists ? updateGamePricing(pricing) : addGamePricing(pricing));
                                        }
                                    });

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
                            `SELECT ee.${DbTableIGDBExternalEnumFields[1]} as 'external_category_enum', pc.${DbTablePricingsFields[2]}, pc.${DbTablePricingsFields[4]}, pc.${DbTablePricingsFields[5]}, pc.${DbTablePricingsFields[6]}, pc.${DbTablePricingsFields[7]}, pc.${DbTablePricingsFields[8]} FROM ${DbTables.pricings} pc
                            JOIN ${DbTables.igdb_games} ig ON pc.${DbTablePricingsFields[3]} = ig.${DbTableIGDBGamesFields[0]}
                            JOIN ${DbTables.igdb_external_enum} ee ON pc.${DbTablePricingsFields[1]} = ee.${DbTableIGDBExternalEnumFields[0]}
                            WHERE ig.${DbTableIGDBGamesFields[1]}=?`,
                            [gameId])
                            .then((dbResponse: GenericModelResponse) => {
                                const pricings: PriceInfoResponse[] = [];
                                dbResponse.data.forEach((rawPricing: any) => {
                                    const pricing: PriceInfoResponse = { externalEnum: rawPricing.external_category_enum, igdbGamesSysKeyId: undefined, pricingEnum: rawPricing.pricings_enum_sys_key_id, title: rawPricing.title, price: rawPricing.price, discount_percent: rawPricing.discount_percent, coming_soon: rawPricing.coming_soon, preorder: rawPricing.preorder, expires_dt: undefined };
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
    setGameCover(inserted_igdb_games_sys_key_id: number, cover: IGDBImage): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if cover exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.covers} cv
                JOIN ${DbTables.igdb_games} ig ON cv.${DbTableCoversFields[2]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {
                        const imageColumnValues: any[] = [cover.image_id, cover.alpha_channel || 0, cover.animated || 0, cover.width, cover.height];

                        // insert image
                        this.insert(
                            DbTables.igdb_images,
                            DbTableIGDBImagesFields.slice(1),
                            imageColumnValues,
                            DbTableIGDBImagesFields.slice(1).map(() => "?").join(", "),
                            false)
                            .then((dbResponse: GenericModelResponse) => {
                                const inserted_igdb_images_sys_key_id: number = dbResponse.data.insertId;
                                const coverImageColumnValues: any[] = [inserted_igdb_images_sys_key_id, inserted_igdb_games_sys_key_id];

                                // insert cover
                                this.insert(
                                    DbTables.covers,
                                    DbTableCoversFields.slice(1),
                                    coverImageColumnValues,
                                    DbTableCoversFields.slice(1).map(() => "?").join(", "),
                                    false)
                                    .then(() => {
                                        return resolve();
                                    })
                                    .catch((err: MysqlError) => {
                                        if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                            return reject(err);
                                        } else {
                                            return resolve();
                                        }
                                    });

                            })
                            .catch((err: MysqlError) => {
                                if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                    return reject(err);
                                } else {
                                    return resolve();
                                }
                            });
                    }
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Get game's sys key id in database.
     */
    getGameSysKey(gameId: number): Promise <number> {

        return new Promise((resolve, reject) => {

            // check if cover exists
            this.custom(
                `SELECT ${DbTableIGDBGamesFields[0]} FROM ${DbTables.igdb_games} WHERE id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    const igdb_games_sys_key_id: number = dbResponse.data[0].igdb_games_sys_key_id;
                    return resolve(igdb_games_sys_key_id);
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
    getGameCover(gameId: number): Promise <IGDBImage[]> {

        return new Promise((resolve, reject) => {

            // check if cover exists
            this.custom(
                `SELECT ii.* FROM ${config.mysql.database}.${DbTables.covers} co
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = co.${DbTableCoversFields[2]}
                JOIN ${DbTables.igdb_images} ii ON ii.${DbTableIGDBImagesFields[0]} = co.${DbTableCoversFields[1]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const cover: IGDBImage = {
                            alpha_channel: Boolean(dbResponse.data[0].alpha_channel[0]),
                            animated: Boolean(dbResponse.data[0].animated[0]),
                            image_id: dbResponse.data[0].id,
                            width: dbResponse.data[0].width,
                            height: dbResponse.data[0].height,
                        };
                        return resolve([cover]);
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
     * Set game screenshots in database if does not exist.
     */
    setGameScreenshots(inserted_igdb_games_sys_key_id: number, screenshots: IGDBImage[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if screenshots exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.screenshots} ss
                JOIN ${DbTables.igdb_games} ig ON ss.${DbTableScreenshotsFields[2]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {
                        screenshots
                            .filter((screenshot: IGDBImage) => screenshot.image_id)
                            .forEach((screenshot: IGDBImage) => {
                            const imageColumnValues: any[] = [screenshot.image_id, screenshot.alpha_channel || 0, screenshot.animated || 0, screenshot.width, screenshot.height];

                            // insert image
                            this.insert(
                                DbTables.igdb_images,
                                DbTableIGDBImagesFields.slice(1),
                                imageColumnValues,
                                DbTableIGDBImagesFields.slice(1).map(() => "?").join(", "),
                                false)
                                .then((dbResponse: GenericModelResponse) => {
                                    const inserted_igdb_images_sys_key_id: number = dbResponse.data.insertId;
                                    const screenshotImageColumnValues: any[] = [inserted_igdb_images_sys_key_id, inserted_igdb_games_sys_key_id];

                                    // insert screenshot
                                    this.insert(
                                        DbTables.screenshots,
                                        DbTableScreenshotsFields.slice(1),
                                        screenshotImageColumnValues,
                                        DbTableScreenshotsFields.slice(1).map(() => "?").join(", "),
                                        false)
                                        .catch((err: MysqlError) => {
                                            if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                                return reject(err);
                                            }
                                        });

                                })
                                .catch((err: MysqlError) => {
                                    if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                        return reject(err);
                                    }
                                });

                            return resolve();
                        });
                    }
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Get game screenshots in database if exists.
     */
    getGameScreenshots(gameId: number): Promise <IGDBImage[]> {

        return new Promise((resolve, reject) => {

            // check if screenshots exists
            this.custom(
                `SELECT ii.* FROM ${config.mysql.database}.${DbTables.screenshots} ss
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = ss.${DbTableScreenshotsFields[2]}
                JOIN ${DbTables.igdb_images} ii ON ii.${DbTableIGDBImagesFields[0]} = ss.${DbTableScreenshotsFields[1]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    const screenshots: IGDBImage[] = [];

                    if (dbResponse.data.length > 0) {

                        dbResponse.data.forEach((x: any) => {
                            const screenshot: IGDBImage = {
                                alpha_channel: x.alpha_channel[0],
                                animated: x.animated[0],
                                image_id: x.id,
                                width: x.width,
                                height: x.height,
                            };
                            screenshots.push(screenshot);
                        });
                        return resolve(screenshots);
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
     * Returns if a game pricings exist or not due to expiration.
     */
    gamePricingsExist(gameId: number): Promise<boolean> {

        return new Promise((resolve, reject) => {

            this.custom(
                `SELECT COUNT(*) FROM ${DbTables.pricings} pc
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = pc.${DbTablePricingsFields[3]}
                WHERE ig.${DbTableIGDBGamesFields[1]}=?`,
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
    //             pricingsVals.push(pricings[i].igdbGamesSysKeyId);
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
     * Set game icons in database if does not exist.
     */
    setGameIcons(inserted_igdb_games_sys_key_id: number, icons: string[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if icons exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.icons} ic
                JOIN ${DbTables.igdb_games} ig ON ic.${DbTableIconsFields[2]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {

                        icons.forEach((icon: string) => {
                            let iconId: number = undefined;

                            for (const iconEnum in IconEnums) {
                                if (iconEnum === icon) {
                                    iconId = parseInt(IconEnums[iconEnum]);
                                }
                            }

                            this.select(
                                DbTables.icons_enum,
                                DbTableIconsEnumFields,
                                `${DbTableIconsEnumFields[1]}=?`,
                                [iconId])
                                .then((dbResponse: GenericModelResponse) => {
                                    const icons_enum_sys_key_id: number = dbResponse.data[0].icons_enum_sys_key_id;
                                    const imageColumnValues: number[] = [icons_enum_sys_key_id, inserted_igdb_games_sys_key_id];

                                    // insert icon
                                    this.insert(
                                        DbTables.icons,
                                        DbTableIconsFields.slice(1),
                                        imageColumnValues,
                                        DbTableIconsFields.slice(1).map(() => "?").join(", "),
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
     * Get game icons in database if exists.
     */
    getGameIcons(gameId: number): Promise <string[]> {

        return new Promise((resolve, reject) => {

            // check if icons exists
            this.custom(
                `SELECT ie.${DbTableIconsEnumFields[2]} FROM ${config.mysql.database}.${DbTables.icons} ic
                JOIN ${DbTables.icons_enum} ie ON ie.${DbTableIconsEnumFields[0]} = ic.${DbTableIconsFields[1]}
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = ic.${DbTableIconsFields[2]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const icons: string[] = dbResponse.data.map((icon: any) => icon.name);
                        return resolve(icons);
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
     * Get game release dates in database if exists.
     */
    getGameReleaseDates(gameId: number): Promise <number[]> {

        return new Promise((resolve, reject) => {

            // check if icons exists
            this.custom(
                `SELECT rd.${DbTableReleaseDatesFields[1]} FROM ${config.mysql.database}.${DbTables.release_dates} rd
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = rd.${DbTableReleaseDatesFields[2]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const releaseDates: number[] = dbResponse.data.map((releaseDate: any) => releaseDate.release_date_ts);
                        return resolve(releaseDates);
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
     * Set game release dates in database if does not exist.
     */
    setGameReleaseDates(inserted_igdb_games_sys_key_id: number, releaseDates: number[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if release date exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.release_dates} rd
                JOIN ${DbTables.igdb_games} ig ON rd.${DbTableReleaseDatesFields[2]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {
                        releaseDates.forEach((releaseDate: number) => {
                            const columnValues: any[] = [releaseDate, inserted_igdb_games_sys_key_id];

                            // insert release date
                            this.insert(
                                DbTables.release_dates,
                                DbTableReleaseDatesFields.slice(1),
                                columnValues,
                                DbTableReleaseDatesFields.slice(1).map(() => "?").join(", "),
                                false)
                                .catch((err: MysqlError) => {
                                    if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                        return reject(err);
                                    }
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
     * Get game platforms in database if exists.
     */
    getGamePlatforms(gameId: number): Promise <number[]> {

        return new Promise((resolve, reject) => {

            // check if platforms exists
            this.custom(
                `SELECT pe.id FROM ${config.mysql.database}.${DbTables.platforms} pl
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = pl.${DbTablePlatformsFields[2]}
                JOIN ${DbTables.igdb_platform_enum} pe ON pl.${DbTablePlatformsFields[1]} = pe.${DbTableIGDBPlatformEnumFields[0]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const platforms: number[] = dbResponse.data.map((platform: any) => platform.id);
                        return resolve(platforms);
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
     * Set game platforms in database if does not exist.
     */
    setGamePlatforms(inserted_igdb_games_sys_key_id: number, platforms: number[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if platforms exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.platforms} pl
                JOIN ${DbTables.igdb_games} ig ON pl.${DbTablePlatformsFields[2]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {

                        platforms.forEach((platformId: number) => {

                            this.select(
                                DbTables.igdb_platform_enum,
                                DbTableIGDBPlatformEnumFields,
                                `${DbTableIGDBPlatformEnumFields[1]}=?`,
                                [platformId])
                                .then((dbResponse: GenericModelResponse) => {
                                    const igdb_platform_enum_sys_key_id: number = dbResponse.data[0].igdb_platform_enum_sys_key_id;
                                    const columnValues: any[] = [igdb_platform_enum_sys_key_id, inserted_igdb_games_sys_key_id];

                                    // insert platform
                                    this.insert(
                                        DbTables.platforms,
                                        DbTablePlatformsFields.slice(1),
                                        columnValues,
                                        DbTablePlatformsFields.slice(1).map(() => "?").join(", "),
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
     * Get game genres in database if exists.
     */
    getGameGenres(gameId: number): Promise <number[]> {

        return new Promise((resolve, reject) => {

            // check if genres exists
            this.custom(
                `SELECT ge.id FROM ${config.mysql.database}.${DbTables.genres} gr
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = gr.${DbTableGenresFields[2]}
                JOIN ${DbTables.igdb_genre_enum} ge ON gr.${DbTableGenresFields[1]} = ge.${DbTableIGDBGenreEnumFields[0]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const genres: number[] = dbResponse.data.map((genre: any) => genre.id);
                        return resolve(genres);
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
    setGameGenres(inserted_igdb_games_sys_key_id: number, genres: number[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if genres exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.genres} gr
                JOIN ${DbTables.igdb_games} ig ON gr.${DbTableGenresFields[2]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {

                        genres.forEach((genreId: number) => {

                            this.select(
                                DbTables.igdb_genre_enum,
                                DbTableIGDBGenreEnumFields,
                                `${DbTableIGDBGenreEnumFields[1]}=?`,
                                [genreId])
                                .then((dbResponse: GenericModelResponse) => {
                                    const igdb_genre_enum_sys_key_id: number = dbResponse.data[0].igdb_genre_enum_sys_key_id;
                                    const columnValues: any[] = [igdb_genre_enum_sys_key_id, inserted_igdb_games_sys_key_id];

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
                `TRUNCATE TABLE ${DbTables.igdb_news}`,
                [])
                .then(() => {

                    // insert news
                    this.custom(
                        `INSERT INTO ${DbTables.igdb_news} (${DbTableIGDBNewsFields.slice(1)})
                        VALUES ${newsArticles.map(() => `(${DbTableIGDBNewsFields.slice(1).map(() => "?").join()})`).join()}`,
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
                DbTables.igdb_games,
                `${DbTableIGDBGamesFields[8]}=?`,
                [videoCached],
                `${DbTableIGDBGamesFields[1]}=?`,
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
    getImageCoverCached(gameId: number, size: IGDBImageSizeEnums): Promise<boolean> {

        return new Promise((resolve: any, reject: any) => {

            this.select(
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const image_cached = dbResponse.data[0][`image_${size}_cached`];
                        return resolve(image_cached);
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
     * Attempt to cache a game's images, if not already cached. Optional parameters to skip cacheing already cached sizes.
     */
    attemptCacheGameImages(gameId: number, imageIndicicesCached?: number[], imageSizesCached?: IGDBImageSizeEnums[]): Promise <IGDBImageSizeEnums[]> {
        const imageCachedTableIndices: number[] = imageIndicicesCached || [9, 10, 11, 12];
        const imageCachedTableIndicesSizes: IGDBImageSizeEnums[] = imageSizesCached || [IGDBImageSizeEnums.micro, IGDBImageSizeEnums.cover_big, IGDBImageSizeEnums.screenshot_med, IGDBImageSizeEnums.screenshot_big];

        const attemptImageSizeCache = (size: IGDBImageSizeEnums, imageTableIndex: number): Promise<boolean> => {

            return new Promise((resolve, reject) => {
                const getImages = (size === IGDBImageSizeEnums.micro || size === IGDBImageSizeEnums.cover_big) ? this.getGameCover.bind(this) : this.getGameScreenshots.bind(this);

                getImages(gameId)
                    .then((images: IGDBImage[]) => {
                        const downloadPromises: Promise<boolean>[] = [];
                        if (!images) {
                            return resolve();
                        }

                        images.forEach((image: IGDBImage) => {
                            const outputPath: string = `cache/image-cacheing/${size}/${image.image_id}.jpg`;
                            const inputPath: string = `${IGDBImageUploadPath}/t_${size}/${image.image_id}.jpg`;
                            downloadPromises.push(this.downloadAndSaveImage(inputPath, outputPath));
                        });

                        Promise.all(downloadPromises)
                            .then((vals: boolean[]) => {
                                let successfullyDownloadedAllImages: boolean = true;

                                vals.forEach((successfullyDownloadedImage: boolean) => {
                                    if (!successfullyDownloadedImage) {
                                        successfullyDownloadedAllImages = false;
                                    }
                                });

                                this.update(
                                    DbTables.igdb_games,
                                    `${DbTableIGDBGamesFields[imageTableIndex]}=?`,
                                    [successfullyDownloadedAllImages],
                                    `${DbTableIGDBGamesFields[1]}=?`,
                                    [gameId])
                                    .then((dbResponse: GenericModelResponse) => {
                                        if (dbResponse.data.affectedRows === 1) {
                                            return resolve(successfullyDownloadedAllImages);
                                        } else {
                                            return reject(`Database error.`);
                                        }
                                    })
                                    .catch((err: string) => {
                                        return reject(`Failed to update image_cached for ${size} on #${gameId}: ${err}`);
                                    });
                            })
                            .catch((err: string) => {
                                // log err
                                return resolve(false);
                            });

                    })
                    .catch((err: string) => {
                        return reject(err);
                    });

            });

        };

        return new Promise((resolve, reject) => {

            this.select(
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const imagePromises: Promise<boolean>[] = [];
                        const attemptedSizesToCache: IGDBImageSizeEnums[] = [];

                        imageCachedTableIndicesSizes.forEach((size: IGDBImageSizeEnums, index: number) => {
                            const imageSizeCached: boolean = dbResponse.data[0][`image_${imageCachedTableIndicesSizes[index]}_cached`];
                            if (!imageSizeCached) {
                                imagePromises.push(attemptImageSizeCache(imageCachedTableIndicesSizes[index], imageCachedTableIndices[index]));
                                attemptedSizesToCache.push(imageCachedTableIndicesSizes[index]);
                            }
                        });

                        Promise.all(imagePromises)
                            .then((vals: boolean[]) => {
                                const sizesCached: IGDBImageSizeEnums[] = [];
                                vals.forEach((isCached: boolean, index: number) => {
                                    if (isCached) {
                                        sizesCached.push(attemptedSizesToCache[index]);
                                    }
                                });

                                // update cached image size flags, if available
                                this.custom(
                                    `SELECT * FROM ${DbTables.route_cache}
                                    WHERE route = ?`,
                                    [`/game/${gameId}`])
                                    .then((dbResponse: GenericModelResponse) => {

                                        if (dbResponse.data.length > 0) {
                                            const game: GameResponse = JSON.parse(dbResponse.data[0].response).data;

                                            sizesCached.forEach((size: IGDBImageSizeEnums) => {
                                                if (size === IGDBImageSizeEnums.micro) {
                                                    game.image_micro_cached = true;
                                                } else if (size === IGDBImageSizeEnums.cover_big) {
                                                    game.image_cover_big_cached = true;
                                                } else if (size === IGDBImageSizeEnums.screenshot_med) {
                                                    game.image_screenshot_med_cached = true;
                                                } else if (size === IGDBImageSizeEnums.screenshot_big) {
                                                    game.image_screenshot_big_cached = true;
                                                }
                                            });

                                            const updatedRouteCache: RouteCache = { data: game };

                                            this.custom(
                                                `UPDATE ${DbTables.route_cache}
                                                SET response = ?
                                                WHERE route = ?`,
                                                [JSON.stringify(updatedRouteCache), `/game/${gameId}`])
                                                .then(() => {
                                                    return resolve(sizesCached);
                                                })
                                                .catch((err: string) => {
                                                    return reject(err);
                                                });

                                        } else {
                                            return resolve(sizesCached);
                                        }

                                    })
                                    .catch((err: string) => {
                                        return reject(err);
                                    });

                            })
                            .catch((err: string) => {
                                return reject(err);
                            });

                    } else {
                        return reject();
                    }

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Attempt to get a game's screenshot images.
     */
    getImageScreenshotsCached(gameId: number, size: IGDBImageSizeEnums): Promise<boolean> {

        let imageCachedIndex: number;

        if (size === IGDBImageSizeEnums.screenshot_med) {
            imageCachedIndex = 11;
        } else if (size === IGDBImageSizeEnums.screenshot_big) {
            imageCachedIndex = 12;
        }

        return new Promise((resolve: any, reject: any) => {

            this.select(
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const image_cached = dbResponse.data[0][`image_${size}_cached`];
                        return resolve(image_cached);
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
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const igdb_games_sys_key_id: number = dbResponse.data[0].igdb_games_sys_key_id;

                        this.select(
                            DbTables.similar_games,
                            DbTableSimilarGamesFields,
                            `${DbTableSimilarGamesFields[1]}=?`,
                            [igdb_games_sys_key_id])
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
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const igdb_games_sys_key_id: number = dbResponse.data[0].igdb_games_sys_key_id;
                        const columnVals: number[] = [];

                        similarGameIds.forEach((similarGameId: number) => {
                            columnVals.push(igdb_games_sys_key_id);
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
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
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

export const igdbModel: IGDBModel = new IGDBModel();