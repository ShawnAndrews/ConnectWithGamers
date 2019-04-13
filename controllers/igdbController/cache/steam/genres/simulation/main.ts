import { GameResponse, ResultsEnum } from "../../../../../../client/client-server-common/common";
import { igdbModel } from "../../../../../../models/db/igdb/main";
import { getCachedGame } from "../../../game/main";
import { parseSteamIdsFromQuery } from "../../../util";

/**
 * Check if games exists.
 */
export function steamSimulationExists(): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.resultsExists(ResultsEnum.SteamGenreSimulation)
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
export function getSteamSimulationGames(): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.getResults(ResultsEnum.SteamGenreSimulation)
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
export function cacheSteamSimulationGames(): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `https://store.steampowered.com/search/?tags=599&category1=998`;

        parseSteamIdsFromQuery(URL)
            .then((gamesResponse: GameResponse[]) => {
                const ids: number[] = gamesResponse.map((x: GameResponse) => x.id);

                igdbModel.setResults(ids, ResultsEnum.SteamGenreSimulation)
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