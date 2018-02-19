const express = require("express");
const router = express.Router();
const igdb = require("igdb-api-node").default;
import { ResponseModel, GameListEntryResponse, GameResponse, GameResponseFields, UpcomingGameResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";
import config from "../../config";
import { formatDate } from "../../util/main";
import { cacheGame, getCachedGame, cacheUpcomingGames, getCachedUpcomingGames, upcomingGamesKeyExists, gameKeyExists, searchGamesKeyExists, getCachedSearchGames, cacheSearchGames } from "./cache";

const routes = new routeModel();
const client = igdb(config.igdb.key);

/* routes */
routes.addRoute("searchgames", "/games/search/:query");
routes.addRoute("upcominggames", "/games/upcoming");
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
    const date = new Date();
    const lastDayOfPreviousMonth = formatDate(new Date(date.getFullYear(), date.getMonth(), 0));
    const lastDayOfCurrentMonth = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));

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