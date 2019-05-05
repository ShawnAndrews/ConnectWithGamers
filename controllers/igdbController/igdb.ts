const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import {
    GameResponse,
    NewsArticle,
    GenericModelResponse
} from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { gameKeyExists, getCachedGame, cacheGame } from "./cache/game/main";
import { resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames } from "./cache/results/main";
import { newsKeyExists, getCachedNews, cacheNews } from "./cache/news/main";
import { steamWeeklyDealsKeyExists, getSteamWeeklyDealsGames, cacheSteamWeeklyDealsGames } from "./cache/steam/weeklyDeals/main";
import { steamCompMultiExists, getSteamCompMultiGames, cacheSteamCompMultiGames } from "./cache/steam/compMulti/main";
import { steamFreeOnlineMultiKeyExists, getSteamFreeOnlineMultiGames, cacheSteamFreeOnlineMultiGames } from "./cache/steam/freeOnlineMulti/main";
import { steamPaidOnlineMultiExists, getSteamPaidOnlineMultiGames, cacheSteamPaidOnlineMultiGames } from "./cache/steam/paidOnlineMulti/main";
import { steamMostDifficultExists, getSteamMostDifficultGames, cacheSteamMostDifficultGames } from "./cache/steam/mostDifficult/main";
import { steamHorrorExists, getSteamHorrorGames, cacheSteamHorrorGames } from "./cache/steam/horror/main";
import { steamMobaKeyExists, getSteamMobaGames, cacheSteamMobaGames } from "./cache/steam/moba/main";
import { steamVrHtcKeyExists, getSteamVrHtcGames, cacheSteamVrHtcGames } from "./cache/steam/vrHtc/main";
import { steamVrViveKeyExists, getSteamVrViveGames, cacheSteamVrViveGames } from "./cache/steam/vrVive/main";
import { steamVrWindowsKeyExists, getSteamVrWindowsGames, cacheSteamVrWindowsGames } from "./cache/steam/vrWindows/main";
import { steamVrAllExists, getSteamVrAllGames, cacheSteamVrAllGames } from "./cache/steam/vrAll/main";
import { steamActionExists, getSteamActionGames, cacheSteamActionGames } from "./cache/steam/genres/action/main";
import { steamAdventureExists, getSteamAdventureGames, cacheSteamAdventureGames } from "./cache/steam/genres/adventure/main";
import { steamCasualExists, getSteamCasualGames, cacheSteamCasualGames } from "./cache/steam/genres/casual/main";
import { steamStrategyExists, getSteamStrategyGames, cacheSteamStrategyGames } from "./cache/steam/genres/strategy/main";
import { steamRacingExists, getSteamRacingGames, cacheSteamRacingGames } from "./cache/steam/genres/racing/main";
import { steamSimulationExists, getSteamSimulationGames, cacheSteamSimulationGames } from "./cache/steam/genres/simulation/main";
import { steamSportsExists, getSteamSportsGames, cacheSteamSportsGames } from "./cache/steam/genres/sports/main";
import { steamIndieExists, getSteamIndieGames, cacheSteamIndieGames } from "./cache/steam/genres/indie/main";
import { steam2dExists, getSteam2dGames, cacheSteam2dGames } from "./cache/steam/genres/2d/main";
import { steamPuzzleExists, getSteamPuzzleGames, cacheSteamPuzzleGames } from "./cache/steam/genres/puzzle/main";
import { steamShooterExists, getSteamShooterGames, cacheSteamShooterGames } from "./cache/steam/genres/shooter/main";
import { steamRtsExists, getSteamRtsGames, cacheSteamRtsGames } from "./cache/steam/genres/rts/main";
import { steamTowerDefenceExists, getSteamTowerDefenceGames, cacheSteamTowerDefenceGames } from "./cache/steam/genres/towerdefence/main";
import { steamUpcomingExists, getSteamUpcomingGames, cacheSteamUpcomingGames } from "./cache/steam/upcoming/main";
import { steamPopularExists, getSteamPopularGames, cacheSteamPopularGames } from "./cache/steam/popular/main";
import { steamRecentExists, getSteamRecentGames, cacheSteamRecentGames } from "./cache/steam/recent/main";
import { steamEarlyAccessExists, getSteamEarlyAccessGames, cacheSteamEarlyAccessGames } from "./cache/steam/earlyaccess/main";
import { steamOpenWorldExists, getSteamOpenWorldGames, cacheSteamOpenWorldGames } from "./cache/steam/openworld/main";
import { steamFPSExists, getSteamFPSGames, cacheSteamFPSGames } from "./cache/steam/fps/main";
import { steamCardsExists, getSteamCardsGames, cacheSteamCardsGames } from "./cache/steam/cards/main";
import { steamMMORPGExists, getSteamMMORPGGames, cacheSteamMMORPGGames } from "./cache/steam/mmorpg/main";
import { steamSurvivalExists, getSteamSurvivalGames, cacheSteamSurvivalGames } from "./cache/steam/survival/main";

