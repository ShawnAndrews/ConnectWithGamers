import config from "../../../../config";
import {
    GameResponse, GameFields, RawGame, buildIGDBRequestBody } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { convertRawGame } from "../util";
import { igdbModel } from "../../../../models/db/igdb/main";

/**
 * Check if redis key exists.
 */
export function gameKeyExists(gameId: number): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {

        igdbModel.gameExists(gameId)
            .then((exists: boolean) => {
                return resolve(exists);
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}

/**
 * Get redis-cached games.
 */
export function getCachedGame(gameId: number): Promise<GameResponse> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.getGame(gameId)
            .then((game: GameResponse) => {
                return resolve(game);
            })
            .catch((error: string) => {
                return reject(error);
            });
    });

}

/**
 * Cache game.
 */
export function cacheGame(gameId: number): Promise<GameResponse> {

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            [
                `id = ${gameId}`
            ],
            GameFields.join(),
            undefined
        );

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
            const RawGame: RawGame = response.data[0];
            convertRawGame([RawGame])
                .then((gameResponses: GameResponse[]) => {
                    const game: GameResponse = gameResponses[0];

                    igdbModel.setGame(game)
                        .then(() => {
                            return resolve(game);
                        })
                        .catch((error: string) => {
                            return reject(error);
                        });

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
export function cachePreloadedGame(RawGame: RawGame): Promise<GameResponse> {
    const gameId: number = RawGame.id;

    return new Promise((resolve: any, reject: any) => {
        gameKeyExists(gameId)
        .then((exists: boolean) => {

            if (exists) {

                igdbModel.getGame(gameId)
                    .then((game: GameResponse) => {
                        return resolve(game);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

            } else {

                convertRawGame([RawGame])
                    .then((gameResponses: GameResponse[]) => {
                        const game: GameResponse = gameResponses[0];

                        igdbModel.setGame(game)
                            .then(() => {
                                return resolve(game);
                            })
                            .catch((error: string) => {
                                return reject(error);
                            });

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