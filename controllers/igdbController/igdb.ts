const express = require("express");
const router = express.Router();
import {
    GameListEntryResponse,
    GameResponse,
    UpcomingGameResponse,
    RecentGameResponse,
    PlatformGameResponse,
    SearchGamesResponse,
    UpcomingGamesResponse,
    RecentGamesResponse,
    PlatformGamesResponse,
    SingleGameResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import {
    upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames,
    recentGamesKeyExists, getCachedRecentGames, cacheRecentGames,
    platformGamesKeyExists, getCachedPlatformGames, cachePlatformGames,
    gameKeyExists, getCachedGame, cacheGame,
    searchGamesKeyExists, getCachedSearchGames, cacheSearchGames } from "./cache";

const routes = new routeModel();

/* routes */
routes.addRoute("searchgames", "/games/search/:query");
routes.addRoute("upcominggames", "/games/upcoming");
routes.addRoute("recentgames", "/games/recent");
routes.addRoute("platformgames", "/games/platform/:id");
routes.addRoute("game", "/game/:id");

router.post(routes.getRoute("searchgames"), (req: any, res: any) => {

    const searchGamesResponse: SearchGamesResponse = { error: undefined };
    const query: string = req.params.query;

    searchGamesKeyExists(query)
        .then((exists: boolean) => {
            if (exists) {
                getCachedSearchGames(query)
                .then((gamesList: GameListEntryResponse[]) => {
                    searchGamesResponse.data = gamesList;
                    return res.send(searchGamesResponse);
                })
                .catch((error: string) => {
                    searchGamesResponse.error = error;
                    return res.send(searchGamesResponse);
                });
            } else {
                cacheSearchGames(query)
                .then((gamesList: GameListEntryResponse[]) => {
                    searchGamesResponse.data = gamesList;
                    return res.send(searchGamesResponse);
                })
                .catch((error: string) => {
                    searchGamesResponse.error = error;
                    return res.send(searchGamesResponse);
                });
            }
        })
        .catch((error: string) => {
            searchGamesResponse.error = error;
            return res.send(searchGamesResponse);
        });

});

router.post(routes.getRoute("upcominggames"), (req: any, res: any) => {

    const upcomingGamesResponse: UpcomingGamesResponse = { error: undefined };

    upcomingGamesKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                getCachedUpcomingGames()
                .then((upcomingGames: UpcomingGameResponse[]) => {
                    upcomingGamesResponse.data = upcomingGames;
                    return res.send(upcomingGamesResponse);
                })
                .catch((error: string) => {
                    upcomingGamesResponse.error = error;
                    return res.send(upcomingGamesResponse);
                });
            } else {
                cacheUpcomingGames()
                .then((upcomingGames: UpcomingGameResponse[]) => {
                    upcomingGamesResponse.data = upcomingGames;
                    return res.send(upcomingGamesResponse);
                })
                .catch((error: string) => {
                    upcomingGamesResponse.error = error;
                    return res.send(upcomingGamesResponse);
                });
            }
        })
        .catch((error: string) => {
            upcomingGamesResponse.error = error;
            return res.send(upcomingGamesResponse);
        });

});

router.post(routes.getRoute("recentgames"), (req: any, res: any) => {

    const recentGamesResponse: RecentGamesResponse = { error: undefined };

    recentGamesKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                getCachedRecentGames()
                .then((recentGames: RecentGameResponse[]) => {
                    recentGamesResponse.data = recentGames;
                    return res.send(recentGamesResponse);
                })
                .catch((error: string) => {
                    recentGamesResponse.error = error;
                    return res.send(recentGamesResponse);
                });
            } else {
                cacheRecentGames()
                .then((recentGames: RecentGameResponse[]) => {
                    recentGamesResponse.data = recentGames;
                    return res.send(recentGamesResponse);
                })
                .catch((error: string) => {
                    recentGamesResponse.error = error;
                    return res.send(recentGamesResponse);
                });
            }
        })
        .catch((error: string) => {
            recentGamesResponse.error = error;
            return res.send(recentGamesResponse);
        });

});

router.post(routes.getRoute("platformgames"), (req: any, res: any) => {

    const platformGamesResponse: PlatformGamesResponse = { error: undefined };
    const platformId: number = Number(req.params.id);

    platformGamesKeyExists(platformId)
        .then((exists: boolean) => {
            if (exists) {
                getCachedPlatformGames(platformId)
                .then((platformGames: PlatformGameResponse[]) => {
                    platformGamesResponse.data = platformGames;
                    return res.send(platformGamesResponse);
                })
                .catch((error: string) => {
                    platformGamesResponse.error = error;
                    return res.send(platformGamesResponse);
                });
            } else {
                cachePlatformGames(platformId)
                .then((platformGames: PlatformGameResponse[]) => {
                    platformGamesResponse.data = platformGames;
                    return res.send(platformGamesResponse);
                })
                .catch((error: string) => {
                    platformGamesResponse.error = error;
                    return res.send(platformGamesResponse);
                });
            }
        })
        .catch((error: string) => {
            platformGamesResponse.error = error;
            return res.send(platformGamesResponse);
        });

});

router.post(routes.getRoute("game"), (req: any, res: any) => {

    const singleGameResponse: SingleGameResponse = { error: undefined };
    const gameId: number = req.params.id;

    gameKeyExists(gameId)
        .then((exists: boolean) => {
            if (exists) {
                getCachedGame(gameId)
                .then((game: GameResponse) => {
                    singleGameResponse.data = game;
                    return res.send(singleGameResponse);
                })
                .catch((error: string) => {
                    singleGameResponse.error = error;
                    return res.send(singleGameResponse);
                });
            } else {
                cacheGame(gameId)
                .then((game: GameResponse) => {
                    singleGameResponse.data = game;
                    return res.send(singleGameResponse);
                })
                .catch((error: string) => {
                    singleGameResponse.error = error;
                    return res.send(singleGameResponse);
                });
            }
        })
        .catch((error: string) => {
            singleGameResponse.error = error;
            return res.send(singleGameResponse);
        });

});

export default router;