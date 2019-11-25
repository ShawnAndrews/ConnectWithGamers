import DatabaseBase from "../base/dbBase";
import { GenericModelResponse, GameResponse, DbTables, DbTableRouteCacheFields, DbTableSteamGamesFields, ReviewEnum, StateEnum, PriceInfoResponse, DbTablePricingsFields, DbTableDevelopersFields, DbTablePublishersFields, DbTableImagesFields, DbTableSteamDeveloperEnumFields, DbTableSteamPublisherEnumFields, IdNamePair, DbTableSteamGenreEnumFields, DbTableGenresFields, ImagesEnum, DbTableSteamModesEnumFields, DbTableModesFields, Achievement, DbTableAchievementsFields, GameSuggestion, DbTablePlatformsFields, DbTableSteamPlatformEnumFields, Review, GameReviewsResponse } from "../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";

class GameModel extends DatabaseBase {

    constructor() {
        super();
        this.getGamesByQuery = this.getGamesByQuery.bind(this);
        this.getGamesBySP = this.getGamesBySP.bind(this);
        this.getEnumByQuery = this.getEnumByQuery.bind(this);
        this.getRouteCache = this.getRouteCache.bind(this);
        this.routeCacheExists = this.routeCacheExists.bind(this);
        this.getGameSuggestions = this.getGameSuggestions.bind(this);
        this.getGameAchievements = this.getGameAchievements.bind(this);
        this.getGame = this.getGame.bind(this);
    }

