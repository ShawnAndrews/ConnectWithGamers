import DatabaseBase from "./../base/dbBase";
import { SQLErrorCodes, GenericModelResponse, GameResponse, IGDBImage, DbTableIGDBGamesFields, DbTableCoversFields, DbTableIGDBImagesFields, DbTableScreenshotsFields, GameExternalInfo, DbTablePricingsFields, ExternalInfo, IGDBExternalCategoryEnum, PriceInfoResponse, DbTableIconsFields, IconEnums, DbTableReleaseDatesFields, DbTablePlatformsFields, IdNamePair, DbTableGenresFields, DbTableResultsFields, ResultsEnum, SimilarGame, DbTableSimilarGamesFields, DbTables, DbTableIGDBPlatformEnumFields, DbTableIGDBGenreEnumFields, DbTableIGDBExternalEnumFields, DbTableIconsEnumFields, ServiceWorkerEnums } from "../../../client/client-server-common/common";
import { steamAPIGetPriceInfo } from "../../../util/main";
import { MysqlError } from "mysql";
import config from "../../../config";
import { addTaskToWorker } from "../../../service-workers/main";

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
            const gamesColumnValues: any[] = [game.id, game.name, game.aggregated_rating, game.total_rating_count, game.summary, game.first_release_date, game.video, game.video_cached];

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
                    }
                    if (game.screenshots) {
                        gamePromises.push(this.setGameScreenshots(inserted_igdb_games_sys_key_id, game.screenshots));
                    }
                    if (game.external) {
                        gamePromises.push(this.setGamePricing(inserted_igdb_games_sys_key_id, game.external));
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
                        gamePromises.push(this.setGameSimilarGames(inserted_igdb_games_sys_key_id, game.similar_games));
                    }

                    Promise.all(gamePromises)
                        .then(() => {
                            resolve();
                            addTaskToWorker(game.id, ServiceWorkerEnums.video_previews);
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
            const gamePromises: Promise<any>[] = [this.getGameCover(gameId), this.getGameScreenshots(gameId), this.getGamePricing(gameId), this.getGameIcons(gameId), this.getGameReleaseDates(gameId), this.getGamePlatforms(gameId), this.getGameGenres(gameId), this.getGameSimilarGames(gameId)];
            let cover: IGDBImage = undefined;
            let screenshots: IGDBImage[] = undefined;
            let pricing: GameExternalInfo = undefined;
            let linkIcons: string[] = undefined;
            let releaseDates: number[] = undefined;
            let platforms: number[] = undefined;
            let genres: number[] = undefined;
            let similar_games: SimilarGame[] = undefined;

            Promise.all(gamePromises)
                .then((vals: any) => {
                    cover = vals[0];
                    screenshots = vals[1];
                    pricing = vals[2];
                    linkIcons = vals[3];
                    releaseDates = vals[4];
                    platforms = vals[5];
                    genres = vals[6];
                    similar_games = vals[7];

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
                                    external: pricing,
                                    similar_games: similar_games,
                                    video_cached: dbResponse.data[0].video_cached
                                };
                                return resolve(game);
                            } else {
                                return reject(`Game not found in database with id #${gameId}`);
                            }
                        })
                        .catch((err: string) => {
                            return reject(err);
                        });

                })
                .catch((error: string) => {
                    return reject();
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
                        const imageColumnValues: any[] = [cover.image_id, cover.alpha_channel || 0, cover.animated || 0, cover.url, cover.width, cover.height];

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
                            id: dbResponse.data[0].igdb_images_sys_key_id,
                            alpha_channel: Boolean(dbResponse.data[0].alpha_channel[0]),
                            animated: Boolean(dbResponse.data[0].animated[0]),
                            url: dbResponse.data[0].url,
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
                            const imageColumnValues: any[] = [screenshot.image_id, screenshot.alpha_channel || 0, screenshot.animated || 0, screenshot.url, screenshot.width, screenshot.height];

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
                            id: x.igdb_images_sys_key_id,
                            alpha_channel: x.alpha_channel[0],
                            animated: x.animated[0],
                            url: x.url,
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
     * Set game pricing in database if does not exist.
     */
    setGamePricing(inserted_igdb_games_sys_key_id: number, external: GameExternalInfo): Promise <void> {
        const datePlus7Days: Date = new Date();
        datePlus7Days.setDate(datePlus7Days.getDate() + 7);

        return new Promise((resolve, reject) => {

            // check if pricing exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.pricings} pc
                JOIN ${DbTables.igdb_games} ig ON pc.${DbTablePricingsFields[3]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {
                        const priceInfo: any[][] = [];

                        if (external.steam) {
                            priceInfo.push([IGDBExternalCategoryEnum.steam, external.steam.pricings_enum, inserted_igdb_games_sys_key_id, external.steam.id, external.steam.price, external.steam.discount_percent, external.steam.url, datePlus7Days]);
                        }

                        if (external.gog) {
                            priceInfo.push([IGDBExternalCategoryEnum.gog, external.gog.pricings_enum, inserted_igdb_games_sys_key_id, external.gog.id, external.gog.price, external.gog.discount_percent, external.gog.url, datePlus7Days]);
                        }

                        if (external.microsoft) {
                            priceInfo.push([IGDBExternalCategoryEnum.microsoft, external.microsoft.pricings_enum, inserted_igdb_games_sys_key_id, external.microsoft.id, external.microsoft.price, external.microsoft.discount_percent, external.microsoft.url, datePlus7Days]);
                        }

                        if (external.apple) {
                            priceInfo.push([IGDBExternalCategoryEnum.apple, external.apple.pricings_enum, inserted_igdb_games_sys_key_id, external.apple.id, external.apple.price, external.apple.discount_percent, external.apple.url, datePlus7Days]);
                        }

                        if (external.android) {
                            priceInfo.push([IGDBExternalCategoryEnum.android, external.android.pricings_enum, inserted_igdb_games_sys_key_id, external.android.id, external.android.price, external.android.discount_percent, external.android.url, datePlus7Days]);
                        }

                        priceInfo.forEach((columnValues: any[]) => {

                            this.insert(
                                DbTables.pricings,
                                DbTablePricingsFields.slice(1),
                                columnValues,
                                DbTablePricingsFields.slice(1).map(() => "?").join(", "),
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
     * Get game pricing in database if exists.
     */
    getGamePricing(gameId: number): Promise <GameExternalInfo> {
        const today: Date = new Date();
        const datePlus7Days: Date = new Date();
        datePlus7Days.setDate(datePlus7Days.getDate() + 7);

        return new Promise((resolve, reject) => {

            // check if pricing exists
            this.custom(
                `SELECT pc.${DbTablePricingsFields[4]}, pc.${DbTablePricingsFields[2]}, pc.${DbTablePricingsFields[7]}, pc.${DbTablePricingsFields[5]}, pc.${DbTablePricingsFields[6]}, ee.${DbTableIGDBExternalEnumFields[1]} as "external_enum_id" FROM ${config.mysql.database}.${DbTables.pricings} pc
                JOIN ${DbTables.igdb_external_enum} ee ON ee.${DbTableIGDBExternalEnumFields[0]} = pc.${DbTablePricingsFields[1]}
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = pc.${DbTablePricingsFields[3]}
                WHERE ig.id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    const expiredPricePromises: Promise<PriceInfoResponse[]>[] = [];
                    const gameExternalInfo: GameExternalInfo = {};

                    dbResponse.data.forEach((x: any) => {
                        const externalInfo: ExternalInfo = {
                            id: x.id,
                            pricings_enum: x.pricings_enum_sys_key_id,
                            url: x.url,
                            price: x.price,
                            discount_percent: x.discount_percent
                        };

                        if (x.external_enum_id === IGDBExternalCategoryEnum.steam) {
                            gameExternalInfo.steam = externalInfo;
                        } else if (x.external_enum_id === IGDBExternalCategoryEnum.gog) {
                            gameExternalInfo.gog = externalInfo;
                        } else if (x.external_enum_id === IGDBExternalCategoryEnum.microsoft) {
                            gameExternalInfo.microsoft = externalInfo;
                        } else if (x.external_enum_id === IGDBExternalCategoryEnum.apple) {
                            gameExternalInfo.apple = externalInfo;
                        } else if (x.external_enum_id === IGDBExternalCategoryEnum.android) {
                            gameExternalInfo.android = externalInfo;
                        }

                        if (x.expires <= today) {
                            expiredPricePromises.push(steamAPIGetPriceInfo([parseInt(gameExternalInfo.steam.id)]));
                        }

                    });

                    Promise.all(expiredPricePromises)
                        .then((vals: PriceInfoResponse[][]) => {

                            vals.forEach((priceInfo: PriceInfoResponse[]) => {

                                this.update(
                                    DbTables.pricings,
                                    `${DbTablePricingsFields[4]}=?, ${DbTablePricingsFields[5]}=?, ${DbTablePricingsFields[7]}=?`,
                                    [priceInfo[0].price, priceInfo[0].discount_percent, datePlus7Days],
                                    `${DbTablePricingsFields[1]}=? AND ${DbTablePricingsFields[3]}=?`,
                                    [priceInfo[0].externalEnum, gameId])
                                    .then((dbResponse: GenericModelResponse) => {
                                        if (dbResponse.data.affectedRows !== 1) {
                                            return reject(`Database error.`);
                                        }
                                    })
                                    .catch((error: string) => {
                                        return reject(`Database error.`);
                                    });

                            });

                            return resolve(gameExternalInfo);
                        })
                        .catch((error: string) => {
                            return reject(error);
                        });

                })
                .catch((err: string) => {
                    return reject(err);
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
     * Get similar games in database if exist.
     */
    getGameSimilarGames(gameId: number): Promise <SimilarGame[]> {

        return new Promise((resolve, reject) => {

            // check if similar games exists
            this.custom(
                `SELECT ig.${DbTableIGDBGamesFields[1]}, sg.${DbTableSimilarGamesFields[3]}, sg.${DbTableSimilarGamesFields[4]} FROM ${config.mysql.database}.${DbTables.similar_games} sg
                JOIN ${DbTables.igdb_games} ig ON ig.${DbTableIGDBGamesFields[0]} = sg.${DbTableSimilarGamesFields[2]}
                WHERE sg.${DbTableSimilarGamesFields[1]}=(SELECT ig.${DbTableIGDBGamesFields[0]} FROM ${DbTables.igdb_games} ig WHERE ig.${DbTableIGDBGamesFields[1]}=?)`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const similarGames: SimilarGame[] = dbResponse.data.map((rawSimilarGame: any) => {
                            const similarGame: SimilarGame = {id: rawSimilarGame.id, name: rawSimilarGame.similar_name, cover_id: rawSimilarGame.similar_cover_id};
                            return similarGame;
                        });

                        return resolve(similarGames);
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
     * Set similar games in database if does not exist.
     */
    setGameSimilarGames(inserted_igdb_games_sys_key_id: number, similarGames: SimilarGame[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if similar games exists
            this.custom(
                `SELECT COUNT(*) FROM ${config.mysql.database}.${DbTables.similar_games} sg
                JOIN ${DbTables.igdb_games} ig ON sg.${DbTableSimilarGamesFields[2]} = ig.${DbTableIGDBGamesFields[0]}
                WHERE ig.${DbTableIGDBGamesFields[0]}=?`,
                [inserted_igdb_games_sys_key_id])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data[0][`COUNT(*)`] !== 0) {
                        return resolve();
                    } else {
                        similarGames.forEach((similarGame: SimilarGame) => {
                            const columnValues: any[] = [inserted_igdb_games_sys_key_id, similarGame.id, similarGame.name, similarGame.cover_id];

                            // insert similar game
                            this.insert(
                                DbTables.similar_games,
                                DbTableSimilarGamesFields.slice(1),
                                columnValues,
                                DbTableSimilarGamesFields.slice(1).map(() => "?").join(", "),
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
                    console.log(`update resp: ${JSON.stringify(dbResponse.data)}`);
                    if (dbResponse.data.affectedRows === 1) {
                        return resolve();
                    } else {
                        return reject(`Database error.`);
                    }
                })
                .catch((error: string) => {
                    return reject(`Database error.`);
                });

        });

    }

}

export const igdbModel: IGDBModel = new IGDBModel();