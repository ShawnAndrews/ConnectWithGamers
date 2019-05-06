import { GameResponse } from "../../../../../client/client-server-common/common";
import { igdbModel } from "../../../../../models/db/igdb/main";
import { getCachedGame } from "../../game/main";
import { parseSteamIdsFromQuery } from "../../util";

/**
 * Check if games exists.
 */
export function steamSurvivalExists(path: string): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.routeCacheExists(path)
            .then((exists: boolean) => {
                return resolve(exists);
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

/**
 * Get cached games.
 */
export function getSteamSurvivalGames(path: string): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.getRouteCache(path)
            .then((gamesResponse: GameResponse[]) => {
                return resolve(gamesResponse);
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

/**
 * Cache games.
 */
export function cacheSteamSurvivalGames(path: string): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `https://store.steampowered.com/search/?sort_by=Released_DESC&tags=1662&category1=998`;

        parseSteamIdsFromQuery(URL)
            .then((gamesResponse: GameResponse[]) => {

                igdbModel.setRouteCache(gamesResponse, path)
                    .then(() => {
                        return resolve(gamesResponse);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

            })
            .catch( (error: any) => {
                return reject(error);
            });

    });

}