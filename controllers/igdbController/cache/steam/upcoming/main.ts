import { GameResponse, ResultsEnum, buildIGDBRequestBody, GameFields, RawGame } from "../../../../../client/client-server-common/common";
import { igdbModel } from "../../../../../models/db/igdb/main";
import { getCachedGame, cachePreloadedGame } from "../../game/main";
import axios, { AxiosResponse, AxiosError } from "axios";
import config from "../../../../../config";

/**
 * Check if games exists.
 */
export function steamUpcomingExists(): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.resultsExists(ResultsEnum.SteamUpcoming)
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
export function getSteamUpcomingGames(): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.getResults(ResultsEnum.SteamUpcoming)
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
export function cacheSteamUpcomingGames(): Promise<GameResponse[]> {
    const now: number = Math.floor(new Date().getTime() / 1000);
    const filters: string[] = [`external_games.category = 1`, `first_release_date != null`, `first_release_date > ${now}`];
    const URL: string = `${config.igdb.apiURL}/games`;
    const body: string = buildIGDBRequestBody(
        filters,
        GameFields.join(),
        undefined,
        "sort first_release_date asc"
    );

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "post",
            url: URL,
            headers: {
                "user-key": config.igdb.key,
                "Accept": "application/json"
            },
            data: body
        })
        .then( (response: AxiosResponse) => {
            const rawGamesResponses: RawGame[] = response.data;
            const ids: number[] = rawGamesResponses.map((RawGame: RawGame) => RawGame.id);
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((RawGame: RawGame) => cachePreloadedGame(RawGame));

            Promise.all(gamePromises)
            .then((gameResponses: GameResponse[]) => {

                igdbModel.setResults(ids, ResultsEnum.SteamUpcoming)
                    .then(() => {
                        return resolve(gameResponses);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

            })
            .catch((error: string) => {
                return reject(error);
            });

        })
        .catch((error: AxiosError) => {
            return reject(error);
        });

    });

}