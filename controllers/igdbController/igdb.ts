const express = require("express");
const router = express.Router();
import {
    GameListEntryResponse,
    GameResponse,
    UpcomingGameResponse,
    RecentGameResponse,
    DbPlatformGamesResponse,
    PopularGamesResponse,
    PopularGameResponse,
    SearchGamesResponse,
    UpcomingGamesResponse,
    RecentGamesResponse,
    PlatformGamesResponse,
    SingleGameResponse,
    GenreListResponse,
    GenrePair,
    GenreGamesResponse,
    DbGenreGamesResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames } from "./cache/upcomingGames/main";
import { recentGamesKeyExists, getCachedRecentGames, cacheRecentGames } from "./cache/recentlyReleased/main";
import { platformGamesKeyExists, getCachedPlatformGames, cachePlatformGames } from "./cache/platformGames/main";
import { genreGamesKeyExists, getCachedGenreGames, cacheGenreGames } from "./cache/genreGames/main";
import { gameKeyExists, getCachedGame, cacheGame } from "./cache/games/main";
import { searchGamesKeyExists, getCachedSearchGames, cacheSearchGames } from "./cache/searchGames/main";
import { genreListKeyExists, getCachedGenreList, cacheGenreList } from "./cache/genreList/main";
import { popularGamesKeyExists, getCachedPopularGames, cachePopularGames } from "./cache/popularGames/main";

const routes = new routeModel();

/* routes */
routes.addRoute("populargames", "/games/popular");
routes.addRoute("searchgames", "/games/search/:query");
routes.addRoute("upcominggames", "/games/upcoming");
routes.addRoute("recentgames", "/games/recent");
routes.addRoute("platformgames", "/games/platform/:id");
routes.addRoute("genregames", "/games/genre/:id");
routes.addRoute("genrelist", "/games/genrelist");
routes.addRoute("game", "/game/:id");

/* search games */
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

/* upcoming games */
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

/* popular games */
router.post(routes.getRoute("populargames"), (req: any, res: any) => {

    const PopularGamesResponse: PopularGamesResponse = { error: undefined };

    popularGamesKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                getCachedPopularGames()
                .then((popularGames: PopularGameResponse[]) => {
                    PopularGamesResponse.data = popularGames;
                    return res.send(PopularGamesResponse);
                })
                .catch((error: string) => {
                    PopularGamesResponse.error = error;
                    return res.send(PopularGamesResponse);
                });
            } else {
                cachePopularGames()
                .then((popularGames: PopularGameResponse[]) => {
                    PopularGamesResponse.data = popularGames;
                    return res.send(PopularGamesResponse);
                })
                .catch((error: string) => {
                    PopularGamesResponse.error = error;
                    return res.send(PopularGamesResponse);
                });
            }
        })
        .catch((error: string) => {
            PopularGamesResponse.error = error;
            return res.send(PopularGamesResponse);
        });

});

/* recent games */
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

/* platform games */
router.post(routes.getRoute("platformgames"), (req: any, res: any) => {

    const platformGamesResponse: PlatformGamesResponse = { error: undefined };
    const platformId: number = Number(req.params.id);

    platformGamesKeyExists(platformId)
        .then((exists: boolean) => {
            if (exists) {
                getCachedPlatformGames(platformId)
                .then((platformGames: DbPlatformGamesResponse) => {
                    platformGamesResponse.data = platformGames;
                    return res.send(platformGamesResponse);
                })
                .catch((error: string) => {
                    platformGamesResponse.error = error;
                    return res.send(platformGamesResponse);
                });
            } else {
                cachePlatformGames(platformId)
                .then((platformGames: DbPlatformGamesResponse) => {
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

/* genre games */
router.post(routes.getRoute("genregames"), (req: any, res: any) => {

    const genreGamesResponse: GenreGamesResponse = { error: undefined };
    const genreId: number = Number(req.params.id);
    genreGamesKeyExists(genreId)
        .then((exists: boolean) => {
            if (exists) {
                getCachedGenreGames(genreId)
                .then((genreGames: DbGenreGamesResponse) => {
                    genreGamesResponse.data = genreGames;
                    return res.send(genreGamesResponse);
                })
                .catch((error: string) => {
                    genreGamesResponse.error = error;
                    return res.send(genreGamesResponse);
                });
            } else {
                cacheGenreGames(genreId)
                .then((genreGames: DbGenreGamesResponse) => {
                    genreGamesResponse.data = genreGames;
                    return res.send(genreGamesResponse);
                })
                .catch((error: string) => {
                    genreGamesResponse.error = error;
                    return res.send(genreGamesResponse);
                });
            }
        })
        .catch((error: string) => {
            genreGamesResponse.error = error;
            return res.send(genreGamesResponse);
        });

});

/* genre list */
router.post(routes.getRoute("genrelist"), (req: any, res: any) => {

    const genreListResponse: GenreListResponse = { error: undefined };

    genreListKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                getCachedGenreList()
                .then((genreList: GenrePair[]) => {
                    genreListResponse.data = genreList;
                    return res.send(genreListResponse);
                })
                .catch((error: string) => {
                    genreListResponse.error = error;
                    return res.send(genreListResponse);
                });
            } else {
                cacheGenreList()
                .then((genreList: GenrePair[]) => {
                    genreListResponse.data = genreList;
                    return res.send(genreListResponse);
                })
                .catch((error: string) => {
                    genreListResponse.error = error;
                    return res.send(genreListResponse);
                });
            }
        })
        .catch((error: string) => {
            genreListResponse.error = error;
            return res.send(genreListResponse);
        });

});

/* games */
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