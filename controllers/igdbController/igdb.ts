const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import {
    GameResponse,
    SingleNewsResponse,
    GenericErrorResponse
} from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames } from "./cache/upcomingGames/main";
import { recentGamesKeyExists, getCachedRecentGames, cacheRecentGames } from "./cache/recentlyReleased/main";
import { gameKeyExists, getCachedGame, cacheGame } from "./cache/games/main";
import { popularGamesKeyExists, getCachedPopularGames, cachePopularGames } from "./cache/popularGames/main";
import { resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames } from "./cache/results/main";
import { reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames } from "./cache/reviewedGames/main";
import { newsKeyExists, getCachedNews, cacheNews } from "./cache/news/main";

export const routes = new routeModel();

/* routes */
routes.addRoute("news", "/games/news");
routes.addRoute("reviewedgames", "/games/reviewed");
routes.addRoute("populargames", "/games/popular");
routes.addRoute("resultsgames", "/games/results");
routes.addRoute("upcominggames", "/games/upcoming");
routes.addRoute("recentgames", "/games/recent");
routes.addRoute("platformgames", "/games/platform/:id");
routes.addRoute("game", "/game/:id");

type CachedRouteTypes = GameResponse[] | GameResponse[] | SingleNewsResponse[] | GameResponse;

/* Generic route function for data cached in Redis */
export function GenericCachedRoute<T extends CachedRouteTypes> (keyExists: () => Promise<boolean>, getCachedData: () => Promise<T>, cacheData: () => Promise<T>): Promise<T> {

    return new Promise((resolve: any, reject: any) => {
        keyExists()
            .then((exists: boolean) => {
                if (exists) {
                    getCachedData()
                    .then((listItems: T) => {
                        return resolve(listItems);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
                } else {
                    cacheData()
                    .then((listItems: T) => {
                        return resolve(listItems);
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

/* Generic route function for data cached in Redis */
export function GenericCachedWithDataRoute<T extends CachedRouteTypes, V> (keyExists: (key: V) => Promise<boolean>, getCachedData: (key: V) => Promise<T>, cacheData: (key: V) => Promise<T>, param: V): Promise<T> {

    return new Promise((resolve: any, reject: any) => {
        keyExists(param)
            .then((exists: boolean) => {
                if (exists) {
                    getCachedData(param)
                    .then((listItems: T) => {
                        return resolve(listItems);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
                } else {
                    cacheData(param)
                    .then((listItems: T) => {
                        return resolve(listItems);
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

/* upcoming games */
router.post(routes.getRoute("upcominggames"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* reviewed games */
router.post(routes.getRoute("reviewedgames"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>( reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* news articles */
router.post(routes.getRoute("news"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<SingleNewsResponse[]>(newsKeyExists, getCachedNews, cacheNews)
        .then((data: SingleNewsResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* popular games */
router.post(routes.getRoute("populargames"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(popularGamesKeyExists, getCachedPopularGames, cachePopularGames)
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
router.post(routes.getRoute("recentgames"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(recentGamesKeyExists, getCachedRecentGames, cacheRecentGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* results games */
router.post(routes.getRoute("resultsgames"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedWithDataRoute<GameResponse[], string>(resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames, JSON.stringify(req.query))
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* individual games */
router.post(routes.getRoute("game"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedWithDataRoute<GameResponse, number>(gameKeyExists, getCachedGame, cacheGame, req.params.id)
        .then((data: GameResponse) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

export default router;