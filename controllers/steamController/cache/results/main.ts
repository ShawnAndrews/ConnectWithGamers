import config from "../../../../config";
import {
    GameResponse, RawGame } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse, AxiosError } from "axios";
import { cachePreloadedGame, getCachedGame } from "../game/main";
import { steamModel } from "../../../../models/db/steam/main";

/**
 * Check if results key exists.
 */
export function resultsGamesKeyExists(path: string): Promise<boolean> {

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
 * Get cached results.
 */
export function getCachedResultsGames(path: string): Promise<GameResponse[]> {

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
 * Cache results.
 */
export function cacheResultsGames(queryString: string, path: string): Promise<GameResponse[]> {
    const queryStringObj: any = JSON.parse(queryString);
    const whereFilters: string[] = [];
    let sortFilter: string = undefined;

    Object.keys(queryStringObj).forEach((key: string) => {

        if (key === "genres") {
            const genres: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`genres = (${genres.join()})`);
        }

        if (key === "platforms") {
            const platforms: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`platforms = (${platforms.join()})`);
        }

        if (key === "categories") {
            const categories: number[] = JSON.parse("[" + queryStringObj[key] + "]");

            whereFilters.push(`category = (${categories.join()})`);
        }

        if (key === "popularity") {
            const popularity: number = parseInt(queryStringObj[key]);

            whereFilters.push(`aggregated_rating >= ${popularity}`);
        }

        if (key === "cover") {
            const cover: boolean = queryStringObj[key] === "true";

            whereFilters.push(`cover ${cover ? "!=" : "=="} null`);
        }

        if (key === "released_before") {
            const releasedBefore: number = parseInt(queryStringObj[key]);

            whereFilters.push(`first_release_date < ${releasedBefore}`);
        }

        if (key === "released_after") {
            const releasedBefore: number = parseInt(queryStringObj[key]);

            whereFilters.push(`first_release_date > ${releasedBefore}`);
        }

        if (key === "required") {
            const requiredSplit: string[] = queryStringObj[key].split(`,`);

            requiredSplit.forEach((x: string) => {

                if (x === "cover") {
                    whereFilters.push(`cover != null`);
                } else if (x === "screenshots") {
                    whereFilters.push(`screenshots != null`);
                } else if (x === "trailer") {
                    whereFilters.push(`videos != null`);
                }

            });
        }

        if (key === "sort" && !queryStringObj.query) {
            const split: string[] = queryStringObj[key].split(":");
            let type: string = split[0];
            const order: string = split[1];

            if (type === "popularity") {
                type = "aggregated_rating";
            } else if (type === "release_date") {
                type = "first_release_date";
            } else if (type === "alphabetic") {
                type = "name";
            }

            sortFilter = `sort ${type} ${order}`;
        }

    });

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "post",
            url: "",
            data: ""
        })
        .then( (response: AxiosResponse) => {
            const rawGamesResponses: RawGame[] = response.data;
            const ids: number[] = rawGamesResponses.map((RawGame: RawGame) => RawGame.id);
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((RawGame: RawGame) => cachePreloadedGame(RawGame, path));

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
            if (error.response && error.response.status !== 200) {
                return reject("Retry");
            }
            return reject(error);
        });

    });

}