export const routes = new routeModel();

/* routes */
routes.addRoute("news", "/games/news");
routes.addRoute("resultsgames", "/games/results");
routes.addRoute("game", "/game/:id");
routes.addRoute("steamweeklydeals", "/steam/weeklydeals");
routes.addRoute("steamcompmulti", "/steam/compmulti");
routes.addRoute("steamfreeonlinemulti", "/steam/freeonlinemulti");
routes.addRoute("steampaidonlinemulti", "/steam/paidonlinemulti");
routes.addRoute("steammostdifficult", "/steam/mostdifficult");
routes.addRoute("steamhorror", "/steam/horror");
routes.addRoute("steammoba", "/steam/moba");
routes.addRoute("steamvrhtc", "/steam/vrhtc");
routes.addRoute("steamvrvive", "/steam/vrvive");
routes.addRoute("steamvrwindows", "/steam/vrwindows");
routes.addRoute("steamvrall", "/steam/vrall");
routes.addRoute("steamgenreaction", "/steam/genre/action");
routes.addRoute("steamgenreadventure", "/steam/genre/adventure");
routes.addRoute("steamgenrecasual", "/steam/genre/casual");
routes.addRoute("steamgenrestrategy", "/steam/genre/strategy");
routes.addRoute("steamgenreracing", "/steam/genre/racing");
routes.addRoute("steamgenresimulation", "/steam/genre/simulation");
routes.addRoute("steamgenresports", "/steam/genre/sports");
routes.addRoute("steamgenreindie", "/steam/genre/indie");
routes.addRoute("steamgenre2d", "/steam/genre/2d");
routes.addRoute("steamgenrepuzzle", "/steam/genre/puzzle");
routes.addRoute("steamgenreshooter", "/steam/genre/shooter");
routes.addRoute("steamgenrerts", "/steam/genre/rts");
routes.addRoute("steamgenretowerdefence", "/steam/genre/towerdefence");
routes.addRoute("steamupcoming", "/steam/upcoming");
routes.addRoute("steampopular", "/steam/popular");
routes.addRoute("steamrecent", "/steam/recent");
routes.addRoute("steamearlyaccess", "/steam/earlyaccess");
routes.addRoute("steamopenworld", "/steam/openworld");
routes.addRoute("steamfps", "/steam/fps");
routes.addRoute("steamcards", "/steam/cards");
routes.addRoute("steammmorpg", "/steam/mmorpg");
routes.addRoute("steamsurvival", "/steam/survival");

type CachedRouteTypes = GameResponse[] | GameResponse[] | NewsArticle[] | GameResponse;

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

