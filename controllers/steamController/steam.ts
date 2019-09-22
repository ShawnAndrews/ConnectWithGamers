const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import {
    GameResponse,
    GenericModelResponse,
    DbTableSteamGamesFields,
    DbTables
} from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { gameModel } from "../../models/db/game/main";

export const routes = new routeModel();

/* routes */
routes.addRoute("news", "/games/news");
routes.addRoute("resultsgames", "/games/results");
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

/* a single game */
router.post(routes.getRoute("game"), (req: Request, res: Response) => {
    const genericResponse: GenericModelResponse = { error: undefined };
    const path: string = req.path;

    GenericCachedWithDataRoute<GameResponse, number>(gameModel.getGame, req.params.id, path)
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
    const path: string = req.path;
    GenericCachedWithDataRoute<GameResponse[], string>(gameModel.getGamesByQuery,
        `SELECT ${DbTableSteamGamesFields[0]}
        FROM ${DbTables.steam_games}
        LIMIT 10`,
        path)
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