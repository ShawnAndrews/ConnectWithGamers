import { GameResponse } from "../../../../../client/client-server-common/common";
import { steamModel } from "../../../../../models/db/steam/main";
import { getCachedGame } from "../../game/main";
import { parseSteamIdsFromQuery } from "../../util";

/**
 * Check if games exists.
 */
export function steamMMORPGExists(path: string): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {
        steamModel.routeCacheExists(path)
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
export function getSteamMMORPGGames(path: string): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {
        steamModel.getRouteCache(path)
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
export function cacheSteamMMORPGGames(path: string): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `https://store.steampowered.com/search/?tags=1754&category1=998&filter=topsellers`;

        parseSteamIdsFromQuery(URL)
            .then((gamesResponse: GameResponse[]) => {

                steamModel.setRouteCache(gamesResponse, path)
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