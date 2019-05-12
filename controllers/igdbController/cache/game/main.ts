import config from "../../../../config";
import { GameResponse, GameFields, RawGame, buildIGDBRequestBody, IGDBImageSizeEnums } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { convertRawGame } from "../util";
import { igdbModel } from "../../../../models/db/igdb/main";

/**
 * Check if game key exists.
 */
export function gameKeyExists(path: string): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {

        igdbModel.gameExists(path)
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
        igdbModel.getGame(path)
            .then((game: GameResponse) => {
                const imageIndicicesCached: number[] = [];
                const imageSizesCached: IGDBImageSizeEnums[] = [];

                if (!game.image_cover_micro_cached) {
                    imageIndicicesCached.push(9);
                    imageSizesCached.push(IGDBImageSizeEnums.micro);
                }

                if (!game.image_cover_big_cached) {
                    imageIndicicesCached.push(10);
                    imageSizesCached.push(IGDBImageSizeEnums.cover_big);
                }

                if (!game.image_screenshot_med_cached) {
                    imageIndicicesCached.push(11);
                    imageSizesCached.push(IGDBImageSizeEnums.screenshot_med);
                }

                if (!game.image_screenshot_big_cached) {
                    imageIndicicesCached.push(12);
                    imageSizesCached.push(IGDBImageSizeEnums.screenshot_big);
                }

                if (imageIndicicesCached.length === 0) {
                    return resolve(game);
                }

                // reattempt images cache
                igdbModel.attemptCacheGameImages(game.id, imageIndicicesCached, imageSizesCached)
                    .then((sizesCached: IGDBImageSizeEnums[]) => {

                        sizesCached.forEach((size: IGDBImageSizeEnums) => {
                            if (size === IGDBImageSizeEnums.micro) {
                                game.image_cover_micro_cached = true;
                            } else if (size === IGDBImageSizeEnums.cover_big) {
                                game.image_cover_big_cached = true;
                            } else if (size === IGDBImageSizeEnums.screenshot_med) {
                                game.image_screenshot_med_cached = true;
                            } else if (size === IGDBImageSizeEnums.screenshot_big) {
                                game.image_screenshot_big_cached = true;
                            }
                        });

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
                igdbModel.setGame(convertedGame, path)
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