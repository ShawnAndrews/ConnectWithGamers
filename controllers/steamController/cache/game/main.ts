import { GameResponse, RawGame, PriceInfoResponse } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { convertRawGame } from "../util";
import { steamModel } from "../../../../models/db/steam/main";

/**
 * Check if game key exists.
 */
export function gameKeyExists(path: string): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {

        steamModel.gameExists(path)
            .then((exists: boolean) => {
                return resolve(exists);
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

/**
 * Get cached game.
 */
export function getCachedGame(path: string): Promise<GameResponse> {

    return new Promise((resolve: any, reject: any) => {
        steamModel.getGame(path)
            .then((game: GameResponse) => {
                const cacheingPromises: Promise<any>[] = [];
                const imageIndicicesCached: number[] = [];
                let imagesNeedCacheing: boolean;

                imagesNeedCacheing = imageIndicicesCached.length !== 0;

                if (!imagesNeedCacheing) {
                    return resolve(game);
                } else {
                    cacheingPromises.push(steamModel.attemptCachePricings(game.steam_games_sys_key_id));
                }

                // reattempt cacheing
                Promise.all(cacheingPromises)
                    .then((vals: any[]) => {
                        const pricings: PriceInfoResponse[] = vals[1];

                        if (pricings) {
                            game.pricings = pricings;
                        }

                        return resolve(game);
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
 * Cache game.
 */
export function cacheGame(gameId: number, path: string): Promise<GameResponse> {

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "post",
            url: "",
            data: ""
        })
        .then( (response: AxiosResponse) => {
            const RawGame: RawGame = response.data[0];

            convertAndInsertGame(RawGame, path)
                .then((game: GameResponse) => {
                    return resolve(game);
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
 * Cache preloaded game.
 */
export function cachePreloadedGame(rawGame: RawGame, path: string): Promise<GameResponse> {

    return new Promise((resolve: any, reject: any) => {
        gameKeyExists(path)
        .then((exists: boolean) => {

            if (exists) {

                getCachedGame(path)
                    .then((game: GameResponse) => {
                        return resolve(game);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

            } else {

                convertAndInsertGame(rawGame, path)
                    .then((game: GameResponse) => {
                        return resolve(game);
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

/**
 * Convert game and insert to db.
 */
function convertAndInsertGame(RawGame: RawGame, path: string): Promise<GameResponse> {

    return new Promise((resolve: any, reject: any) => {

        convertRawGame([RawGame])
            .then((gameResponses: GameResponse[]) => {
                const convertedGame: GameResponse = gameResponses[0];
                steamModel.setGame(convertedGame, path)
                    .then(() => {
                        return resolve(convertedGame);
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