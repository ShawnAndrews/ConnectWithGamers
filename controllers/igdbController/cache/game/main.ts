import config from "../../../../config";
import { GameResponse, GameFields, RawGame, buildIGDBRequestBody, IGDBImageSizeEnums, PriceInfoResponse, IGDBExternalCategoryEnum } from "../../../../client/client-server-common/common";
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
                const cacheingPromises: Promise<any>[] = [];
                const imageIndicicesCached: number[] = [];
                const imageSizesCached: IGDBImageSizeEnums[] = [];
                const steamNeedsPricing: boolean = game.steam_link !== undefined && game.pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.steam) === undefined;
                const gogNeedsPricing: boolean = game.gog_link !== undefined && game.pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.gog) === undefined;
                const appleNeedsPricing: boolean = game.apple_link !== undefined && game.pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.apple) === undefined;
                const androidNeedsPricing: boolean = game.android_link !== undefined && game.pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.android) === undefined;
                const microsoftNeedsPricing: boolean = game.microsoft_link !== undefined && game.pricings.find((pricing: PriceInfoResponse) => pricing.externalEnum === IGDBExternalCategoryEnum.microsoft) === undefined;
                const pricingNeedsCacheing: boolean = steamNeedsPricing || gogNeedsPricing || appleNeedsPricing || androidNeedsPricing || microsoftNeedsPricing;
                let imagesNeedCacheing: boolean;

                if (!game.image_micro_cached) {
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

                imagesNeedCacheing = imageIndicicesCached.length !== 0;

                if (!imagesNeedCacheing && !pricingNeedsCacheing) {
                    return resolve(game);
                } else {
                    if (imagesNeedCacheing) {
                        cacheingPromises.push(igdbModel.attemptCacheGameImages(game.id, imageIndicicesCached, imageSizesCached));
                    }
                    if (pricingNeedsCacheing) {
                        cacheingPromises.push(igdbModel.attemptCachePricings(game.id, game.steam_link, game.gog_link, game.microsoft_link, game.apple_link, game.android_link));
                    }
                }

                // reattempt cacheing
                Promise.all(cacheingPromises)
                    .then((vals: any[]) => {
                        const sizesCached: IGDBImageSizeEnums[] = vals[0];
                        const pricings: PriceInfoResponse[] = vals[1];

                        if (sizesCached) {
                            sizesCached.forEach((size: IGDBImageSizeEnums) => {
                                if (size === IGDBImageSizeEnums.micro) {
                                    game.image_micro_cached = true;
                                } else if (size === IGDBImageSizeEnums.cover_big) {
                                    game.image_cover_big_cached = true;
                                } else if (size === IGDBImageSizeEnums.screenshot_med) {
                                    game.image_screenshot_med_cached = true;
                                } else if (size === IGDBImageSizeEnums.screenshot_big) {
                                    game.image_screenshot_big_cached = true;
                                }
                            });
                        }

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