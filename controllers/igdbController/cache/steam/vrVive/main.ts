import { GameResponse, ResultsEnum } from "../../../../../client/client-server-common/common";
import { igdbModel } from "../../../../../models/db/igdb/main";
import { getCachedGame } from "../../game/main";
import { parseSteamIdsFromQuery } from "../../util";

/**
 * Check if games exists.
 */
export function steamVrViveKeyExists(): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.resultsExists(ResultsEnum.SteamVrVive)
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
export function getSteamVrViveGames(): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.getResults(ResultsEnum.SteamVrVive)
            .then((gameIds: number[]) => {

                const gamePromises: Promise<GameResponse>[] = gameIds.map((id: number) => getCachedGame(id));

                Promise.all(gamePromises)
                .then((gameResponses: GameResponse[]) => {
                    return resolve(gameResponses);
                })
                .catch((error: string) => {
                    return reject(error);
                });

            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

/**
 * Cache games.
 */
export function cacheSteamVrViveGames(): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `https://store.steampowered.com/search/?sort_by=Released_DESC&tags=-1&category1=998&vrsupport=402%2C102`;

        parseSteamIdsFromQuery(URL)
            .then((gamesResponse: GameResponse[]) => {
                const ids: number[] = gamesResponse.map((x: GameResponse) => x.id);

                igdbModel.setResults(ids, ResultsEnum.SteamVrVive)
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