/* news articles */
router.post(routes.getRoute("news"), (req: Request, res: Response, next: any) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<NewsArticle[]>(newsKeyExists, getCachedNews, cacheNews)
        .then((data: NewsArticle[]) => {
            genericResponse.data = data;
            res.locals = genericResponse;
            next();
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* results games */
router.post(routes.getRoute("resultsgames"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
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
    const genericResponse: GenericModelResponse = { error: undefined };
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

/* weekly deals games */
router.post(routes.getRoute("steamweeklydeals"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamWeeklyDealsKeyExists, getSteamWeeklyDealsGames, cacheSteamWeeklyDealsGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* competitive multiplayer games */
router.post(routes.getRoute("steamcompmulti"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamCompMultiExists, getSteamCompMultiGames, cacheSteamCompMultiGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* free online multiplayer games */
router.post(routes.getRoute("steamfreeonlinemulti"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamFreeOnlineMultiKeyExists, getSteamFreeOnlineMultiGames, cacheSteamFreeOnlineMultiGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* paid online multiplayer games */
router.post(routes.getRoute("steampaidonlinemulti"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamPaidOnlineMultiExists, getSteamPaidOnlineMultiGames, cacheSteamPaidOnlineMultiGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* most difficult games */
router.post(routes.getRoute("steammostdifficult"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamMostDifficultExists, getSteamMostDifficultGames, cacheSteamMostDifficultGames)
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
    GenericCachedRoute<GameResponse[]>(steamHorrorExists, getSteamHorrorGames, cacheSteamHorrorGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* moba games */
router.post(routes.getRoute("steammoba"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamMobaKeyExists, getSteamMobaGames, cacheSteamMobaGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* vr htc games */
router.post(routes.getRoute("steamvrhtc"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamVrHtcKeyExists, getSteamVrHtcGames, cacheSteamVrHtcGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* vr vive games */
router.post(routes.getRoute("steamvrvive"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamVrViveKeyExists, getSteamVrViveGames, cacheSteamVrViveGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* vr windows games */
router.post(routes.getRoute("steamvrwindows"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamVrWindowsKeyExists, getSteamVrWindowsGames, cacheSteamVrWindowsGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* vr all games */
router.post(routes.getRoute("steamvrall"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamVrAllExists, getSteamVrAllGames, cacheSteamVrAllGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* action games */
router.post(routes.getRoute("steamgenreaction"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamActionExists, getSteamActionGames, cacheSteamActionGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* adventure games */
router.post(routes.getRoute("steamgenreadventure"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamAdventureExists, getSteamAdventureGames, cacheSteamAdventureGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* casual games */
router.post(routes.getRoute("steamgenrecasual"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamCasualExists, getSteamCasualGames, cacheSteamCasualGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* strategy games */
router.post(routes.getRoute("steamgenrestrategy"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamStrategyExists, getSteamStrategyGames, cacheSteamStrategyGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* racing games */
router.post(routes.getRoute("steamgenreracing"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamRacingExists, getSteamRacingGames, cacheSteamRacingGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* simulation games */
router.post(routes.getRoute("steamgenresimulation"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamSimulationExists, getSteamSimulationGames, cacheSteamSimulationGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* sports games */
router.post(routes.getRoute("steamgenresports"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamSportsExists, getSteamSportsGames, cacheSteamSportsGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* indie games */
router.post(routes.getRoute("steamgenreindie"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamIndieExists, getSteamIndieGames, cacheSteamIndieGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* 2d games */
router.post(routes.getRoute("steamgenre2d"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steam2dExists, getSteam2dGames, cacheSteam2dGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* puzzle games */
router.post(routes.getRoute("steamgenrepuzzle"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamPuzzleExists, getSteamPuzzleGames, cacheSteamPuzzleGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* shooter games */
router.post(routes.getRoute("steamgenreshooter"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamShooterExists, getSteamShooterGames, cacheSteamShooterGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* rts games */
router.post(routes.getRoute("steamgenrerts"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamRtsExists, getSteamRtsGames, cacheSteamRtsGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* tower defence games */
router.post(routes.getRoute("steamgenretowerdefence"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamTowerDefenceExists, getSteamTowerDefenceGames, cacheSteamTowerDefenceGames)
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
    GenericCachedRoute<GameResponse[]>(steamUpcomingExists, getSteamUpcomingGames, cacheSteamUpcomingGames)
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
    GenericCachedRoute<GameResponse[]>(steamPopularExists, getSteamPopularGames, cacheSteamPopularGames)
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
    GenericCachedRoute<GameResponse[]>(steamRecentExists, getSteamRecentGames, cacheSteamRecentGames)
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
    GenericCachedRoute<GameResponse[]>(steamEarlyAccessExists, getSteamEarlyAccessGames, cacheSteamEarlyAccessGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* open world games */
router.post(routes.getRoute("steamopenworld"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamOpenWorldExists, getSteamOpenWorldGames, cacheSteamOpenWorldGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* fps games */
router.post(routes.getRoute("steamfps"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamFPSExists, getSteamFPSGames, cacheSteamFPSGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* cards games */
router.post(routes.getRoute("steamcards"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamCardsExists, getSteamCardsGames, cacheSteamCardsGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* mmorpg games */
router.post(routes.getRoute("steammmorpg"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamMMORPGExists, getSteamMMORPGGames, cacheSteamMMORPGGames)
        .then((data: GameResponse[]) => {
            genericResponse.data = data;
            return res.send(genericResponse);
        })
        .catch((error: string) => {
            genericResponse.error = error;
            return res.send(genericResponse);
        });
});

/* survival games */
router.post(routes.getRoute("steamsurvival"), (req: Request, res: Response) => {

    const genericResponse: GenericModelResponse = { error: undefined };
    GenericCachedRoute<GameResponse[]>(steamSurvivalExists, getSteamSurvivalGames, cacheSteamSurvivalGames)
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