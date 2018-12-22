const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import {
    GameResponse,
    PredefinedGameResponse,
    SingleNewsResponse,
    ThumbnailGameResponse,
    SearchGameResponse,
    GenericErrorResponse
} from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames } from "./cache/upcomingGames/main";
import { recentGamesKeyExists, getCachedRecentGames, cacheRecentGames } from "./cache/recentlyReleased/main";
import { gameKeyExists, getCachedGame, cacheGame } from "./cache/games/main";
import { popularGamesKeyExists, getCachedPopularGames, cachePopularGames } from "./cache/popularGames/main";
import { resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames } from "./cache/filter/main";
import { reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames } from "./cache/reviewedGames/main";
import { predefinedPopularGamesKeyExists, getCachedPredefinedPopularGames, cachePredefinedPopularGames } from "./cache/predefined/popular/main";
import { predefinedUpcomingGamesKeyExists, getCachedPredefinedUpcomingGames, cachePredefinedUpcomingGames } from "./cache/predefined/upcoming/main";
import { predefinedRecentGamesKeyExists, getCachedPredefinedRecentGames, cachePredefinedRecentGames } from "./cache/predefined/recent/main";
import { newsKeyExists, getCachedNews, cacheNews } from "./cache/news/main";

export const routes = new routeModel();

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
routes.addRoute("game", "/game/:id");

type CachedRouteTypes = ThumbnailGameResponse[] | PredefinedGameResponse[] | SingleNewsResponse[] | SearchGameResponse[] | GameResponse;

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

/* predefined recent games */
router.post(routes.getRoute("predefinedrecent"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<ThumbnailGameResponse[]>(predefinedRecentGamesKeyExists, getCachedPredefinedRecentGames, cachePredefinedRecentGames)
        .then((data: ThumbnailGameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* predefined upcoming games */
router.post(routes.getRoute("predefinedupcoming"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<ThumbnailGameResponse[]>(predefinedUpcomingGamesKeyExists, getCachedPredefinedUpcomingGames, cachePredefinedUpcomingGames)
        .then((data: ThumbnailGameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* predefined popular games */
router.post(routes.getRoute("predefinedpopular"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<ThumbnailGameResponse[]>(predefinedPopularGamesKeyExists, getCachedPredefinedPopularGames, cachePredefinedPopularGames)
        .then((data: ThumbnailGameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* upcoming games */
router.post(routes.getRoute("upcominggames"), (req: Request, res: Response) => {
    const genericResponse: GenericErrorResponse = { error: undefined };
    GenericCachedRoute<PredefinedGameResponse[]>(upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames)
        .then((data: PredefinedGameResponse[]) => {
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
    GenericCachedRoute<PredefinedGameResponse[]>( reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames)
        .then((data: PredefinedGameResponse[]) => {
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
    GenericCachedRoute<PredefinedGameResponse[]>(popularGamesKeyExists, getCachedPopularGames, cachePopularGames)
        .then((data: PredefinedGameResponse[]) => {
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
    GenericCachedRoute<PredefinedGameResponse[]>(recentGamesKeyExists, getCachedRecentGames, cacheRecentGames)
        .then((data: PredefinedGameResponse[]) => {
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
    GenericCachedWithDataRoute<ThumbnailGameResponse[], string>(resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames, JSON.stringify(req.query))
        .then((data: ThumbnailGameResponse[]) => {
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