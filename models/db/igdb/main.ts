const fs = require("fs");
import DatabaseBase from "./../base/dbBase";
import { SQLErrorCodes, GenericModelResponse, GameResponse, IGDBImage, DbTableIGDBGamesFields, DbTableCoversFields, DbTableIGDBImagesFields, DbTableScreenshotsFields, DbTablePricingsFields, PriceInfoResponse, DbTableIconsFields, IconEnums, DbTableReleaseDatesFields, DbTablePlatformsFields, IdNamePair, DbTableGenresFields, DbTableResultsFields, ResultsEnum, DbTableSimilarGamesFields, DbTables, DbTableIGDBPlatformEnumFields, DbTableIGDBGenreEnumFields, DbTableIGDBExternalEnumFields, DbTableIconsEnumFields, NewsArticle, DbTableIGDBNewsFields, IGDBImageSizeEnums, IGDBImageUploadPath } from "../../../client/client-server-common/common";
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
    gameExists(igdbId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.select(
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [igdbId])
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
    setGame(game: GameResponse): Promise<void> {

        return new Promise((resolve, reject) => {
            const filteredSummary: string = game.summary.replace(/[^\x00-\x7F]/g, ""); // remove non-ascii
            const gamesColumnValues: any[] = [game.id, game.name, game.aggregated_rating, game.total_rating_count, filteredSummary, game.first_release_date, game.video, game.video_cached, game.image_cover_micro_cached, game.image_cover_big_cached, game.image_screenshot_med_cached, game.image_screenshot_big_cached, game.steam_link, game.gog_link, game.microsoft_link, game.apple_link, game.android_link, game.multiplayer_enabled];

            this.insert(
                DbTables.igdb_games,
                DbTableIGDBGamesFields.slice(1),
                gamesColumnValues,
                DbTableIGDBGamesFields.slice(1).map(() => "?").join(", "),
                false)
                .then((dbResponse: GenericModelResponse) => {
                    const inserted_igdb_games_sys_key_id: number = dbResponse.data.insertId;
                    const gamePromises: Promise<any>[] = [];

                    if (game.cover) {
                        gamePromises.push(this.setGameCover(inserted_igdb_games_sys_key_id, game.cover));
                        gamePromises.push(this.setImageCoverCached(inserted_igdb_games_sys_key_id, IGDBImageSizeEnums.micro));
                        gamePromises.push(this.setImageCoverCached(inserted_igdb_games_sys_key_id, IGDBImageSizeEnums.cover_big));
                    }
                    if (game.screenshots) {
                        gamePromises.push(this.setGameScreenshots(inserted_igdb_games_sys_key_id, game.screenshots));
                        gamePromises.push(this.setImageScreenshotsCached(inserted_igdb_games_sys_key_id, IGDBImageSizeEnums.screenshot_med));
                        gamePromises.push(this.setImageScreenshotsCached(inserted_igdb_games_sys_key_id, IGDBImageSizeEnums.screenshot_big));
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
                        gamePromises.push(this.setGameVideoPreview(game.id, game.video));
                    }
                    if (game.steam_link || game.gog_link || game.microsoft_link || game.apple_link || game.android_link) {
                        gamePromises.push(this.setGamePricings(game.id, game.steam_link, game.gog_link, game.microsoft_link, game.apple_link, game.android_link));
                    }

                    Promise.all(gamePromises)
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

        });

    }

    /**
     * Get game from database.
     */
    getGame(gameId: number): Promise <GameResponse> {

        return new Promise((resolve, reject) => {
            const gamePromises: Promise<any>[] = [this.getGameCover(gameId), this.getGameScreenshots(gameId), this.getGameIcons(gameId), this.getGameReleaseDates(gameId), this.getGamePlatforms(gameId), this.getGameGenres(gameId), this.getGameSimilarGames(gameId), this.getGameVideoPreview(gameId), this.getImageCoverCached(gameId, IGDBImageSizeEnums.micro), this.getImageCoverCached(gameId, IGDBImageSizeEnums.cover_big), this.getImageScreenshotsCached(gameId, IGDBImageSizeEnums.screenshot_med), this.getImageScreenshotsCached(gameId, IGDBImageSizeEnums.screenshot_big), this.getGamePricings(gameId)];
            let cover: IGDBImage = undefined;
            let screenshots: IGDBImage[] = undefined;
            let linkIcons: string[] = undefined;
            let releaseDates: number[] = undefined;
            let platforms: number[] = undefined;
            let genres: number[] = undefined;
            let pricings: PriceInfoResponse[] = undefined;
            let similar_games: number[] = undefined;
            let video_cached: boolean = undefined;
            let image_cover_micro_cached: boolean = undefined;
            let image_cover_big_cached: boolean = undefined;
            let image_screenshot_med_cached: boolean = undefined;
            let image_screenshot_big_cached: boolean = undefined;

            Promise.all(gamePromises)
                .then((vals: any) => {
                    cover = vals[0];
                    screenshots = vals[1];
                    linkIcons = vals[2];
                    releaseDates = vals[3];
                    platforms = vals[4];
                    genres = vals[5];
                    similar_games = vals[6];
                    video_cached = vals[7];
                    image_cover_micro_cached = vals[8];
                    image_cover_big_cached = vals[9];
                    image_screenshot_med_cached = vals[10];
                    image_screenshot_big_cached = vals[11];
                    pricings = vals[12];

                    // get game
                    this.select(
                        DbTables.igdb_games,
                        DbTableIGDBGamesFields,
                        `${DbTableIGDBGamesFields[1]}=?`,
                        [gameId])
                        .then((dbResponse: GenericModelResponse) => {
                            if (dbResponse.data.length > 0) {
                                const game: GameResponse = {
                                    id: dbResponse.data[0].id,
                                    name: dbResponse.data[0].name,
                                    aggregated_rating: dbResponse.data[0].aggregated_rating,
                                    total_rating_count: dbResponse.data[0].total_rating_count,
                                    summary: dbResponse.data[0].summary,
                                    first_release_date: Number(dbResponse.data[0].first_release_date),
                                    video: dbResponse.data[0].video,
                                    cover: cover,
                                    linkIcons: linkIcons,
                                    release_dates: releaseDates,
                                    screenshots: screenshots,
                                    genres: genres,
                                    platforms: platforms,
                                    video_cached: video_cached,
                                    image_cover_micro_cached: image_cover_micro_cached,
                                    image_cover_big_cached: image_cover_big_cached,
                                    image_screenshot_med_cached: image_screenshot_med_cached,
                                    image_screenshot_big_cached: image_screenshot_big_cached,
                                    steam_link: dbResponse.data[0].steam_link,
                                    gog_link: dbResponse.data[0].gog_link,
                                    microsoft_link: dbResponse.data[0].microsoft_link,
                                    apple_link: dbResponse.data[0].apple_link,
                                    android_link: dbResponse.data[0].android_link,
                                    pricings: pricings,
                                    multiplayer_enabled: dbResponse.data[0].multiplayer_enabled,
                                    similar_games: similar_games
                                };

                                return resolve(game);

                            } else {
                                return reject(`Game not found in database with id #${gameId}`);
                            }
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
     * Set game's pricings.
     */
    setGamePricings(gameId: number, steam_link: string, gog_link: string, microsoft_link: string, apple_link: string, android_link: string): Promise <PriceInfoResponse[]> {

        return new Promise((resolve, reject) => {

            this.getGameSysKey(gameId)
                .then((sys_key_id: number) => {
                    const igdb_games_sys_key_id: number = sys_key_id;
                    const pricingPromises: Promise<PriceInfoResponse[]>[] = [];

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

                            this.addGamePricings(pricings)
                                .then(() => {
                                    return resolve(pricings);
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

                        this.select(
                            DbTables.igdb_games,
                            DbTableIGDBGamesFields,
                            `${DbTableIGDBGamesFields[1]}=?`,
                            [gameId])
                            .then((dbResponse: GenericModelResponse) => {

                                if (dbResponse.data.length > 0) {
                                    const steam_link: string = dbResponse.data[0].steam_link;
                                    const gog_link: string = dbResponse.data[0].gog_link;
                                    const microsoft_link: string = dbResponse.data[0].microsoft_link;
                                    const apple_link: string = dbResponse.data[0].apple_link;
                                    const android_link: string = dbResponse.data[0].android_link;

                                    this.setGamePricings(gameId, steam_link, gog_link, microsoft_link, apple_link, android_link)
                                        .then((pricings: PriceInfoResponse[]) => {
                                            return resolve(pricings);
                                        })
                                        .catch((err: string) => {
                                            return reject(err);
                                        });

                                } else {
                                    return reject(`Failed to get game.`);
                                }

                            })
                            .catch((err: string) => {
                                return reject(err);
                            });

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
    getGameCover(gameId: number): Promise <IGDBImage> {

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
                        return resolve(cover);
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

    /**
     * Check if game's pricing is expired.
     */
    addGamePricings(pricings: PriceInfoResponse[]): Promise<void> {

        return new Promise((resolve, reject) => {

            if (isArray(pricings) && pricings.length === 0) {
                return resolve();
            }
            const pricingsVals: any[] = [];

            for (let i = 0; i < pricings.length; i++) {
                pricingsVals.push(pricings[i].externalEnum);
                pricingsVals.push(pricings[i].pricingEnum);
                pricingsVals.push(pricings[i].igdbGamesSysKeyId);
                pricingsVals.push(pricings[i].title);
                pricingsVals.push(pricings[i].price);
                pricingsVals.push(pricings[i].discount_percent);
                pricingsVals.push(pricings[i].coming_soon);
                pricingsVals.push(pricings[i].preorder);
                pricingsVals.push(pricings[i].expires_dt);
            }

            this.custom(
                `INSERT INTO ${DbTables.pricings}
                (${DbTablePricingsFields.slice(1).join()})
                VALUES
                ${pricings.map(() => `(${DbTablePricingsFields.slice(1).map(() => "?").join()})`).join()}`,
                pricingsVals)
                .then(() => {
                    return resolve();
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    }

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
     * Check if results already exists.
     */
    resultsExists(resultsEnum: ResultsEnum, param?: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.results} rs
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = rs.${DbTableResultsFields[2]}
                WHERE rs.${DbTableResultsFields[1]}=? AND rs.${DbTableResultsFields[3]}${!param ? " IS " : "="}?`,
                [resultsEnum, param])
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
     * Get results from database.
     */
    getResults(resultsEnum: ResultsEnum, param?: string): Promise <number[]> {

        return new Promise((resolve, reject) => {

            // getting results
            this.custom(
                `SELECT ig.${DbTableIGDBGamesFields[1]} FROM ${config.mysql.database}.${DbTables.results} rs
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = rs.${DbTableResultsFields[2]}
                WHERE rs.${DbTableResultsFields[1]}=? AND rs.${DbTableResultsFields[3]}${!param ? " IS " : "="}?`,
                [resultsEnum, param])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const gameIds: number[] = dbResponse.data.map((result: any) => result.id);
                        return resolve(gameIds);
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
     * Set game results in database if does not exist.
     */
    setResults(gameIds: number[], resultsEnum: ResultsEnum, param?: string): Promise <void> {
        const datePlus7Days: Date = new Date();
        datePlus7Days.setDate(datePlus7Days.getDate() + 7);

        return new Promise((resolve, reject) => {

            // cacheing results
            gameIds.forEach((gameId: number) => {
                const columnValues: any[] = [resultsEnum, gameId, param, datePlus7Days];

                // insert result
                this.custom(
                    `INSERT INTO ${DbTables.results} (${DbTableResultsFields.slice(1)}) VALUES (?, (SELECT ig.${DbTableIGDBGamesFields[0]} FROM ${DbTables.igdb_games} ig WHERE ig.${DbTableIGDBGamesFields[1]}=?), ?, ?)`,
                    columnValues)
                    .catch((err: MysqlError) => {
                        if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                            return reject(err);
                        }
                    });
            });

            return resolve();

        });

    }

    /**
     * Check if news exists.
     */
    newsExists(): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.igdb_news}`,
                [])
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
    getNews(): Promise <NewsArticle[]> {

        return new Promise((resolve, reject) => {

            // get news
            this.select(
                DbTables.igdb_news,
                DbTableIGDBNewsFields,
                undefined,
                [])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const newsArticles: NewsArticle[] = [];

                        dbResponse.data.forEach((rawNewsArticle: any) => {
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
    setNews(newsArticles: NewsArticle[]): Promise <void> {
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
                            return resolve();
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

                        if (image_cached) {
                            return resolve(image_cached);
                        } else {

                            this.setImageCoverCached(gameId, size)
                            .then((cached: boolean) => {
                                return resolve(cached);
                            })
                            .catch((err: string) => {
                                return reject(err);
                            });

                        }

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
     * Attempt to set and cache cover image.
     */
    setImageCoverCached(gameId: number, size: IGDBImageSizeEnums): Promise <boolean> {

        let imageCachedIndex: number;

        if (size === IGDBImageSizeEnums.micro) {
            imageCachedIndex = 9;
        } else if (size === IGDBImageSizeEnums.cover_big) {
            imageCachedIndex = 10;
        }

        return new Promise((resolve, reject) => {

            this.select(
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const image_cached: boolean = dbResponse.data[0][`image_${size}_cached`];
                        if (image_cached) {
                            return resolve(true);
                        }

                        this.getGameCover(gameId)
                            .then((cover: IGDBImage) => {

                                if (!cover) {
                                    return resolve(false);
                                }

                                const downloadPromises: Promise<void>[] = [];
                                const outputPath: string = `cache/image-cacheing/${size}/${cover.image_id}.jpg`;
                                const inputPath: string = `${IGDBImageUploadPath}/t_${size}/${cover.image_id}.jpg`;

                                downloadPromises.push(this.downloadAndSaveImage(inputPath, outputPath));

                                Promise.all(downloadPromises)
                                    .then(() => {

                                        this.update(
                                            DbTables.igdb_games,
                                            `${DbTableIGDBGamesFields[imageCachedIndex]}=?`,
                                            [true],
                                            `${DbTableIGDBGamesFields[1]}=?`,
                                            [gameId])
                                            .then((dbResponse: GenericModelResponse) => {
                                                if (dbResponse.data.affectedRows === 1) {
                                                    return resolve(true);
                                                } else {
                                                    return reject(`Database error.`);
                                                }
                                            })
                                            .catch((err: string) => {
                                                return reject(`Failed to update image_cached for ${size} on #${gameId}: ${err}`);
                                            });
                                    })
                                    .catch((err: string) => {
                                        return resolve(false);
                                    });

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

                        if (image_cached) {
                            return resolve(image_cached);
                        } else {

                            this.setImageScreenshotsCached(gameId, size)
                            .then((cached: boolean) => {
                                return resolve(cached);
                            })
                            .catch((err: string) => {
                                return reject(err);
                            });

                        }

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
     * Attempt to set and cache screenshot images.
     */
    setImageScreenshotsCached(gameId: number, size: IGDBImageSizeEnums): Promise <boolean> {

        let imageCachedIndex: number;

        if (size === IGDBImageSizeEnums.screenshot_med) {
            imageCachedIndex = 11;
        } else if (size === IGDBImageSizeEnums.screenshot_big) {
            imageCachedIndex = 12;
        }

        return new Promise((resolve, reject) => {

            this.select(
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const image_cached: boolean = dbResponse.data[0][`image_${size}_cached`];

                        if (image_cached) {
                            return resolve(true);
                        }

                        this.getGameScreenshots(gameId)
                            .then((screenshots: IGDBImage[]) => {

                                if (screenshots && screenshots.length === 0) {
                                    return resolve(false);
                                }

                                const downloadPromises: Promise<void>[] = [];

                                screenshots.forEach((screenshot: IGDBImage) => {
                                    const outputPath: string = `cache/image-cacheing/${size}/${screenshot.image_id}.jpg`;
                                    const inputPath: string = `${IGDBImageUploadPath}/t_${size}/${screenshot.image_id}.jpg`;
                                    downloadPromises.push(this.downloadAndSaveImage(inputPath, outputPath));
                                });

                                Promise.all(downloadPromises)
                                    .then(() => {

                                        this.update(
                                            DbTables.igdb_games,
                                            `${DbTableIGDBGamesFields[imageCachedIndex]}=?`,
                                            [true],
                                            `${DbTableIGDBGamesFields[1]}=?`,
                                            [gameId])
                                            .then((dbResponse: GenericModelResponse) => {
                                                if (dbResponse.data.affectedRows === 1) {
                                                    return resolve(true);
                                                } else {
                                                    return reject(`Database error.`);
                                                }
                                            })
                                            .catch((err: string) => {
                                                return reject(`Failed to update image_cached for ${size} on #${gameId}: ${err}`);
                                            });
                                    })
                                    .catch((err: string) => {
                                        return resolve(false);
                                    });

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
     * Attempt to download and cache an image to disk with a finite amount of attempts.
     */
    downloadAndSaveImage(inputPath: string, outputPath: string): Promise<void> {

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
            const successError: AxiosError = { response: { status: 200, data: undefined, statusText: undefined, headers: undefined, config: undefined }, config: undefined, name: undefined, message: undefined };
            let successfulImageStream: any;

            Axios(inputPath, { method: "GET", responseType: "stream", timeout: 2000 })
            .then((response: AxiosResponse) => {
                successfulImageStream = response.data;
                throw(successError);
            })
            .catch((err: AxiosError) => {
                if (err && err.response && err.response.status === 200) {
                    pipePromise(successfulImageStream).then(() => { return resolve(); }).catch((err: string) => { return reject(); });
                } else {
                    if (inputPath.startsWith("https://images.igdb.com")) {
                        return reject(`IGDB problem getting image: ${inputPath}`);
                    }
                    return resolve();
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
    setGameSimilarGames(gameId: number, similarGameIds: number[]): Promise<void> {

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
                                return resolve();
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
                        const videoLenMs: number = videoInfo.player_response.streamingData.formats.length > 0 && videoInfo.player_response.streamingData.formats[0].approxDurationMs;

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