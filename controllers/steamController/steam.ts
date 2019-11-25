const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import {
    GameResponse,
    GenericModelResponse,
    DbTableSteamGamesFields,
    DbTables,
    GameSuggestion,
    Review,
    DbTableDevelopersFields,
    DbTableModesFields,
    Achievement,
    IdNamePair
} from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { gameModel } from "../../models/db/game/main";

export const routes = new routeModel();

/* routes */
routes.addRoute("news", "/games/news");
routes.addRoute("gamesquery", "/games/query");
routes.addRoute("gamesuggestions", "/gamesuggestions");
routes.addRoute("gamesimilar", "/game/similar/:id");
routes.addRoute("gamereviews", "/game/reviews/:id");
routes.addRoute("gameachievements", "/game/achievements/:id");
routes.addRoute("game", "/game/:id");
routes.addRoute("genres", "/genres");
routes.addRoute("platforms", "/platforms");
routes.addRoute("steamweeklydeals", "/weeklydeals");
routes.addRoute("steamcompmulti", "/compmulti");
routes.addRoute("steamfreeonlinemulti", "/freeonlinemulti");
routes.addRoute("steampaidonlinemulti", "/paidonlinemulti");
routes.addRoute("steammostdifficult", "/mostdifficult");
routes.addRoute("steamhorror", "/horror");
routes.addRoute("steammoba", "/moba");
routes.addRoute("steamvrhtc", "/vrhtc");
routes.addRoute("steamvrvive", "/vrvive");
routes.addRoute("steamvrwindows", "/vrwindows");
routes.addRoute("steamvrall", "/vrall");
routes.addRoute("steamaction", "/genre/action");
routes.addRoute("steamadventure", "/genre/adventure");
routes.addRoute("steamcasual", "/genre/casual");
routes.addRoute("steamstrategy", "/genre/strategy");
routes.addRoute("steamracing", "/genre/racing");
routes.addRoute("steamsimulation", "/genre/simulation");
routes.addRoute("steamsports", "/genre/sports");
routes.addRoute("steamindie", "/genre/indie");
routes.addRoute("steam2d", "/genre/2d");
routes.addRoute("steampuzzle", "/genre/puzzle");
routes.addRoute("steamshooter", "/genre/shooter");
routes.addRoute("steamrts", "/genre/rts");
routes.addRoute("steamtowerdefence", "/genre/towerdefence");
routes.addRoute("steamupcoming", "/upcoming");
routes.addRoute("steampopular", "/popular");
routes.addRoute("steamrecent", "/recent");
routes.addRoute("steamearlyaccess", "/earlyaccess");
routes.addRoute("steamopenworld", "/openworld");
routes.addRoute("steamfps", "/fps");
routes.addRoute("steamcards", "/cards");
routes.addRoute("steammmorpg", "/mmorpg");
routes.addRoute("steamsurvival", "/survival");
routes.addRoute("endingsoon", "/endingsoon");
routes.addRoute("recommended", "/recommended");
routes.addRoute("under5", "/under5");
routes.addRoute("under10", "/under10");
routes.addRoute("mostexpensive", "/mostexpensive");

