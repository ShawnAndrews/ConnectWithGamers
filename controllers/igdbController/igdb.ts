const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import {
    GameResponse,
    PredefinedGameResponse,
    PredefinedGamesResponse,
    SingleGameResponse,
    GenreListResponse,
    GenrePair,
    MultiNewsResponse,
    SingleNewsResponse,
    ThumbnailGamesResponse,
    ThumbnailGameResponse,
    SearchGameResponse,
    SearchGamesResponse,
    GenericErrorResponse
} from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames } from "./cache/upcomingGames/main";
import { recentGamesKeyExists, getCachedRecentGames, cacheRecentGames } from "./cache/recentlyReleased/main";
import { gameKeyExists, getCachedGame, cacheGame } from "./cache/games/main";
import { searchGamesKeyExists, getCachedSearchGames, cacheSearchGames } from "./cache/searchGames/main";
import { genreListKeyExists, getCachedGenreList, cacheGenreList } from "./cache/genreList/main";
import { popularGamesKeyExists, getCachedPopularGames, cachePopularGames } from "./cache/popularGames/main";
import { resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames } from "./cache/filter/main";
import { reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames } from "./cache/reviewedGames/main";
import { predefinedPopularGamesKeyExists, getCachedPredefinedPopularGames, cachePredefinedPopularGames } from "./cache/predefined/popular/main";
import { predefinedUpcomingGamesKeyExists, getCachedPredefinedUpcomingGames, cachePredefinedUpcomingGames } from "./cache/predefined/upcoming/main";
import { predefinedRecentGamesKeyExists, getCachedPredefinedRecentGames, cachePredefinedRecentGames } from "./cache/predefined/recent/main";
import { newsKeyExists, getCachedNews, cacheNews } from "./cache/news/main";

const routes = new routeModel();

/* routes */
routes.addRoute("predefinedpopular", "/games/predefined/popular");
routes.addRoute("predefinedrecent", "/games/predefined/recent");
routes.addRoute("predefinedupcoming", "/games/predefined/upcoming");
routes.addRoute("news", "/games/news");
routes.addRoute("reviewedgames", "/games/reviewed");
routes.addRoute("populargames", "/games/popular");
routes.addRoute("resultsgames", "/games/results");
routes.addRoute("searchgames", "/games/search/:query");
routes.addRoute("upcominggames", "/games/upcoming");
routes.addRoute("recentgames", "/games/recent");
routes.addRoute("platformgames", "/games/platform/:id");
routes.addRoute("genregames", "/games/genre/:id");
routes.addRoute("genrelist", "/games/genrelist");
routes.addRoute("game", "/game/:id");

/* Generic route function for data cached in Redis */
function GenericCachedRoute<T extends ThumbnailGameResponse | PredefinedGameResponse | SingleNewsResponse | GenrePair | SearchGameResponse> (req: Request, res: Response, keyExists: () => Promise<boolean>, getCachedData: () => Promise<T[]>, cacheData: () => Promise<T[]>): any {

    const listResponse: GenericErrorResponse = { error: undefined };

    keyExists()
        .then((exists: boolean) => {
            if (exists) {
                getCachedData()
                .then((listItems: T[]) => {
                    listResponse.data = listItems;
                    return res.send(listResponse);
                })
                .catch((error: string) => {
                    listResponse.error = error;
                    return res.send(listResponse);
                });
            } else {
                cacheData()
                .then((listItems: T[]) => {
                    listResponse.data = listItems;
                    return res.send(listResponse);
                })
                .catch((error: string) => {
                    listResponse.error = error;
                    return res.send(listResponse);
                });
            }
        })
        .catch((error: string) => {
            listResponse.error = error;
            return res.send(listResponse);
        });

}

/* Generic route function for data cached in Redis */
function GenericCachedWithDataRoute<T extends ThumbnailGameResponse | PredefinedGameResponse | SingleNewsResponse | GenrePair | SearchGameResponse, V> (req: Request, res: Response, keyExists: (key: V) => Promise<boolean>, getCachedData: (key: V) => Promise<T[]>, cacheData: (key: V) => Promise<T[]>, param: V): any {

    const listResponse: GenericErrorResponse = { error: undefined };

    keyExists(param)
        .then((exists: boolean) => {
            if (exists) {
                getCachedData(param)
                .then((listItems: T[]) => {
                    listResponse.data = listItems;
                    return res.send(listResponse);
                })
                .catch((error: string) => {
                    listResponse.error = error;
                    return res.send(listResponse);
                });
            } else {
                cacheData(param)
                .then((listItems: T[]) => {
                    listResponse.data = listItems;
                    return res.send(listResponse);
                })
                .catch((error: string) => {
                    listResponse.error = error;
                    return res.send(listResponse);
                });
            }
        })
        .catch((error: string) => {
            listResponse.error = error;
            return res.send(listResponse);
        });

}

/* predefined recent games */
router.post(routes.getRoute("predefinedrecent"), (req: Request, res: Response) => {
    GenericCachedRoute<ThumbnailGameResponse>(req, res, predefinedRecentGamesKeyExists, getCachedPredefinedRecentGames, cachePredefinedRecentGames);
});

/* predefined upcoming games */
router.post(routes.getRoute("predefinedupcoming"), (req: Request, res: Response) => {
    GenericCachedRoute<ThumbnailGameResponse>(req, res, predefinedUpcomingGamesKeyExists, getCachedPredefinedUpcomingGames, cachePredefinedUpcomingGames);
});

/* predefined popular games */
router.post(routes.getRoute("predefinedpopular"), (req: Request, res: Response) => {
    GenericCachedRoute<ThumbnailGameResponse>(req, res, predefinedPopularGamesKeyExists, getCachedPredefinedPopularGames, cachePredefinedPopularGames);
});

/* upcoming games */
router.post(routes.getRoute("upcominggames"), (req: Request, res: Response) => {
    GenericCachedRoute<PredefinedGameResponse>(req, res, upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames);
});

/* reviewed games */
router.post(routes.getRoute("reviewedgames"), (req: Request, res: Response) => {
    GenericCachedRoute<PredefinedGameResponse>(req, res, reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames);
});

/* popular games */
router.post(routes.getRoute("news"), (req: Request, res: Response) => {
    GenericCachedRoute<SingleNewsResponse>(req, res, newsKeyExists, getCachedNews, cacheNews);
});

/* popular games */
router.post(routes.getRoute("populargames"), (req: Request, res: Response) => {
    GenericCachedRoute<PredefinedGameResponse>(req, res, popularGamesKeyExists, getCachedPopularGames, cachePopularGames);
});

/* recent games */
router.post(routes.getRoute("recentgames"), (req: Request, res: Response) => {
    GenericCachedRoute<PredefinedGameResponse>(req, res, recentGamesKeyExists, getCachedRecentGames, cacheRecentGames);
});

/* genre list */
router.post(routes.getRoute("genrelist"), (req: Request, res: Response) => {
    GenericCachedRoute<GenrePair>(req, res, genreListKeyExists, getCachedGenreList, cacheGenreList);
});

/* search games */
router.post(routes.getRoute("searchgames"), (req: Request, res: Response) => {
    GenericCachedWithDataRoute<SearchGameResponse, string>(req, res, searchGamesKeyExists, getCachedSearchGames, cacheSearchGames, req.params.query);
});

/* results games */
router.post(routes.getRoute("resultsgames"), (req: Request, res: Response) => {
    GenericCachedWithDataRoute<ThumbnailGameResponse, string>(req, res, resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames, JSON.stringify(req.query));
});

/* games */
router.post(routes.getRoute("game"), (req: Request, res: Response) => {
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