    /**
     * Check if route cache entry exists.
     */
    routeCacheExists(path: string): Promise<boolean> {

        return new Promise((resolve: any, reject: any) => {
            this.custom(
                `SELECT *
                FROM ${DbTables.route_cache}
                WHERE ${DbTableRouteCacheFields[0]} = ?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {
                    const exists: boolean = dbResponse.data.length > 0;
                    return resolve(exists);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get route cache data.
     */
    getRouteCache(path: string): Promise<any> {

        return new Promise((resolve: any, reject: any) => {
            this.custom(
                `SELECT *
                FROM ${DbTables.route_cache}
                WHERE ${DbTableRouteCacheFields[0]} = ?`,
                [path])
                .then((dbResponse: GenericModelResponse) => {
                    const data: any = JSON.parse(dbResponse.data[0].response);
                    return resolve(data);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Insert new route cache.
     */
    insertRouteCache(data: any, path: string): Promise<void> {

        return new Promise((resolve: any, reject: any) => {
            const stringifiedData: string = JSON.stringify(data);
            this.custom(
                `INSERT INTO ${DbTables.route_cache}  (${DbTableRouteCacheFields[0]}, ${DbTableRouteCacheFields[1]}, ${DbTableRouteCacheFields[2]})
                VALUES (?, ?, NOW())`,
                [path, stringifiedData])
                .then(() => {
                    return resolve();
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game from database.
     */
    getGame(steamId: number): Promise <GameResponse> {

        return new Promise((resolve, reject) => {
            let game: GameResponse;

            this.getGameMain(steamId)
                .then((response: GameResponse) => {
                    game = response;
                    return this.getGamePricings(steamId);
                })
                .then((response: PriceInfoResponse[]) => {
                    game.pricings = response;
                    return this.getGameDeveloperPublisherCovers(steamId);
                })
                .then((response: GameResponse) => {
                    game.developer = response.developer;
                    game.publisher = response.publisher;
                    game.cover = response.cover;
                    game.cover_thumb = response.cover_thumb;
                    game.cover_huge = response.cover_huge;
                    return this.getGameGenres(steamId);
                })
                .then((response: IdNamePair[]) => {
                    game.genres = response;
                    return this.getGamePlatforms(steamId);
                })
                .then((response: IdNamePair[]) => {
                    game.platforms = response;
                    return this.getGameScreenshots(steamId);
                })
                .then((response: string[]) => {
                    game.screenshots = response;
                    return this.getGameModes(steamId);
                })
                .then((response: IdNamePair[]) => {
                    game.game_modes = response;
                    return resolve(game);
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    }

    /**
     * Get game reviews directly from Steam
     */
    getGameReviews(steamId: number): Promise <Review[]> {

        return new Promise((resolve: any, reject: any) => {

            axios.get(`https://store.steampowered.com/appreviews/${steamId}?json=1&num_per_page=20&review_type=all&purchase_type=all&cursor=*&filter=recent`)
            .then((response: AxiosResponse) => {
                if (response.data.error) {
                    return reject(response.data.error);
                }

                if (response.data.success !== 1) {
                    return resolve([]);
                }


                return resolve(response.data.reviews);
            })
            .catch((error: string) => {
                return reject(error);
            });
        });
    }

    /**
     * Get game's main information.
     */
    private getGameMain(steamId: number): Promise<GameResponse> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT *
                FROM ${DbTables.steam_games}
                WHERE ${DbTableSteamGamesFields[0]} = ?`,
                [steamId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const rawGame: any = dbResponse.data[0];
                        const game: GameResponse = {
                            steamId: rawGame.steam_games_sys_key_id,
                            name: rawGame.name,
                            review: { id: rawGame.steam_review_enum_sys_key_id, name: ReviewEnum[rawGame.steam_review_enum_sys_key_id] },
                            total_review_count: rawGame.total_review_count,
                            summary: rawGame.summary,
                            first_release_date: rawGame.first_release_date,
                            video: rawGame.video,
                            state: { id: rawGame.steam_state_enum_sys_key_id, name: StateEnum[rawGame.steam_state_enum_sys_key_id] },
                            developer: undefined,
                            publisher: undefined,
                            pricings: undefined,
                            cover: undefined,
                            cover_thumb: undefined,
                            cover_huge: undefined,
                            screenshots: undefined,
                            game_modes: undefined,
                            genres: undefined,
                            platforms: undefined,
                            log_dt: rawGame.log_dt
                        };

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
     * Get game's achievements.
     */
    public getGameAchievements(steamId: number): Promise<Achievement[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT *
                FROM ${DbTables.achievements} a
                WHERE a.${DbTableAchievementsFields[1]} = ?`,
                [steamId])
                .then((response: GenericModelResponse) => {
                    const achievements: Achievement[] = [];

                    if (response.data.length > 0) {
                        const rawAchievements: any = response.data;

                        rawAchievements.forEach((rawAchievement: any) => {
                            const achievement: Achievement = {
                                name: rawAchievement.name,
                                description: rawAchievement.description,
                                percent: rawAchievement.percent,
                                link: rawAchievement.link,
                                log_dt: rawAchievement.log_dt
                            };
                            achievements.push(achievement);
                        });
                    }

                    return resolve(achievements);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game's modes.
     */
    private getGameModes(steamId: number): Promise<IdNamePair[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT me.${DbTableSteamModesEnumFields[0]} as 'id', me.${DbTableSteamModesEnumFields[1]} as 'name'
                FROM ${DbTables.modes} m
                JOIN ${DbTables.steam_modes_enum} me ON m.${DbTableModesFields[1]} = me.${DbTableSteamModesEnumFields[0]}
                WHERE m.${DbTableModesFields[2]} = ?`,
                [steamId])
                .then((response: GenericModelResponse) => {
                    const modes: IdNamePair[] = [];

                    if (response.data.length > 0) {
                        const rawModes: any = response.data;

                        rawModes.forEach((rawMode: any) => {
                            const mode: IdNamePair = { id: rawMode.id, name: rawMode.name };
                            modes.push(mode);
                        });
                    }

                    return resolve(modes);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game's screenshots.
     */
    private getGameScreenshots(steamId: number): Promise<string[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT s.${DbTableImagesFields[3]}
                FROM ${DbTables.images} s
                WHERE s.${DbTableImagesFields[1]} = ? AND s.${DbTableImagesFields[2]} = ${ImagesEnum.screenshot}`,
                [steamId])
                .then((response: GenericModelResponse) => {
                    const screenshots: string[] = [];

                    if (response.data.length > 0) {
                        const rawScreenshots: any = response.data;

                        rawScreenshots.forEach((rawScreenshot: any) => {
                            const screenshot: string = rawScreenshot.link;
                            screenshots.push(screenshot);
                        });
                    }

                    return resolve(screenshots);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game's genres.
     */
    private getGameGenres(steamId: number): Promise<IdNamePair[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT ge.${DbTableSteamGenreEnumFields[0]} as 'id', ge.${DbTableSteamGenreEnumFields[1]} as 'name'
                FROM ${DbTables.genres} g
                JOIN ${DbTables.steam_genre_enum} ge ON g.${DbTableGenresFields[1]} = ge.${DbTableSteamGenreEnumFields[0]}
                WHERE g.${DbTableGenresFields[2]} = ?`,
                [steamId])
                .then((response: GenericModelResponse) => {
                    const pairs: IdNamePair[] = [];

                    if (response.data.length > 0) {
                        const rawPairs: any = response.data;

                        rawPairs.forEach((rawPair: IdNamePair) => {
                            const pair: IdNamePair = { id: rawPair.id, name: rawPair.name };
                            pairs.push(pair);
                        });
                    }

                    return resolve(pairs);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game's platforms.
     */
    private getGamePlatforms(steamId: number): Promise<IdNamePair[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT pe.${DbTableSteamPlatformEnumFields[0]} as 'id', pe.${DbTableSteamPlatformEnumFields[1]} as 'name'
                FROM ${DbTables.platforms} p
                JOIN ${DbTables.steam_platform_enum} pe ON p.${DbTablePlatformsFields[1]} = pe.${DbTableSteamPlatformEnumFields[0]}
                WHERE p.${DbTablePlatformsFields[2]} = ?`,
                [steamId])
                .then((response: GenericModelResponse) => {
                    const pairs: IdNamePair[] = [];

                    if (response.data.length > 0) {
                        const rawPairs: any = response.data;

                        rawPairs.forEach((rawPair: IdNamePair) => {
                            const pair: IdNamePair = { id: rawPair.id, name: rawPair.name };
                            pairs.push(pair);
                        });
                    }

                    return resolve(pairs);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game's developer, publisher, and cover links.
     */
    private getGameDeveloperPublisherCovers(steamId: number): Promise<GameResponse> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT de.${DbTableSteamDeveloperEnumFields[1]} as 'developer', pe.${DbTableSteamPublisherEnumFields[1]} as 'publisher', c1.${DbTableImagesFields[3]} as 'cover', c2.${DbTableImagesFields[3]} as 'cover_thumb', c3.${DbTableImagesFields[3]} as 'cover_huge'
                FROM ${DbTables.steam_games} t
                LEFT JOIN developers d ON t.${DbTableSteamGamesFields[0]} = d.${DbTableDevelopersFields[2]}
                LEFT JOIN publishers p ON t.${DbTableSteamGamesFields[0]} = p.${DbTablePublishersFields[2]}
                LEFT JOIN ${DbTables.steam_developer_enum} de ON d.${DbTableDevelopersFields[1]} = de.${DbTableSteamDeveloperEnumFields[0]}
                LEFT JOIN ${DbTables.steam_publisher_enum} pe ON p.${DbTablePublishersFields[1]} = pe.${DbTableSteamPublisherEnumFields[0]}
                LEFT JOIN images c1 ON t.${DbTableSteamGamesFields[0]} = c1.${DbTableImagesFields[1]} AND c1.${DbTableImagesFields[2]} = ${ImagesEnum.cover}
                LEFT JOIN images c2 ON t.${DbTableSteamGamesFields[0]} = c2.${DbTableImagesFields[1]} AND c2.${DbTableImagesFields[2]} = ${ImagesEnum.cover_thumb}
                LEFT JOIN images c3 ON t.${DbTableSteamGamesFields[0]} = c3.${DbTableImagesFields[1]} AND c3.${DbTableImagesFields[2]} = ${ImagesEnum.cover_huge}
                WHERE t.${DbTableSteamGamesFields[0]} = ?`,
                [steamId])
                .then((response: GenericModelResponse) => {
                    let game: GameResponse = {
                        steamId: undefined,
                        name: undefined,
                        review: undefined,
                        total_review_count: undefined,
                        summary: undefined,
                        first_release_date: undefined,
                        video: undefined,
                        state: undefined,
                        developer: undefined,
                        publisher: undefined,
                        pricings: undefined,
                        cover: undefined,
                        cover_thumb: undefined,
                        cover_huge: undefined,
                        screenshots: undefined,
                        game_modes: undefined,
                        genres: undefined,
                        platforms: undefined,
                        log_dt: undefined
                    };

                    if (response.data.length > 0) {
                        const raw: any = response.data[0];
                        game = {
                            steamId: undefined,
                            name: undefined,
                            review: undefined,
                            total_review_count: undefined,
                            summary: undefined,
                            first_release_date: undefined,
                            video: undefined,
                            state: undefined,
                            developer: raw.developer,
                            publisher: raw.publisher,
                            pricings: undefined,
                            cover: raw.cover,
                            cover_thumb: raw.cover_thumb,
                            cover_huge: raw.cover_huge,
                            screenshots: undefined,
                            game_modes: undefined,
                            genres: undefined,
                            platforms: undefined,
                            log_dt: undefined
                        };

                    }

                    return resolve(game);

                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game's pricings.
     */
    private getGamePricings(steamId: number): Promise<PriceInfoResponse[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                `SELECT *
                FROM ${DbTables.pricings}
                WHERE ${DbTablePricingsFields[2]} = ?`,
                [steamId])
                .then((response: GenericModelResponse) => {
                    const pricings: PriceInfoResponse[] = [];

                    if (response.data.length > 0) {
                        const rawPricings: any = response.data;

                        rawPricings.forEach((rawPricing: any) => {
                            const pricing: PriceInfoResponse = {
                                steamGamesSysKeyId: rawPricing.steam_games_sys_key_id,
                                pricingEnumSysKeyId: rawPricing.pricings_enum_sys_key_id,
                                title: rawPricing.title,
                                price: rawPricing.price,
                                discount_percent: rawPricing.discount_percent,
                                discount_end_dt: rawPricing.discount_end_dt,
                                log_dt: rawPricing.log_dt
                            };
                            pricings.push(pricing);
                        });
                    }

                    return resolve(pricings);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        });

    }

    /**
     * Get game's list from stored procedure.
     */
    getGamesBySP(query: string, preparedVars: any[]): Promise <GameResponse[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                query,
                preparedVars)
                .then((dbResponse: GenericModelResponse) => {
                    const steamIds: number[] = dbResponse.data[0].map((x: any) => x.steam_games_sys_key_id);
                    const promises: Promise<GameResponse>[] = [];
                    const createGamePromise = (steamId: number): Promise<GameResponse> => {
                        return new Promise((resolve, reject) => {
                            this.getGame(steamId)
                                .then((game: GameResponse) => {
                                    return resolve(game);
                                })
                                .catch((error: string) => {
                                    return reject(error);
                                });
                        });
                    };

                    steamIds.forEach((steamId: number) => {
                        promises.push(createGamePromise(steamId));
                    });

                    Promise.all(promises)
                        .then((games: GameResponse[]) => {
                            return resolve(games);
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
     * Get game's list from query.
     */
    getGamesByQuery(query: string, preparedVars: any[]): Promise <GameResponse[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                query,
                preparedVars)
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const steamIds: number[] = dbResponse.data.map((x: any) => x.steam_games_sys_key_id);
                        const promises: Promise<GameResponse>[] = [];
                        const createGamePromise = (steamId: number): Promise<GameResponse> => {
                            return new Promise((resolve, reject) => {
                                this.getGame(steamId)
                                    .then((game: GameResponse) => {
                                        return resolve(game);
                                    })
                                    .catch((error: string) => {
                                        return reject(error);
                                    });
                            });
                        };

                        steamIds.forEach((steamId: number) => {
                            promises.push(createGamePromise(steamId));
                        });

                        Promise.all(promises)
                            .then((games: GameResponse[]) => {
                                return resolve(games);
                            })
                            .catch((error: string) => {
                                return reject(error);
                            });

                    } else {
                        return reject("Database error.");
                    }

                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    }

    /**
     * Get game's list from query.
     */
    getGameSuggestions(query: string): Promise <GameSuggestion[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                query,
                [])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const suggestions: GameSuggestion[] = [];
                        dbResponse.data.forEach((x: any) => {
                            suggestions.push({name: x.name, steamId: x.steam_games_sys_key_id });
                        });
                        return resolve(suggestions);

                    } else {
                        return reject("Database error.");
                    }

                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    }

    /**
     * Get enum by query.
     */
    getEnumByQuery(query: string): Promise <IdNamePair[]> {

        return new Promise((resolve, reject) => {
            this.custom(
                query,
                [])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const genres: IdNamePair[] = [];
                        dbResponse.data.forEach((x: any) => {
                            genres.push({id: x.id, name: x.name });
                        });
                        return resolve(genres);

                    } else {
                        return reject("Database error.");
                    }

                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    }

}

export const gameModel: GameModel = new GameModel();