export function GenericCachedRoute<T extends any> (cacheData: () => Promise<T>, path: string): Promise<T> {

    return new Promise((resolve: any, reject: any) => {
        gameModel.routeCacheExists(path)
            .then((exists: boolean) => {
                if (exists) {
                    gameModel.getRouteCache(path)
                    .then((listItems: T) => {
                        return resolve(listItems);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
                } else {
                    let data: T;
                    cacheData()
                    .then((listItems: T) => {
                        data = listItems;
                        return gameModel.insertRouteCache(data, path);
                    })
                    .then(() => {
                        return resolve(data);
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

export function GenericCachedWithDataRoute<T extends any, V> (cacheData: (param: V) => Promise<T>, param: V, path: string): Promise<T> {

    return new Promise((resolve: any, reject: any) => {
        gameModel.routeCacheExists(path)
            .then((exists: boolean) => {
                if (exists) {
                    gameModel.getRouteCache(path)
                    .then((listItems: T) => {
                        return resolve(listItems);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
                } else {
                    let data: T;
                    cacheData(param)
                    .then((listItems: T) => {
                        data = listItems;
                        return gameModel.insertRouteCache(data, path);
                    })
                    .then(() => {
                        return resolve(data);
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

export function GenericCachedWithQueryRoute<T extends any, V> (cacheData: (query: string, preparedVars: any[]) => Promise<T>, query: string, preparedVars: any[], path: string): Promise<T> {

    return new Promise((resolve: any, reject: any) => {
        gameModel.routeCacheExists(path)
            .then((exists: boolean) => {
                if (exists) {
                    gameModel.getRouteCache(path)
                    .then((listItems: T) => {
                        return resolve(listItems);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
                } else {
                    let data: T;
                    cacheData(query, preparedVars)
                    .then((listItems: T) => {
                        data = listItems;
                        return gameModel.insertRouteCache(data, path);
                    })
                    .then(() => {
                        return resolve(data);
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

/* a single game */
router.post(routes.getRoute("game"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithDataRoute<GameResponse, number>(gameModel.getGame, req.params.id, url)
        .then((data: GameResponse) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* get games by filter */
router.post(routes.getRoute("gamesquery"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;

    // validate filters
    if (req.query.query && req.query.query.length === 0) {
        genericResponse.error = "Please enter a game name.";
        return res.send(genericResponse);
    }

    if (req.query.released_after || req.query.released_before) {
        if (req.query.released_after && isNaN(req.query.released_after)) {
            genericResponse.error = "Please enter a valid released after date.";
            return res.send(genericResponse);
        }
        if (req.query.released_before && isNaN(req.query.released_before)) {
            genericResponse.error = "Please enter a valid released before date.";
            return res.send(genericResponse);
        }
    }

    if (req.query.price) {
        if (req.query.price.split(",").length !== 2) {
            genericResponse.error = "Please enter only a start and end price range.";
            return res.send(genericResponse);
        }
        req.query.price.split(",").forEach((val: any) => {
            if (isNaN(val)) {
                genericResponse.error = `Please enter a valid price point. Price ${val} is not valid.`;
                return res.send(genericResponse);
            }
        });
    } else {
        genericResponse.error = "Please enter a price range.";
        return res.send(genericResponse);
    }

    if (req.query.genres) {
        if (req.query.genres.split(",").length > 0) {
            req.query.genres.split(",").forEach((id: any) => {
                if (isNaN(id)) {
                    genericResponse.error = `Please enter valid genres. Genre id ${id} is not valid.`;
                    return res.send(genericResponse);
                }
            });
        } else {
            if (isNaN(req.query.genres)) {
                genericResponse.error = `Please enter valid genres. Genre id ${req.query.genres} is not valid.`;
                return res.send(genericResponse);
            }
        }
    }

    if (req.query.platforms) {
        if (req.query.platforms.split(",").length > 0) {
            req.query.platforms.split(",").forEach((id: any) => {
                if (isNaN(id)) {
                    genericResponse.error = `Please enter valid platforms. Platform id ${id} is not valid.`;
                    return res.send(genericResponse);
                }
            });
        } else {
            if (isNaN(req.query.platforms)) {
                genericResponse.error = `Please enter valid platforms. Platform id ${req.query.platforms} is not valid.`;
                return res.send(genericResponse);
            }
        }
    }

    if (req.query.sort && isNaN(req.query.sort)) {
        const splitSort: string[] = req.query.sort.split(`:`);

        if (splitSort.length != 2) {
            genericResponse.error = `Please enter a valid sorting option.`;
            return res.send(genericResponse);
        }

        if (splitSort[0] !== "price" && splitSort[0] !== "release_date" && splitSort[0] !== "alphabetic") {
            genericResponse.error = `Please enter a valid sorting property, must be price, release_date, or alphabetic.`;
            return res.send(genericResponse);
        }

        if (splitSort[1] !== "asc" && splitSort[1] !== "desc") {
            genericResponse.error = `Please enter a valid sorting direction, must be asc or desc.`;
            return res.send(genericResponse);
        }
    }

    const name: string = req.query.query && req.query.query.replace("'", "\\'");
    const priceStart: number = req.query.price.split(",")[0];
    const priceEnd: number = req.query.price.split(",")[1];
    const genreIds: string = req.query.genres;
    const platformIds: string = req.query.platforms;
    const releasedAfter: string = req.query.released_after && new Date(parseInt(req.query.released_after)).toISOString().split("T")[0];
    const releasedBefore: string = req.query.released_before && new Date(parseInt(req.query.released_before)).toISOString().split("T")[0];
    const sort: string = req.query.sort;

    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesBySP,
        `CALL searchGames(?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, priceStart, priceEnd, genreIds, platformIds, releasedAfter, releasedBefore, sort],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* a game's similar */
router.post(routes.getRoute("gamesimilar"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    const steamId: number = req.params.id;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableDevelopersFields[2]} FROM
        (SELECT 1 as seq, ${DbTableDevelopersFields[2]} FROM ${DbTables.developers} t where t.${DbTableDevelopersFields[1]} = (SELECT ${DbTableDevelopersFields[1]} FROM ${DbTables.developers} t WHERE t.${DbTableDevelopersFields[2]} = ${steamId})
        UNION
        SELECT 2 as seq, ${DbTableModesFields[2]} FROM ${DbTables.modes} t WHERE t.${DbTableModesFields[1]} IN (SELECT ${DbTableModesFields[1]} FROM ${DbTables.modes} t WHERE t.${DbTableModesFields[2]} = ${steamId}) ORDER BY RAND()) AS D
        WHERE ${DbTableSteamGamesFields[0]} != ?
        ORDER BY seq
        LIMIT 20`,
        [steamId],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* a game's reviews */
router.post(routes.getRoute("gamereviews"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithDataRoute<Review[], number>(gameModel.getGameReviews, req.params.id, url)
        .then((data: Review[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* a game's achievements */
router.post(routes.getRoute("gameachievements"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithDataRoute<Achievement[], number>(gameModel.getGameAchievements, req.params.id, url)
        .then((data: Achievement[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* game suggestions */
router.post(routes.getRoute("gamesuggestions"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameSuggestion[], string>(gameModel.getGameSuggestions,
        `SELECT ${DbTableSteamGamesFields[0]}, ${DbTableSteamGamesFields[1]}
        FROM ${DbTables.steam_games}`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* weekly deals games */
router.post(routes.getRoute("steamweeklydeals"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableSteamGamesFields[0]}
        FROM ${DbTables.steam_games}
        where steam_games_sys_key_id = 696170 OR first_release_date > DATE_SUB(now(), INTERVAL 6 MONTH) order by total_review_count desc
        LIMIT 10`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* get genres ordered by popularity */
router.post(routes.getRoute("genres"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<IdNamePair[], string>(gameModel.getEnumByQuery,
        `SELECT x.steam_genre_enum_sys_key_id as id, x.name
        FROM connectwithgamers.genres t
        JOIN steam_genre_enum x ON x.steam_genre_enum_sys_key_id = t.steam_genre_enum_sys_key_id
        GROUP BY t.steam_genre_enum_sys_key_id
        ORDER BY count(x.name) DESC`,
        [],
        url)
        .then((data: IdNamePair[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* get all platforms types */
router.post(routes.getRoute("platforms"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<IdNamePair[], string>(gameModel.getEnumByQuery,
        `SELECT x.steam_platform_enum_sys_key_id as id, x.name
        FROM steam_platform_enum x`,
        [],
        url)
        .then((data: IdNamePair[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* popular games */
router.post(routes.getRoute("steampopular"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableSteamGamesFields[0]}
        FROM ${DbTables.steam_games}
        where steam_games_sys_key_id = 696170 OR first_release_date > DATE_SUB(now(), INTERVAL 6 MONTH) order by total_review_count desc
        LIMIT 10`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* upcoming games */
router.post(routes.getRoute("steamupcoming"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select steam_games_sys_key_id from steam_games t
        where t.first_release_date IS NOT NULL AND t.first_release_date >= now()
        order by t.first_release_date asc
        limit 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* recent games */
router.post(routes.getRoute("steamrecent"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select steam_games_sys_key_id from steam_games t
        where t.first_release_date IS NOT NULL AND t.first_release_date <= now()
        order by t.first_release_date desc
        limit 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* early access games */
router.post(routes.getRoute("steamearlyaccess"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select steam_games_sys_key_id from steam_games t
        where t.first_release_date IS NOT NULL AND t.first_release_date >= now() AND t.steam_state_enum_sys_key_id = 2
        order by t.first_release_date asc
        limit 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* horror games */
router.post(routes.getRoute("steamhorror"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select t.steam_games_sys_key_id
        FROM steam_games t
        LEFT JOIN genres g ON g.genres_sys_key_id = (
                SELECT g1.genres_sys_key_id
                FROM genres g1
                JOIN steam_genre_enum ge ON ge.steam_genre_enum_sys_key_id = g1.steam_genre_enum_sys_key_id
                WHERE g1.steam_games_sys_key_id = t.steam_games_sys_key_id AND ge.name = 'Horror'
                LIMIT 1
            )
        WHERE t.first_release_date < NOW()
        ORDER BY t.first_release_date DESC
        LIMIT 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* deals ending soon games */
router.post(routes.getRoute("endingsoon"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select t.steam_games_sys_key_id from steam_games t
        join pricings p on p.steam_games_sys_key_id = t.steam_games_sys_key_id and p.pricings_enum_sys_key_id = 1
        where p.discount_end_dt > NOW() and p.discount_end_dt < (NOW() + INTERVAL 5 DAY)
        order by t.total_review_count desc
        LIMIT 10`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* recommended games */
router.post(routes.getRoute("recommended"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select t.steam_games_sys_key_id from steam_games t
        LEFT JOIN pricings pr ON pr.pricings_sys_key_id = (
            SELECT pr1.pricings_sys_key_id
            FROM pricings pr1
            WHERE pr1.steam_games_sys_key_id = t.steam_games_sys_key_id AND pr1.pricings_enum_sys_key_id = 1
            ORDER BY pr1.log_dt DESC
            LIMIT 1
        )
        order by t.first_release_date desc
        LIMIT 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* under 5 games */
router.post(routes.getRoute("under5"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select t.steam_games_sys_key_id, pr.price from steam_games t
        LEFT JOIN pricings pr ON pr.pricings_sys_key_id = (
            SELECT pr1.pricings_sys_key_id
            FROM pricings pr1
            WHERE pr1.steam_games_sys_key_id = t.steam_games_sys_key_id AND pr1.pricings_enum_sys_key_id = 1
            ORDER BY pr1.log_dt DESC
            LIMIT 1
        )
        where pr.discount_percent IS NOT NULL and pr.price between 1 and 5
        order by pr.log_dt desc
        LIMIT 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* under $10 games */
router.post(routes.getRoute("under10"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select t.steam_games_sys_key_id, pr.price from steam_games t
        LEFT JOIN pricings pr ON pr.pricings_sys_key_id = (
            SELECT pr1.pricings_sys_key_id
            FROM pricings pr1
            WHERE pr1.steam_games_sys_key_id = t.steam_games_sys_key_id AND pr1.pricings_enum_sys_key_id = 1
            ORDER BY pr1.log_dt DESC
            LIMIT 1
        )
        where pr.discount_percent IS NOT NULL and pr.price between 6 and 10
        order by pr.log_dt desc
        LIMIT 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* most expensive games */
router.post(routes.getRoute("mostexpensive"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWithQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select t.steam_games_sys_key_id, pr.price from steam_games t
        LEFT JOIN pricings pr ON pr.pricings_sys_key_id = (
            SELECT pr1.pricings_sys_key_id
            FROM pricings pr1
            WHERE pr1.steam_games_sys_key_id = t.steam_games_sys_key_id AND pr1.pricings_enum_sys_key_id = 1
            ORDER BY pr1.log_dt DESC
            LIMIT 1
        )
        where pr.discount_percent IS NOT NULL and pr.price between 6 and 10
        order by pr.price desc
        LIMIT 20`,
        [],
        url)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

export default router;