import { GameResponse, buildIGDBRequestBody, GameFields, RawGame } from "../../../../../client/client-server-common/common";
import { igdbModel } from "../../../../../models/db/igdb/main";
import { getCachedGame, cachePreloadedGame } from "../../game/main";
import config from "../../../../../config";
import axios, { AxiosResponse, AxiosError } from "axios";

/**
 * Check if games exists.
 */
export function steamRecentExists(path: string): Promise<boolean> {

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
export function getSteamRecentGames(path: string): Promise<GameResponse[]> {

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
export function cacheSteamRecentGames(path: string): Promise<GameResponse[]> {
    const now: number = Math.floor(new Date().getTime() / 1000);
    const filters: string[] = [`external_games.category = 1`, `first_release_date != null`, `first_release_date < ${now}`];
    const URL: string = `${config.igdb.apiURL}/games`;
    const body: string = buildIGDBRequestBody(
        filters,
        GameFields.join(),
        undefined,
        "sort first_release_date desc"
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
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((RawGame: RawGame) => cachePreloadedGame(RawGame, `/game/${RawGame.id}`));

            Promise.all(gamePromises)
            .then((gamesResponse: GameResponse[]) => {

                igdbModel.setRouteCache(gamesResponse, path)
                    .then(() => {
                        return resolve(gamesResponse);
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