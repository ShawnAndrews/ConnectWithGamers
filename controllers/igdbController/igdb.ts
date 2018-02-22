const express = require("express");
const router = express.Router();
const igdb = require("igdb-api-node").default;
import {
    ResponseModel,
    GameListEntryResponse,
    GameResponse,
    UpcomingGameResponse,
    RecentGameResponse,
    PlatformGameResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";
import config from "../../config";
import { formatDate } from "../../util/main";
import {
    upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames,
    recentGamesKeyExists, getCachedRecentGames, cacheRecentGames,
    platformGamesKeyExists, getCachedPlatformGames, cachePlatformGames,
    gameKeyExists, getCachedGame, cacheGame,
    searchGamesKeyExists, getCachedSearchGames, cacheSearchGames } from "./cache";

const routes = new routeModel();
const client = igdb(config.igdb.key);

/* routes */
routes.addRoute("searchgames", "/games/search/:query");
routes.addRoute("upcominggames", "/games/upcoming");
routes.addRoute("recentgames", "/games/recent");
routes.addRoute("platformgames", "/games/platform/:id");
routes.addRoute("game", "/game/:id");

router.post(routes.getRoute("searchgames"), (req: any, res: any) => {

    const query: string = req.params.query;

    searchGamesKeyExists(query)
        .then((exists: boolean) => {
            if (exists) {
                getCachedSearchGames(query)
                .then((games: GameListEntryResponse[]) => {
                    return res.send(games);
                })
                .catch((err: any) => {
                    throw(err);
                });
            } else {
                cacheSearchGames(query)
                .then((gamesList: GameListEntryResponse[]) => {
                    return res.send(gamesList);
                })
                .catch((err: any) => {
                    throw(err);
                });
            }
        })
        .catch((err: any) => {
            throw err;
        });

});

router.post(routes.getRoute("upcominggames"), (req: any, res: any) => {

    upcomingGamesKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                console.log(`Getting cached upcominggames...`);
                getCachedUpcomingGames()
                .then((upcomingGame: UpcomingGameResponse[]) => {
                    return res.send(upcomingGame);
                })
                .catch((err: any) => {
                    throw(err);
                });
            } else {
                console.log(`Cacheing upcominggames...`);
                cacheUpcomingGames()
                .then((upcomingGame: UpcomingGameResponse[]) => {
                    return res.send(upcomingGame);
                })
                .catch((err: any) => {
                    throw(err);
                });
            }
        })
        .catch((err: any) => {
            throw err;
        });

});

router.post(routes.getRoute("recentgames"), (req: any, res: any) => {

    recentGamesKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                console.log(`Getting cached recentgames...`);
                getCachedRecentGames()
                .then((recentGame: RecentGameResponse[]) => {
                    return res.send(recentGame);
                })
                .catch((err: any) => {
                    throw(err);
                });
            } else {
                console.log(`Cacheing recentgames...`);
                cacheRecentGames()
                .then((recentGame: RecentGameResponse[]) => {
                    return res.send(recentGame);
                })
                .catch((err: any) => {
                    throw(err);
                });
            }
        })
        .catch((err: any) => {
            throw err;
        });

});

router.post(routes.getRoute("platformgames"), (req: any, res: any) => {
    const platformId: number = Number(req.params.id);

    platformGamesKeyExists(platformId)
        .then((exists: boolean) => {
            if (exists) {
                console.log(`Getting cached platformgames...`);
                getCachedPlatformGames(platformId)
                .then((platformGames: PlatformGameResponse[]) => {
                    return res.send(platformGames);
                })
                .catch((err: any) => {
                    throw(err);
                });
            } else {
                console.log(`Cacheing platformgames...`);
                cachePlatformGames(platformId)
                .then((platformGames: PlatformGameResponse[]) => {
                    return res.send(platformGames);
                })
                .catch((err: any) => {
                    throw(err);
                });
            }
        })
        .catch((err: any) => {
            throw err;
        });

});

router.post(routes.getRoute("game"), (req: any, res: any) => {

    const gameId: number = req.params.id;

    gameKeyExists(gameId)
        .then((exists: boolean) => {
            if (exists) {
                getCachedGame(gameId)
                .then((game: GameResponse) => {
                    return res.send(game);
                })
                .catch((err: any) => {
                    throw(err);
                });
            } else {
                cacheGame(gameId)
                .then((game: GameResponse) => {
                    return res.send(game);
                })
                .catch((err: any) => {
                    throw(err);
                });
            }
        })
        .catch((err: any) => {
            throw err;
        });

});

export default router;