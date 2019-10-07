import { DbTables, GenericModelResponse, PriceInfoResponse, DbTableSteamGamesFields, DbTablePricingsFields, GameResponse, DbTableGenresFields, DbTableSteamGenreEnumFields, DbTablePlatformsFields, DbTableSteamModesEnumFields, DbTableModesFields, DbTableImagesFields, ImagesEnum, DbTableSteamDeveloperEnumFields, DbTableDevelopersFields, DbTableSteamPublisherEnumFields, DbTablePublishersFields, Achievement, DbTableAchievementsFields } from "../../client/client-server-common/common";
import DatabaseBase from "../../models/db/base/dbBase";
import { log } from "../../webscraper/logger/main";
const db: DatabaseBase = new DatabaseBase();

export function cacheSteamGame(steamGamesSysKeyId: number, name: string, steamReviewEnumSysKeyId: number, totalReviewCount: number, summary: string, firstReleaseDate: Date, video: string, steamStateEnumSysKeyId: number): Promise<void>  {

    return new Promise((resolve: any, reject: any) => {

        db.custom(
            `SELECT *
            FROM ${DbTables.steam_games}
            WHERE ${DbTableSteamGamesFields[0]} = ?`,
            [steamGamesSysKeyId])
            .then((dbResponse: GenericModelResponse) => {
                const rawGames: any[] = dbResponse.data;

                if (rawGames.length > 0) {
                    const rawGame: any = rawGames[0];

                    if (rawGame.name != name || rawGame.steam_review_enum_sys_key_id != steamReviewEnumSysKeyId || rawGame.total_review_count != totalReviewCount || rawGame.summary != summary || rawGame.first_release_date != firstReleaseDate || rawGame.steam_state_enum_sys_key_id != steamStateEnumSysKeyId) {

                        // update game info
                        db.custom(
                            `UPDATE ${DbTables.steam_games}
                            SET ${DbTableSteamGamesFields[1]} = ?, ${DbTableSteamGamesFields[2]} = ?, ${DbTableSteamGamesFields[3]} = ?, ${DbTableSteamGamesFields[4]} = ?, ${DbTableSteamGamesFields[5]} = ?, ${DbTableSteamGamesFields[7]} = ?, ${DbTableSteamGamesFields[8]} = ?
                            WHERE ${DbTableSteamGamesFields[0]} = ?`,
                            [name, steamReviewEnumSysKeyId, totalReviewCount, summary, firstReleaseDate, steamStateEnumSysKeyId, new Date(), steamGamesSysKeyId])
                            .then(() => {
                                return resolve();
                            })
                            .catch((error: string) => {
                                return reject(error);
                            });

                    } else {

                        // no changes to game info
                        return resolve();
                    }

                } else {

                    // add game
                    db.custom(
                        `INSERT INTO ${DbTables.steam_games} (${DbTableSteamGamesFields.join(`,`)})
                        VALUES (${DbTableSteamGamesFields.map(() => `?`).join(`,`)})`,
                        [steamGamesSysKeyId, name, steamReviewEnumSysKeyId, totalReviewCount, summary, firstReleaseDate, video, steamStateEnumSysKeyId, new Date()])
                        .then(() => {
                            return resolve();
                        })
                        .catch((error: string) => {
                            return reject(error);
                        });

                }

            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

export function cacheGenres(genres: string[], steamGamesSysKeyId: number): Promise <void> {

    return new Promise((resolve: any, reject: any) => {
        const promises: Promise<void>[] = [];
        const genrePromise = (genre: string): Promise<void> => {
            return new Promise((resolve: any, reject: any) => {
                let genreEnumSysKeyId: number = -1;

                // add genre enum if it doesnt exist in db
                db.custom(
                    `SELECT *
                    FROM ${DbTables.steam_genre_enum}
                    WHERE ${DbTableSteamGenreEnumFields[1]} = ?`,
                    [genre])
                    .then((dbResponse: GenericModelResponse) => {
                        const genreExistsInDb: boolean = dbResponse.data.length > 0;

                        if (!genreExistsInDb) {

                            return db.custom(
                                `INSERT INTO ${DbTables.steam_genre_enum} (${DbTableSteamGenreEnumFields[1]})
                                VALUES (?)`,
                                [genre])
                                .then((innerDbResponse: GenericModelResponse) => {
                                    if (!innerDbResponse.data) {
                                        // enum already in db, do nothing
                                        return resolve();
                                    }

                                    genreEnumSysKeyId = innerDbResponse.data[`insertId`];

                                    // insert
                                    return db.custom(
                                        `INSERT INTO ${DbTables.genres} (${DbTableGenresFields[1]}, ${DbTableGenresFields[2]})
                                        VALUES (?, ?)`,
                                        [genreEnumSysKeyId, steamGamesSysKeyId])
                                        .then(() => {
                                            return resolve();
                                        })
                                        .catch((error: string) => {
                                            return reject(error);
                                        });
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });

                        } else {
                            genreEnumSysKeyId = dbResponse.data[0][DbTableSteamGenreEnumFields[0]];

                            // insert
                            return db.custom(
                                `INSERT INTO ${DbTables.genres} (${DbTableGenresFields[1]}, ${DbTableGenresFields[2]})
                                VALUES (?, ?)`,
                                [genreEnumSysKeyId, steamGamesSysKeyId])
                                .then(() => {
                                    return resolve();
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });

                        }
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
            });
        };

        if (genres.length === 0) {
            return resolve();
        }

        genres.forEach((genre: string) => promises.push(genrePromise(genre)));

        Promise.all(promises)
            .then(() => {
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

export function cacheDeveloperAndPublisher(developer: string, publisher: string, steamGamesSysKeyId: number): Promise <void> {

    return new Promise((resolve: any, reject: any) => {
        const promises: Promise<void>[] = [];
        const developerPromise = (innerDeveloper: string): Promise<void> => {
            return new Promise((resolve: any, reject: any) => {
                let developerEnumSysKeyId: number = -1;

                // add enum if it doesnt exist in db
                db.custom(
                    `SELECT *
                    FROM ${DbTables.steam_developer_enum}
                    WHERE ${DbTableSteamDeveloperEnumFields[1]} = ?`,
                    [innerDeveloper])
                    .then((dbResponse: GenericModelResponse) => {
                        const developerExistsInDb: boolean = dbResponse.data.length > 0;

                        if (!developerExistsInDb && innerDeveloper) {

                            return db.custom(
                                `INSERT INTO ${DbTables.steam_developer_enum} (${DbTableSteamDeveloperEnumFields[1]})
                                VALUES (?)`,
                                [innerDeveloper])
                                .then((innerDbResponse: GenericModelResponse) => {
                                    if (!innerDbResponse.data) {
                                        // enum already in db, do nothing
                                        return resolve();
                                    }

                                    developerEnumSysKeyId = innerDbResponse.data[`insertId`];

                                    // insert
                                    return db.custom(
                                        `INSERT INTO ${DbTables.developers} (${DbTableDevelopersFields[1]}, ${DbTableDevelopersFields[2]})
                                        VALUES (?, ?)`,
                                        [developerEnumSysKeyId, steamGamesSysKeyId])
                                        .then(() => {
                                            return resolve();
                                        })
                                        .catch((error: string) => {
                                            return reject(error);
                                        });
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });

                        } else {
                            if (!innerDeveloper) {
                                developerEnumSysKeyId = undefined;
                            } else {
                                developerEnumSysKeyId = dbResponse.data[0][DbTableSteamDeveloperEnumFields[0]];
                            }

                            // insert
                            return db.custom(
                                `INSERT INTO ${DbTables.developers} (${DbTableDevelopersFields[1]}, ${DbTableDevelopersFields[2]})
                                VALUES (?, ?)`,
                                [developerEnumSysKeyId, steamGamesSysKeyId])
                                .then(() => {
                                    return resolve();
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });
                        }
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
            });
        };
        const publisherPromise = (innerPublisher: string): Promise<void> => {
            return new Promise((resolve: any, reject: any) => {
                let publisherEnumSysKeyId: number = -1;

                // add enum if it doesnt exist in db
                db.custom(
                    `SELECT *
                    FROM ${DbTables.steam_publisher_enum}
                    WHERE ${DbTableSteamPublisherEnumFields[1]} = ?`,
                    [innerPublisher])
                    .then((dbResponse: GenericModelResponse) => {
                        const publisherExistsInDb: boolean = dbResponse.data.length > 0;

                        if (!publisherExistsInDb && innerPublisher) {
                            return db.custom(
                                `INSERT INTO ${DbTables.steam_publisher_enum} (${DbTableSteamPublisherEnumFields[1]})
                                VALUES (?)`,
                                [innerPublisher])
                                .then((innerDbResponse: GenericModelResponse) => {
                                    if (!innerDbResponse.data) {
                                        // enum already in db, do nothing
                                        return resolve();
                                    }

                                    publisherEnumSysKeyId = innerDbResponse.data[`insertId`];

                                    // insert
                                    return db.custom(
                                        `INSERT INTO ${DbTables.publishers} (${DbTablePublishersFields[1]}, ${DbTablePublishersFields[2]})
                                        VALUES (?, ?)`,
                                        [publisherEnumSysKeyId, steamGamesSysKeyId])
                                        .then(() => {
                                            return resolve();
                                        })
                                        .catch((error: string) => {
                                            return reject(error);
                                        });
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });

                        } else {

                            if (!innerPublisher) {
                                publisherEnumSysKeyId = undefined;
                            } else {
                                publisherEnumSysKeyId = dbResponse.data[0][DbTableSteamPublisherEnumFields[0]];
                            }

                            // insert
                            return db.custom(
                                `INSERT INTO ${DbTables.publishers} (${DbTablePublishersFields[1]}, ${DbTablePublishersFields[2]})
                                VALUES (?, ?)`,
                                [publisherEnumSysKeyId, steamGamesSysKeyId])
                                .then(() => {
                                    return resolve();
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });
                        }
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
            });
        };

        if (developer) {
            promises.push(developerPromise(developer));
        }

        if (publisher) {
            promises.push(publisherPromise(publisher));
        }

        Promise.all(promises)
            .then(() => {
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

export function cacheAchievements(achievements: Achievement[], steamGamesSysKeyId: number): Promise <void> {

    return new Promise((resolve: any, reject: any) => {
        const promises: Promise<void>[] = [];
        const achievementPromise = (achievement: Achievement): Promise<void> => {
            return new Promise((resolve: any, reject: any) => {
                return db.custom(
                    `SELECT *
                    FROM ${DbTables.achievements}
                    WHERE ${DbTableAchievementsFields[1]} = ? AND ${DbTableAchievementsFields[2]} = ? AND ${DbTableAchievementsFields[3]} = ?`,
                    [steamGamesSysKeyId, achievement.name, achievement.description])
                    .then((response: GenericModelResponse) => {

                        if (response.data.length > 0) {
                            const achievementFoundInDb: Achievement = response.data[0];

                            if (achievementFoundInDb.link != achievement.link || achievementFoundInDb.percent != achievement.percent) {

                                // update outdated achievement
                                db.custom(
                                    `UPDATE ${DbTables.achievements}
                                    SET ${DbTableAchievementsFields[4]} = ?, ${DbTableAchievementsFields[5]} = ?, ${DbTableAchievementsFields[6]} = ?
                                    WHERE ${DbTableAchievementsFields[1]} = ? AND ${DbTableAchievementsFields[2]} = ? AND ${DbTableAchievementsFields[3]} = ?`,
                                    [achievement.link, achievement.percent, achievement.log_dt, steamGamesSysKeyId, achievement.name, achievement.description])
                                    .then(() => {
                                        return resolve();
                                    })
                                    .catch((error: string) => {
                                        return reject(error);
                                    });

                            } else {

                                // do nothing
                                return resolve();

                            }

                        } else {
                            const achievementVals: any[] = [steamGamesSysKeyId, achievement.name, achievement.description, achievement.link, achievement.percent, achievement.log_dt];

                            // insert
                            return db.custom(
                                `INSERT INTO ${DbTables.achievements}
                                (${DbTableAchievementsFields.slice(1).join()})
                                VALUES
                                (${DbTableAchievementsFields.slice(1).map(() => "?").join()})`,
                                achievementVals)
                                .then(() => {
                                    return resolve();
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });

                        }

                    })
                    .catch((error: string) => {
                        // skip achievements with character collation problems
                        log(`[Bus] Skipping achievement has possible collation problems. ${error}`);
                        return resolve();
                    });
            });
        };

        if (achievements.length === 0) {
            return resolve();
        }

        achievements.forEach((achievement: Achievement) => {
            promises.push(achievementPromise(achievement));
        });

        Promise.all(promises)
            .then(() => {
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

export function cacheModes(modes: string[], steamGamesSysKeyId: number): Promise <void> {

    return new Promise((resolve: any, reject: any) => {
        const promises: Promise<void>[] = [];
        const modePromise = (mode: string): Promise<void> => {
            return new Promise((resolve: any, reject: any) => {
                let modeEnumSysKeyId: number = -1;

                // add mode enum if it doesnt exist in db
                db.custom(
                    `SELECT *
                    FROM ${DbTables.steam_modes_enum}
                    WHERE ${DbTableSteamModesEnumFields[1]} = ?`,
                    [mode])
                    .then((dbResponse: GenericModelResponse) => {
                        const modeExistsInDb: boolean = dbResponse.data.length > 0;

                        if (!modeExistsInDb) {
                            return db.custom(
                                `INSERT INTO ${DbTables.steam_modes_enum} (${DbTableSteamModesEnumFields[1]})
                                VALUES (?)`,
                                [mode])
                                .then((innerDbResponse: GenericModelResponse) => {
                                    if (!innerDbResponse.data) {
                                        // enum already in db, do nothing
                                        return resolve();
                                    }

                                    modeEnumSysKeyId = innerDbResponse.data[`insertId`];

                                    // insert
                                    return db.custom(
                                        `INSERT INTO ${DbTables.modes} (${DbTableModesFields[1]}, ${DbTableModesFields[2]})
                                        VALUES (?, ?)`,
                                        [modeEnumSysKeyId, steamGamesSysKeyId])
                                        .then(() => {
                                            return resolve();
                                        })
                                        .catch((error: string) => {
                                            return reject(error);
                                        });
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });

                        } else {
                            modeEnumSysKeyId = dbResponse.data[0][DbTableSteamModesEnumFields[0]];

                            // insert
                            return db.custom(
                                `INSERT INTO ${DbTables.modes} (${DbTableModesFields[1]}, ${DbTableModesFields[2]})
                                VALUES (?, ?)`,
                                [modeEnumSysKeyId, steamGamesSysKeyId])
                                .then(() => {
                                    return resolve();
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });
                        }
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
            });
        };

        if (modes.length === 0) {
            return resolve();
        }

        modes.forEach((mode: string) => promises.push(modePromise(mode)));

        Promise.all(promises)
            .then(() => {
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

export function cacheImages(images: string[], steamGamesSysKeyId: number): Promise <void> {

    return new Promise((resolve: any, reject: any) => {
        const promises: Promise<void>[] = [];
        const imagePromise = (link: string, innerImagesEnumSysKeyId: number, innerSteamGamesSysKeyId: number): Promise<void> => {
            return new Promise((resolve: any, reject: any) => {
                return db.custom(
                    `INSERT INTO ${DbTables.images} (${DbTableImagesFields[1]}, ${DbTableImagesFields[2]}, ${DbTableImagesFields[3]})
                    VALUES (?, ?, ?)`,
                    [innerSteamGamesSysKeyId, innerImagesEnumSysKeyId, link])
                    .then(() => {
                        return resolve();
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
            });
        };

        if (images.length === 0) {
            return resolve();
        }

        images.forEach((image: string, index: number) => {
            let imagesEnumSysKeyId: number;
            if (index === 0) {
                imagesEnumSysKeyId = ImagesEnum.cover;
            } else if (index === 1) {
                imagesEnumSysKeyId = ImagesEnum.cover_thumb;
            } else {
                imagesEnumSysKeyId = ImagesEnum.screenshot;
            }
            promises.push(imagePromise(image, imagesEnumSysKeyId, steamGamesSysKeyId));
        });

        Promise.all(promises)
            .then(() => {
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

export function cachePlatforms(platforms: number[], steamGamesSysKeyId: number): Promise <void> {

    return new Promise((resolve: any, reject: any) => {
        const promises: Promise<void>[] = [];
        const platformPromise = (innerPlatformEnumSysKeyId: number, innerSteamGamesSysKeyId: number): Promise<void> => {
            return new Promise((resolve: any, reject: any) => {
                return db.custom(
                    `INSERT INTO ${DbTables.platforms} (${DbTablePlatformsFields[1]}, ${DbTablePlatformsFields[2]})
                    VALUES (?, ?)`,
                    [innerPlatformEnumSysKeyId, innerSteamGamesSysKeyId])
                    .then(() => {
                        return resolve();
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
            });
        };

        if (platforms.length === 0) {
            return resolve();
        }

        platforms.forEach((platformEnumSysKeyId: number) => promises.push(platformPromise(platformEnumSysKeyId, steamGamesSysKeyId)));

        Promise.all(promises)
            .then(() => {
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

export function cachePricings(pricings: PriceInfoResponse[]): Promise <void> {

    return new Promise((resolve: any, reject: any) => {

        if (pricings.length === 0) {
            return resolve();
        }

        pricings.forEach((pricing: PriceInfoResponse) => {

            db.custom(
                `SELECT *
                FROM ${DbTables.pricings}
                WHERE ${DbTablePricingsFields[1]} = ? AND ${DbTablePricingsFields[2]} = ? AND ${DbTablePricingsFields[3]} = ?`,
                [pricing.pricingEnumSysKeyId, pricing.steamGamesSysKeyId, pricing.title])
                .then((dbResponse: GenericModelResponse) => {
                    const pricingRecordsInDb: PriceInfoResponse[] = dbResponse.data;
                    const isPricingInDb: boolean = pricingRecordsInDb.length > 0;
                    const pricingsVals: any[] = [pricing.pricingEnumSysKeyId, pricing.steamGamesSysKeyId, pricing.title, pricing.price, pricing.discount_percent, pricing.discount_end_dt, pricing.log_dt];

                    // if pricing is not in database, or it is but the price or discount changed
                    if (!isPricingInDb || (pricingRecordsInDb[0].price !== pricing.price || pricingRecordsInDb[0].discount_percent !== pricing.discount_percent)) {

                        // add pricing record
                        db.custom(
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

                    } else {
                        // nothing change
                        return resolve();
                    }

                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    });

}