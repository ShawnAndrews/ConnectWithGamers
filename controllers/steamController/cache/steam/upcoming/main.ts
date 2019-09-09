import { GameResponse, RawGame } from "../../../../../client/client-server-common/common";
import { steamModel } from "../../../../../models/db/steam/main";
import { getCachedGame, cachePreloadedGame } from "../../game/main";
import axios, { AxiosResponse, AxiosError } from "axios";
import config from "../../../../../config";

/**
 * Check if games exists.
 */
export function steamUpcomingExists(path: string): Promise<boolean> {

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
export function getSteamUpcomingGames(path: string): Promise<GameResponse[]> {

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
export function cacheSteamUpcomingGames(path: string): Promise<GameResponse[]> {
    const now: number = Math.floor(new Date().getTime() / 1000);

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "post",
            url: "",
            data: ""
        })
        .then( (response: AxiosResponse) => {
            const rawGamesResponses: RawGame[] = response.data;
            const ids: number[] = rawGamesResponses.map((RawGame: RawGame) => RawGame.id);
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((RawGame: RawGame) => cachePreloadedGame(RawGame, `/game/${RawGame.id}`));

            Promise.all(gamePromises)
            .then((gamesResponse: GameResponse[]) => {

                steamModel.setRouteCache(gamesResponse, path)
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