import { RawGame, GameResponse } from "../../../client/client-server-common/common";
import { ArrayClean } from "../../../util/main";
import config from "../../../config";
import { cachePreloadedGame } from "./game/main";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";

export function getGamesBySteamIds(steamIds: number[], requiredMedia?: boolean): Promise<GameResponse[]> {
    const filters: string[] = [`external_games.uid = (${steamIds.join()})`];

    if (requiredMedia) {
        filters.push(`screenshots != null`);
        filters.push(`cover != null`);
    }

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "post",
            url: "",
            data: ""
        })
        .then((response: AxiosResponse) => {

            const rawGamesResponses: RawGame[] = response.data;
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((RawGame: RawGame) => cachePreloadedGame(RawGame, `/game/${RawGame.id}`));

            Promise.all(gamePromises)
            .then((gameResponses: GameResponse[]) => {
                return resolve(gameResponses);
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

export function convertRawGame(RawGames: RawGame[]): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const gameResponses: GameResponse[] = [];

        RawGames.forEach((RawGame: RawGame) => {
            let id: number = undefined;
            let name: string = undefined;
            let aggregated_rating: number;
            let total_rating_count: number = undefined;
            let cover: string = undefined;
            let summary: string = undefined;
            let linkIcons: string[] = undefined;
            let genres: number[] = undefined;
            let platforms: number[] = undefined;
            let first_release_date: number = undefined;
            let screenshots: string[] = undefined;
            let video: string = undefined;
            let similar_games: number[] = undefined;
            let game_modes: string[] = undefined;

            // id
            id = RawGame.id;

            // name
            name = RawGame.name;

            // aggregated_rating
            aggregated_rating = RawGame.aggregated_rating;

            // total_rating_count
            total_rating_count = RawGame.total_rating_count;

            // cover
            cover = RawGame.cover;

            // similar games
            if (RawGame.similar_games && RawGame.similar_games.length > 0) {
                similar_games = RawGame.similar_games;
            }

            // summary
            summary = RawGame.summary;

            // link icons
            linkIcons = RawGame.platforms && RawGame.platforms.map((platform: number) => {
                if (platform === 0) {
                    return "fab fa-playstation";
                } else if (platform === 1) {
                    return "fab fa-android";
                } else if (platform === 2) {
                    return "fab fa-windows";
                } else if (platform === 3) {
                    return "fab fa-apple";
                } else if (platform === 4) {
                    return "fab fa-linux";
                } else if (platform === 5) {
                    return "fab fa-steam";
                } else if (platform === 6) {
                    return "fab fa-xbox";
                } else if (platform === 7) {
                    return "fab fa-nintendo-switch";
                }
            });
            linkIcons = RawGame.platforms && ArrayClean(linkIcons, undefined);

            // genres
            genres = RawGame.genres;

            // platforms
            platforms = RawGame.platforms;

            // first release date
            first_release_date = RawGame.first_release_date && Number(RawGame.first_release_date);

            // game modes
            game_modes = RawGame.game_modes;

            // screenshots
            screenshots = RawGame.screenshots;

            // video
            if (RawGame.videos) {
                video = RawGame.videos[0];
            }

            const gameResponse: GameResponse = {
                id: id,
                name: name,
                aggregated_rating: aggregated_rating,
                total_rating_count: total_rating_count,
                cover: cover,
                summary: summary,
                linkIcons: linkIcons,
                genres: genres,
                platforms: platforms,
                first_release_date: first_release_date,
                screenshots: screenshots,
                video: video,
                pricings: undefined,
                game_modes: game_modes,
                similar_games: similar_games
            };

            gameResponses.push(gameResponse);
        });

        return resolve(gameResponses);

    });

}

export function parseSteamIds(webpage: string): number[] {

    const steamIds: number[] = [];
    const prefix: string = `data-ds-appid="`;
    const suffix: string = `"`;

    let foundPrefixIndex: number = webpage.search(prefix);

    while (foundPrefixIndex !== -1) {
        let foundSuffixIndex: number;
        let steamId: number;

        // remove pre-id text
        webpage = webpage.substring(foundPrefixIndex + prefix.length);

        // get id
        foundSuffixIndex = webpage.search(suffix);
        steamId = parseInt(webpage.substring(0, foundSuffixIndex));
        steamIds.push(steamId);

        // remove id text
        webpage = webpage.substring(foundSuffixIndex + suffix.length);

        // find next id
        foundPrefixIndex = webpage.search(prefix);

    }

    return steamIds;
}

export function parseSteamIdsFromQuery(webpage: string, excludeFreeGames: boolean = false): Promise<GameResponse[]> {

    const getPageSuffix = (page: number): string => `&page=${page}`;
    const getSteamIdsByPage = (page: number): Promise<number[]> => {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: webpage.concat(getPageSuffix(page)),
                headers: {
                    "birthtime": 28801
                },
                maxRedirects: 5
            })
            .then((response: AxiosResponse) => {
                const $: CheerioStatic = cheerio.load(response.data);
                const steamIds: number[] = [];

                $("#search_result_container > div:nth-child(2) a").each((i: number, element: CheerioElement) => {
                    const isExcluded: boolean = excludeFreeGames && ($(element).find(".search_price").text().trim().toLowerCase() === "free to play");

                    if (!isExcluded) {
                        steamIds.push(Number.parseInt(element.attribs["data-ds-appid"]));
                    }
                });

                return resolve(steamIds);
            })
            .catch((error: string) => {
                return reject(error);
            });
        });
    };

    return new Promise((resolve, reject) => {

        const steamIdsPromises: Promise<number[]>[] = [];

        steamIdsPromises.push(getSteamIdsByPage(1));
        steamIdsPromises.push(getSteamIdsByPage(2));
        steamIdsPromises.push(getSteamIdsByPage(3));
        steamIdsPromises.push(getSteamIdsByPage(4));
        steamIdsPromises.push(getSteamIdsByPage(5));
        steamIdsPromises.push(getSteamIdsByPage(6));
        steamIdsPromises.push(getSteamIdsByPage(7));
        steamIdsPromises.push(getSteamIdsByPage(8));
        steamIdsPromises.push(getSteamIdsByPage(9));
        steamIdsPromises.push(getSteamIdsByPage(10));
        steamIdsPromises.push(getSteamIdsByPage(11));
        steamIdsPromises.push(getSteamIdsByPage(12));

        Promise.all(steamIdsPromises)
            .then((partialSteamIds: number[][]) => {

                const steamIds: number[] = [];

                for (let x = 0; x < partialSteamIds.length; x++) {
                    for (let y = 0; y < partialSteamIds[x].length; y++) {
                        steamIds.push(partialSteamIds[x][y]);
                    }
                }

                getGamesBySteamIds(steamIds, true)
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