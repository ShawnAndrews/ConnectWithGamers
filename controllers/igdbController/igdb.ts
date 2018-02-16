const express = require("express");
const router = express.Router();
const igdb = require("igdb-api-node").default;
import { ResponseModel, GameListEntryResponse, GameResponse, GameResponseFields } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";
import config from "../../config";
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

    const formatDate = (date: Date) => {
        const d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = "0" + month;
        }
        if (day.length < 2) {
            day = "0" + day;
        }

        const formattedDate = [year, month, day].join("-");
        return formattedDate;
    };

    const date = new Date();
    const lastDayOfPreviousMonth = formatDate(new Date(date.getFullYear(), date.getMonth(), 0));
    const lastDayOfCurrentMonth = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));

    upcomingGamesKeyExists()
        .then((exists: boolean) => {
            if (exists) {
                console.log(`Getting cached upcominggames...`);
                getCachedUpcomingGames()
                .then((gameIds: number[]) => {
                    return res.send(gameIds);
                })
                .catch((err: any) => {
                    throw(err);
                });
            } else {
                console.log(`Cacheing upcominggames...`);
                cacheUpcomingGames()
                .then((gameIds: number[]) => {
                    return res.send(gameIds);
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