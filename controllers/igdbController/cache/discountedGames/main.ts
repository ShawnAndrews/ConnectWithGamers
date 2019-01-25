import { GameResponse, ResultsEnum } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { parseSteamIds, getGamesBySteamIds } from "../util";
import { getCachedGame } from "../game/main";
import { igdbModel } from "../../../../models/db/igdb/main";

/**
 * Check if games exists.
 */
export function discountedGamesKeyExists(): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {

        igdbModel.resultsExists(ResultsEnum.DiscountedResults)
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
export function getCachedDiscountedGames(): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        igdbModel.getResults(ResultsEnum.DiscountedResults)
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

export function cacheDiscountedGames(): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `https://store.steampowered.com/search/?category1=998&specials=1`;

        axios({
            method: "get",
            url: URL
        })
        .then((response: AxiosResponse) => {

            const steamWebpage: string = response.data;
            const steamIds: number[] = parseSteamIds(steamWebpage);

            getGamesBySteamIds(steamIds, true)
            .then((gameResponses: GameResponse[]) => {
                const ids: number[] = gameResponses.map((x: GameResponse) => x.id);

                igdbModel.setResults(ids, ResultsEnum.DiscountedResults)
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
        .catch( (error: any) => {
            return reject(error);
        });
    });

}