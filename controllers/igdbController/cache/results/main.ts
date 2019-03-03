import config from "../../../../config";
import {
    GameResponse, RawGame, GameFields, buildIGDBRequestBody, ResultsEnum } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse, AxiosError } from "axios";
import { cachePreloadedGame, getCachedGame } from "../game/main";
import { igdbModel } from "../../../../models/db/igdb/main";

/**
 * Check if results key exists.
 */
export function resultsGamesKeyExists(queryString: string): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.resultsExists(ResultsEnum.SearchResults, queryString)
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
export function getCachedResultsGames(queryString: string): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {
        igdbModel.getResults(ResultsEnum.SearchResults, queryString)
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
 * Cache results.
 */
export function cacheResultsGames(queryString: string): Promise<GameResponse[]> {
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

    const URL: string = `${config.igdb.apiURL}/games`;
    const body: string = buildIGDBRequestBody(
        whereFilters,
        GameFields.join(),
        undefined,
        sortFilter,
        queryStringObj.query
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

                igdbModel.setResults(ids, ResultsEnum.SearchResults, queryString)
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
            if (error.response && error.response.status !== 200) {
                console.log(`Error: ${JSON.stringify(error)}`);
                return reject("Retry");
            }
            return reject(error);
        });

    });

}