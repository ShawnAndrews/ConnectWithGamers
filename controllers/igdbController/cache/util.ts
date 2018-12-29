import { RawGameResponse, GameResponse, IGDBVideo, IGDBPlatform, IdNamePair, ExternalGame, IGDBExternalCategoryEnum, IGDBReleaseDate, IGDBImage, SteamAPIGetPriceInfoResponse, GameResponseFields } from "../../../client/client-server-common/common";
import { IGDBImageResolve, ArrayClean, steamAPIGetPriceInfo, buildIGDBRequestBody } from "../../../util/main";
import config from "../../../config";
import axios, { AxiosResponse } from "axios";
import { cachePreloadedGame } from "./game/main";

export function getGamesBySteamIds(steamIds: number[]): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            [
                `external_games.uid = (${steamIds.join()})`
            ],
            GameResponseFields.join(),
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
        .then((response: AxiosResponse) => {

            const rawGamesResponses: RawGameResponse[] = response.data;
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((rawGameResponse: RawGameResponse) => cachePreloadedGame(rawGameResponse));

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

export function convertRawGameResponse(rawGameResponses: RawGameResponse[]): Promise<GameResponse[]> {

    const pricePromise = (rawResponse: RawGameResponse[]): Promise<SteamAPIGetPriceInfoResponse[]> => {

        return new Promise((resolve: any, reject: any) => {
            const pricesResponse: SteamAPIGetPriceInfoResponse[] = [];
            const steamids: number[] = rawResponse
                .filter((x: RawGameResponse) => {
                    let hasSteamLink: boolean = false;

                    if (!x.external_games) {
                        return false;
                    }

                    x.external_games.forEach((y: ExternalGame) => {
                        if (y.category === IGDBExternalCategoryEnum.steam) {
                            hasSteamLink = true;
                        }
                    });
                    return hasSteamLink;
                })
                .map((x: RawGameResponse) => {
                    let steamId: number;
                    x.external_games.forEach((y: ExternalGame) => {
                        if (y.category === IGDBExternalCategoryEnum.steam) {
                            steamId = parseInt(y.uid);
                        }
                    });
                    return steamId;
                });

            steamAPIGetPriceInfo(steamids)
            .then( (steamAPIGetPriceInfoResponse: SteamAPIGetPriceInfoResponse[]) => {
                rawResponse.forEach((x: RawGameResponse) => {
                    const priceResponse: SteamAPIGetPriceInfoResponse = {
                        steamgameid: undefined,
                        price: undefined,
                        discount_percent: undefined,
                        steam_url: undefined
                    };

                    if (x.external_games) {
                        let steamId: number = undefined;
                        x.external_games.forEach((y: ExternalGame) => {
                            if (y.category === IGDBExternalCategoryEnum.steam) {
                                steamId = parseInt(y.uid);
                            }
                        });

                        const foundIndex: number = steamAPIGetPriceInfoResponse.findIndex((priceInfo: SteamAPIGetPriceInfoResponse) => { return priceInfo.steamgameid === steamId; });
                        if (foundIndex !== -1) {
                            priceResponse.steamgameid = steamId;
                            priceResponse.price = steamAPIGetPriceInfoResponse[foundIndex].price;
                            priceResponse.discount_percent = steamAPIGetPriceInfoResponse[foundIndex].discount_percent;
                            priceResponse.steam_url = steamAPIGetPriceInfoResponse[foundIndex].steam_url;
                        }
                    }

                    pricesResponse.push(priceResponse);
                });

                return resolve(pricesResponse);
            })
            .catch ((error: string) => {
                console.log(`FAILED PRICE REQUEST: ${error}`);
                return reject(error);
            });

        });
    };

    return new Promise((resolve: any, reject: any) => {

        const gameResponses: GameResponse[] = [];

        rawGameResponses.forEach((rawGameResponse: RawGameResponse) => {
            let id: number = undefined;
            let name: string = undefined;
            let aggregated_rating: number;
            let total_rating_count: number = undefined;
            let steamid: number = undefined;
            let cover: IGDBImage = undefined;
            let summary: string = undefined;
            let linkIcons: string[] = undefined;
            let genres: IdNamePair[] = undefined;
            let platforms: IdNamePair[] = undefined;
            let first_release_date: number = undefined;
            let release_dates: number[] = undefined;
            let screenshots: string[] = undefined;
            let video: string = undefined;
            const price: string = undefined;
            const discount_percent: number = undefined;

            // id
            id = rawGameResponse.id;

            // name
            name = rawGameResponse.name;

            // aggregated_rating
            aggregated_rating = rawGameResponse.aggregated_rating;

            // total_rating_count
            total_rating_count = rawGameResponse.total_rating_count;

            // steam url
            if (rawGameResponse.external_games) {
                const foundSteamIndex: number = rawGameResponse.external_games.findIndex((externalGame: ExternalGame) => { return externalGame.category == IGDBExternalCategoryEnum.steam; });

                if (foundSteamIndex !== -1) {
                    steamid = parseInt(rawGameResponse.external_games[foundSteamIndex].uid);
                }
            }

            // cover
            if (rawGameResponse.cover) {
                rawGameResponse.cover.url = IGDBImageResolve(rawGameResponse.cover.image_id, "cover_big", "jpg");
            }
            cover = rawGameResponse.cover;

            // summary
            summary = rawGameResponse.summary;

            // link icons
            linkIcons = rawGameResponse.platforms && rawGameResponse.platforms.map((platform: IGDBPlatform) => {
                if (platform.id === 48 || platform.id === 45) {
                    return "fab fa-playstation";
                } else if (platform.id === 34) {
                    return "fab fa-android";
                } else if (platform.id === 6) {
                    return "fab fa-windows";
                } else if (platform.id === 14) {
                    return "fab fa-apple";
                } else if (platform.id === 3) {
                    return "fab fa-linux";
                } else if (platform.id === 92) {
                    return "fab fa-steam";
                } else if (platform.id === 49) {
                    return "fab fa-xbox";
                } else if (platform.id === 130) {
                    return "fab fa-nintendo-switch";
                }
            });
            linkIcons = rawGameResponse.platforms && ArrayClean(linkIcons, undefined);

            // genres
            genres = rawGameResponse.genres && rawGameResponse.genres.map((genre: IGDBPlatform) => { return { id: genre.id, name: genre.name }; });

            // platforms
            platforms = rawGameResponse.platforms && rawGameResponse.platforms.map((platform: IGDBPlatform) => { return { id: platform.id, name: platform.name }; });

            // first release date
            first_release_date = rawGameResponse.first_release_date;

            // release dates
            release_dates = rawGameResponse.release_dates && rawGameResponse.platforms && rawGameResponse.platforms.map((platform: IGDBPlatform) => {
                const platformId: number = platform.id;
                const foundSteamIndex: number = rawGameResponse.release_dates.findIndex((releaseDate: IGDBReleaseDate) => { return releaseDate.platform === platformId; });
                return foundSteamIndex !== -1 ? rawGameResponse.release_dates[foundSteamIndex].date : undefined;
            });

            // screenshots
            screenshots = rawGameResponse.screenshots && rawGameResponse.screenshots.map((screenshot: IGDBImage) => {
                return IGDBImageResolve(screenshot.image_id, "screenshot_huge", "jpg");
            });

            // video
            if (rawGameResponse.videos) {
                const foundTrailerVideoIndex: number = rawGameResponse.videos.findIndex((video: IGDBVideo) => { return video.name === "Trailer"; });
                if (foundTrailerVideoIndex !== -1) {
                    video = `https://www.youtube.com/embed/${rawGameResponse.videos[foundTrailerVideoIndex].video_id}`;
                }
            }

            const gameResponse: GameResponse = {
                id: id,
                name: name,
                aggregated_rating: aggregated_rating,
                total_rating_count: total_rating_count,
                price: price,
                discount_percent: discount_percent,
                steamid: steamid,
                cover: cover,
                summary: summary,
                linkIcons: linkIcons,
                genres: genres,
                platforms: platforms,
                release_dates: release_dates,
                first_release_date: first_release_date,
                screenshots: screenshots,
                video: video
            };

            gameResponses.push(gameResponse);
        });

        // price
        pricePromise(rawGameResponses)
        .then((prices: SteamAPIGetPriceInfoResponse[]) => {
            gameResponses.forEach((x: GameResponse, index: number) => {
                x.price = prices[index].price;
                x.discount_percent = prices[index].discount_percent;
            });

            return resolve(gameResponses);
        })
        .catch((error: string) => {
            console.log(`FAILED PRICE2 REQUEST: ${error}`);
            return reject(error);
        });

    });

}