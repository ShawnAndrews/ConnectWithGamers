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
    DbTableModesFields
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
routes.addRoute("game", "/game/:id");
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

export function GenericCachedWitQueryRoute<T extends any, V> (cacheData: (query: string, preparedVars: any[]) => Promise<T>, query: string, preparedVars: any[], path: string): Promise<T> {

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
    const queryFilter: string = req.query.query;
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableSteamGamesFields[0]} FROM ${DbTables.steam_games} WHERE ${DbTableSteamGamesFields[1]} LIKE ? LIMIT 500`,
        [`%${queryFilter}%`],
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
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
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

/* game suggestions */
router.post(routes.getRoute("gamesuggestions"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWitQueryRoute<GameSuggestion[], string>(gameModel.getGameSuggestions,
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
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableSteamGamesFields[0]}
        FROM ${DbTables.steam_games}
        where steam_games_sys_key_id = 289070 OR first_release_date > DATE_SUB(now(), INTERVAL 6 MONTH) order by total_review_count desc
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

/* popular games */
router.post(routes.getRoute("steampopular"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableSteamGamesFields[0]}
        FROM ${DbTables.steam_games}
        where steam_games_sys_key_id = 289070 OR first_release_date > DATE_SUB(now(), INTERVAL 6 MONTH) order by total_review_count desc
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
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
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
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
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
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
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
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableSteamGamesFields[0]}
        FROM ${DbTables.steam_games}
        where steam_games_sys_key_id = 289070 OR first_release_date > DATE_SUB(now(), INTERVAL 6 MONTH) order by total_review_count desc
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

/* deals ending soon games */
router.post(routes.getRoute("endingsoon"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const url: string = req.url;
    GenericCachedWitQueryRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `select t.steam_games_sys_key_id, t.name, p.discount_end_dt from steam_games t
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

export default router;