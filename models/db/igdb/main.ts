import DatabaseBase from "./../base/dbBase";
import { SQLErrorCodes, GenericModelResponse, GameResponse, IGDBImage, DbTableFieldsGames, DbTableFieldsCovers, DbTableFieldsIGDBImage, DbTableFieldsScreenshots, GameExternalInfo, DbTableFieldsPricing, ExternalInfo, IGDBExternalCategoryEnum, PriceInfoResponse, DbTableFieldsIcons, IconEnums, DbTableFieldsReleaseDates, DbTableFieldsPlatforms, IdNamePair, DbTableFieldsGenres, DbTableFieldsResults, ResultsEnum } from "../../../client/client-server-common/common";
import { steamAPIGetPriceInfo } from "../../../util/main";
import { MysqlError } from "mysql";


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
                "games",
                DbTableFieldsGames,
                `igdb_id=?`,
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
            const gamePromises: Promise<any>[] = [];
            const gamesColumnValues: any[] = [game.id, game.name, game.aggregated_rating, game.total_rating_count, game.summary, game.first_release_date, game.video];

            if (game.cover) {
                gamePromises.push(this.setGameCover(game.id, game.cover));
            }
            if (game.screenshots) {
                gamePromises.push(this.setGameScreenshots(game.id, game.screenshots));
            }
            if (game.external) {
                gamePromises.push(this.setGamePricing(game.id, game.external));
            }
            if (game.linkIcons) {
                gamePromises.push(this.setGameIcons(game.id, game.linkIcons));
            }
            if (game.release_dates) {
                gamePromises.push(this.setGameReleaseDates(game.id, game.release_dates));
            }
            if (game.platforms) {
                gamePromises.push(this.setGamePlatforms(game.id, game.platforms));
            }
            if (game.genres) {
                gamePromises.push(this.setGameGenres(game.id, game.genres));
            }
            gamePromises.push(this.insert("games", DbTableFieldsGames, gamesColumnValues, DbTableFieldsGames.map(() => "?").join(", "), false));

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

        });

    }

    /**
     * Get game from database.
     */
    getGame(gameId: number): Promise <GameResponse> {

        return new Promise((resolve, reject) => {
            const gamePromises: Promise<any>[] = [this.getGameCover(gameId), this.getGameScreenshots(gameId), this.getGamePricing(gameId), this.getGameIcons(gameId), this.getGameReleaseDates(gameId), this.getGamePlatforms(gameId), this.getGameGenres(gameId)];
            let cover: IGDBImage = undefined;
            let screenshots: IGDBImage[] = undefined;
            let pricing: GameExternalInfo = undefined;
            let linkIcons: string[] = undefined;
            let releaseDates: number[] = undefined;
            let platforms: number[] = undefined;
            let genres: number[] = undefined;

            Promise.all(gamePromises)
                .then((vals: any) => {
                    cover = vals[0];
                    screenshots = vals[1];
                    pricing = vals[2];
                    linkIcons = vals[3];
                    releaseDates = vals[4];
                    platforms = vals[5];
                    genres = vals[6];

                    // get game
                    this.select(
                        "games",
                        DbTableFieldsGames,
                        `igdb_id=?`,
                        [gameId])
                        .then((dbResponse: GenericModelResponse) => {
                            if (dbResponse.data.length > 0) {
                                const game: GameResponse = {
                                    id: dbResponse.data[0].igdb_id,
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
                                    external: pricing
                                };
                                return resolve(game);
                            } else {
                                return reject(`Game not found in database.`);
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
    setGameCover(gameId: number, cover: IGDBImage): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if cover exists
            this.select(
                "covers",
                DbTableFieldsCovers,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve();
                    } else {
                        const imageColumnValues: any[] = [cover.image_id, cover.alpha_channel || 0, cover.animated || 0, cover.url, cover.width, cover.height];

                        // insert image
                        this.insert(
                            "igdb_image",
                            DbTableFieldsIGDBImage,
                            imageColumnValues,
                            DbTableFieldsIGDBImage.map(() => "?").join(", "),
                            false)
                            .then(() => {
                                const coverImageColumnValues: any[] = [cover.image_id, gameId];

                                // insert cover
                                this.insert(
                                    "covers",
                                    DbTableFieldsCovers,
                                    coverImageColumnValues,
                                    DbTableFieldsCovers.map(() => "?").join(", "),
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
            this.select(
                "covers",
                DbTableFieldsCovers,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const IGDBImageId: number = dbResponse.data[0].igdb_image_id;

                        this.select(
                            "igdb_image",
                            DbTableFieldsIGDBImage,
                            `igdb_image_id=?`,
                            [IGDBImageId])
                            .then((dbResponse: GenericModelResponse) => {

                                if (dbResponse.data.length > 0) {
                                    const cover: IGDBImage = {
                                        id: dbResponse.data[0].igdb_image_id,
                                        alpha_channel: Boolean(dbResponse.data[0].alpha_channel[0]),
                                        animated: Boolean(dbResponse.data[0].animated[0]),
                                        url: dbResponse.data[0].url,
                                        image_id: dbResponse.data[0].image_id,
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
    setGameScreenshots(gameId: number, screenshots: IGDBImage[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if screenshots exists
            this.select(
                "screenshots",
                DbTableFieldsScreenshots,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve();
                    } else {
                        screenshots
                            .filter((screenshot: IGDBImage) => screenshot.image_id)
                            .forEach((screenshot: IGDBImage) => {
                            const imageColumnValues: any[] = [screenshot.image_id, screenshot.alpha_channel || 0, screenshot.animated || 0, screenshot.url, screenshot.width, screenshot.height];

                            // insert image
                            this.insert(
                                "igdb_image",
                                DbTableFieldsIGDBImage,
                                imageColumnValues,
                                DbTableFieldsIGDBImage.map(() => "?").join(", "),
                                false)
                                .then(() => {
                                    const screenshotImageColumnValues: any[] = [screenshot.image_id, gameId];

                                    // insert screenshot
                                    this.insert(
                                        "screenshots",
                                        DbTableFieldsScreenshots,
                                        screenshotImageColumnValues,
                                        DbTableFieldsScreenshots.map(() => "?").join(", "),
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
            this.select(
                "screenshots",
                DbTableFieldsScreenshots,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const screenshotsPromises: Promise<GenericModelResponse>[] = [];

                        dbResponse.data.forEach((x: any) => {
                            const IGDBImageId: number = x.igdb_image_id;

                            screenshotsPromises.push(
                                this.select(
                                    "igdb_image",
                                    DbTableFieldsIGDBImage,
                                    `igdb_image_id=?`,
                                    [IGDBImageId])
                            );
                        });

                        Promise.all(screenshotsPromises)
                            .then((vals: GenericModelResponse[]) => {
                                const screenshots: IGDBImage[] = [];

                                vals.forEach((x: GenericModelResponse) => {
                                    const screenshot: IGDBImage = {
                                        id: undefined,
                                        alpha_channel: x.data[0].alpha_channel,
                                        animated: x.data[0].animated,
                                        url: x.data[0].url,
                                        image_id: x.data[0].igdb_image_id,
                                        width: x.data[0].width,
                                        height: x.data[0].height,
                                    };

                                    screenshots.push(screenshot);
                                });

                                return resolve(screenshots);
                            })
                            .catch((error: string) => {
                                return reject(error);
                            });

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
     * Set game pricing in database if does not exist.
     */
    setGamePricing(gameId: number, external: GameExternalInfo): Promise <void> {
        const today: Date = new Date();
        const datePlus7Days: Date = new Date();
        datePlus7Days.setDate(datePlus7Days.getDate() + 7);

        return new Promise((resolve, reject) => {

            // check if pricing exists
            this.select(
                "pricings",
                DbTableFieldsPricing,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    const priceInfo: any[][] = [];

                    if (external.steam) {
                        priceInfo.push([IGDBExternalCategoryEnum.steam, gameId, external.steam.uid, external.steam.price, external.steam.discount_percent, external.steam.url, datePlus7Days]);
                    }

                    if (external.gog) {
                        priceInfo.push([IGDBExternalCategoryEnum.gog, gameId, external.gog.uid, external.gog.price, external.gog.discount_percent, external.gog.url, datePlus7Days]);
                    }

                    if (external.microsoft) {
                        priceInfo.push([IGDBExternalCategoryEnum.microsoft, gameId, external.microsoft.uid, external.microsoft.price, external.microsoft.discount_percent, external.microsoft.url, datePlus7Days]);
                    }

                    if (external.apple) {
                        priceInfo.push([IGDBExternalCategoryEnum.apple, gameId, external.apple.uid, external.apple.price, external.apple.discount_percent, external.apple.url, datePlus7Days]);
                    }

                    if (external.android) {
                        priceInfo.push([IGDBExternalCategoryEnum.android, gameId, external.android.uid, external.android.price, external.android.discount_percent, external.android.url, datePlus7Days]);
                    }

                    if (dbResponse.data.length === 0) {

                        priceInfo.forEach((columnValues: any[]) => {

                            this.insert(
                                "pricings",
                                DbTableFieldsPricing,
                                columnValues,
                                DbTableFieldsPricing.map(() => "?").join(", "),
                                false)
                                .catch((err: MysqlError) => {
                                    if (err.errno !== SQLErrorCodes.DUPLICATE_ROW) {
                                        return reject(err);
                                    }
                                });

                        });

                    }

                    return resolve();
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
            this.select(
                "pricings",
                DbTableFieldsPricing,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {
                    const gameExternalInfo: GameExternalInfo = {};

                    if (dbResponse.data.length > 0) {
                        const expiredPricePromises: Promise<PriceInfoResponse[]>[] = [];

                        dbResponse.data.forEach((x: any) => {
                            const externalInfo: ExternalInfo = {
                                uid: x.uid,
                                url: x.url,
                                price: x.price,
                                discount_percent: x.discount_percent
                            };

                            if (x.igdb_external_enum_id === IGDBExternalCategoryEnum.steam) {
                                gameExternalInfo.steam = externalInfo;
                            } else if (x.igdb_external_enum_id === IGDBExternalCategoryEnum.gog) {
                                gameExternalInfo.gog = externalInfo;
                            } else if (x.igdb_external_enum_id === IGDBExternalCategoryEnum.microsoft) {
                                gameExternalInfo.microsoft = externalInfo;
                            } else if (x.igdb_external_enum_id === IGDBExternalCategoryEnum.apple) {
                                gameExternalInfo.apple = externalInfo;
                            } else if (x.igdb_external_enum_id === IGDBExternalCategoryEnum.android) {
                                gameExternalInfo.android = externalInfo;
                            }

                            if (x.expires <= today) {
                                expiredPricePromises.push(steamAPIGetPriceInfo([parseInt(gameExternalInfo.steam.uid)]));
                            }

                        });

                        Promise.all(expiredPricePromises)
                            .then((vals: PriceInfoResponse[][]) => {

                                vals.forEach((priceInfo: PriceInfoResponse[]) => {

                                    this.update(
                                        "pricings",
                                        "price=?, discount_percent=?, expires=?",
                                        [priceInfo[0].price, priceInfo[0].discount_percent, datePlus7Days],
                                        "igdb_external_enum_id=? AND igdb_id=?",
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

                            })
                            .catch((error: string) => {
                                return reject(error);
                            });

                    }

                    return resolve(gameExternalInfo);

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Set game icons in database if does not exist.
     */
    setGameIcons(gameId: number, icons: string[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if icons exists
            this.select(
                "icons",
                DbTableFieldsIcons,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve();
                    } else {

                        icons.forEach((icon: string) => {
                            let iconId: number = undefined;
                            let imageColumnValues: number[] = undefined;

                            for (const iconEnum in IconEnums) {
                                if (iconEnum === icon) {
                                    iconId = parseInt(IconEnums[iconEnum]);
                                }
                            }

                            imageColumnValues = [iconId, gameId];

                            // insert icon
                            this.insert(
                                "icons",
                                DbTableFieldsIcons,
                                imageColumnValues,
                                DbTableFieldsIcons.map(() => "?").join(", "),
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
     * Get game icons in database if exists.
     */
    getGameIcons(gameId: number): Promise <string[]> {

        return new Promise((resolve, reject) => {

            // check if icons exists
            this.select(
                "icons",
                DbTableFieldsIcons,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const icons: string[] = dbResponse.data.map((iconInfo: any) => {
                            for (const icon in IconEnums) {
                                if (parseInt(icon) === iconInfo.icon_id) {
                                    return IconEnums[icon];
                                }
                            }
                        });

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
            this.select(
                "release_dates",
                DbTableFieldsReleaseDates,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const releaseDates: number[] = dbResponse.data.map((releaseDate: any) => releaseDate.release_date);

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
    setGameReleaseDates(gameId: number, releaseDates: number[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if release date exists
            this.select(
                "release_dates",
                DbTableFieldsReleaseDates,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve();
                    } else {
                        releaseDates.forEach((releaseDate: number) => {
                            const columnValues: any[] = [releaseDate, gameId];

                            // insert release date
                            this.insert(
                                "release_dates",
                                DbTableFieldsReleaseDates.slice(1),
                                columnValues,
                                DbTableFieldsReleaseDates.slice(1).map(() => "?").join(", "),
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
            this.select(
                "platforms",
                DbTableFieldsPlatforms,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const platforms: number[] = dbResponse.data.map((platform: any) => platform.igdb_platform_enum_id);

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
    setGamePlatforms(gameId: number, platforms: number[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if platforms exists
            this.select(
                "platforms",
                DbTableFieldsPlatforms,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve();
                    } else {

                        platforms.forEach((platformId: number) => {
                            const columnValues: any[] = [platformId, gameId];

                            // insert platform
                            this.insert(
                                "platforms",
                                DbTableFieldsPlatforms,
                                columnValues,
                                DbTableFieldsPlatforms.map(() => "?").join(", "),
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
     * Get game genres in database if exists.
     */
    getGameGenres(gameId: number): Promise <number[]> {

        return new Promise((resolve, reject) => {

            // check if genres exists
            this.select(
                "genres",
                DbTableFieldsGenres,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const genres: number[] = dbResponse.data.map((genre: any) => genre.igdb_genre_enum_id);

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
    setGameGenres(gameId: number, genres: number[]): Promise <void> {

        return new Promise((resolve, reject) => {

            // check if genres exists
            this.select(
                "genres",
                DbTableFieldsGenres,
                `igdb_id=?`,
                [gameId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve();
                    } else {

                        genres.forEach((genreId: number) => {
                            const columnValues: any[] = [genreId, gameId];

                            // insert genre
                            this.insert(
                                "genres",
                                DbTableFieldsGenres,
                                columnValues,
                                DbTableFieldsGenres.map(() => "?").join(", "),
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
            this.select(
                "results",
                DbTableFieldsResults,
                `${DbTableFieldsResults[1]}=? AND ${DbTableFieldsResults[2]}${!param ? " IS " : "="}?`,
                [resultsEnum, param])
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
     * Get results from database.
     */
    getResults(resultsEnum: ResultsEnum, param?: string): Promise <number[]> {

        return new Promise((resolve, reject) => {

            // check if results exists
            this.select(
                "results",
                DbTableFieldsResults,
                `${DbTableFieldsResults[1]}=? AND ${DbTableFieldsResults[2]}${!param ? " IS " : "="}?`,
                [resultsEnum, param])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const gameIds: number[] = dbResponse.data.map((result: any) => result.igdb_id);

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

            // check if results exists
            this.select(
                "results",
                DbTableFieldsResults,
                `${DbTableFieldsResults[1]}=? AND ${DbTableFieldsResults[2]}${!param ? " IS " : "="}?`,
                [resultsEnum, param])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        return resolve();
                    } else {

                        console.log(`Results #${gameIds.length}`);
                        gameIds.forEach((gameId: number) => {
                            const columnValues: any[] = [resultsEnum, param, gameId, datePlus7Days];

                            // insert result
                            this.insert(
                                "results",
                                DbTableFieldsResults.slice(1),
                                columnValues,
                                DbTableFieldsResults.slice(1).map(() => "?").join(", "),
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

}

export const igdbModel: IGDBModel = new IGDBModel();