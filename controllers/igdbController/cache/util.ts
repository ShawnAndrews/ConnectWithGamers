import { RawGame, GameResponse, IGDBVideo, IGDBPlatform, IdNamePair, IGDBExternalGame, IGDBExternalCategoryEnum, IGDBReleaseDate, IGDBImage, SteamAPIGetPriceInfoResponse, GameFields, buildIGDBRequestBody, getIGDBImage, IGDBImageSizeEnums } from "../../../client/client-server-common/common";
import { ArrayClean, steamAPIGetPriceInfo } from "../../../util/main";
import config from "../../../config";
import axios, { AxiosResponse } from "axios";
import { cachePreloadedGame } from "./game/main";

export function getGamesBySteamIds(steamIds: number[], requiredMedia?: boolean): Promise<GameResponse[]> {
    const filters: string[] = [`external_games.uid = (${steamIds.join()})`];

    if (requiredMedia) {
        filters.push(`screenshots != null`);
        filters.push(`cover != null`);
    }

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            filters,
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
        .then((response: AxiosResponse) => {

            const rawGamesResponses: RawGame[] = response.data;
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((RawGame: RawGame) => cachePreloadedGame(RawGame));

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

export function convertRawGame(RawGames: RawGame[]): Promise<GameResponse[]> {

    const pricePromise = (rawResponse: RawGame[]): Promise<SteamAPIGetPriceInfoResponse[]> => {

        return new Promise((resolve: any, reject: any) => {
            const pricesResponse: SteamAPIGetPriceInfoResponse[] = [];
            const steamids: number[] = rawResponse
                .filter((x: RawGame) => {
                    let hasSteamLink: boolean = false;

                    if (!x.external_games) {
                        return false;
                    }

                    x.external_games.forEach((y: IGDBExternalGame) => {
                        if (y.category === IGDBExternalCategoryEnum.steam) {
                            hasSteamLink = true;
                        }
                    });
                    return hasSteamLink;
                })
                .map((x: RawGame) => {
                    let steamId: number;
                    x.external_games.forEach((y: IGDBExternalGame) => {
                        if (y.category === IGDBExternalCategoryEnum.steam) {
                            steamId = parseInt(y.uid);
                        }
                    });
                    return steamId;
                });

            steamAPIGetPriceInfo(steamids)
            .then( (steamAPIGetPriceInfoResponse: SteamAPIGetPriceInfoResponse[]) => {
                rawResponse.forEach((x: RawGame) => {
                    const priceResponse: SteamAPIGetPriceInfoResponse = {
                        steamgameid: undefined,
                        price: undefined,
                        discount_percent: undefined,
                        steam: undefined
                    };

                    if (x.external_games) {
                        let steamId: number = undefined;
                        x.external_games.forEach((y: IGDBExternalGame) => {
                            if (y.category === IGDBExternalCategoryEnum.steam) {
                                steamId = parseInt(y.uid);
                            }
                        });

                        const foundIndex: number = steamAPIGetPriceInfoResponse.findIndex((priceInfo: SteamAPIGetPriceInfoResponse) => { return priceInfo.steamgameid === steamId; });
                        if (foundIndex !== -1) {
                            priceResponse.steamgameid = steamId;
                            priceResponse.price = steamAPIGetPriceInfoResponse[foundIndex].price;
                            priceResponse.discount_percent = steamAPIGetPriceInfoResponse[foundIndex].discount_percent;
                            priceResponse.steam = steamAPIGetPriceInfoResponse[foundIndex].steam;
                        }
                    }

                    pricesResponse.push(priceResponse);
                });

                return resolve(pricesResponse);
            })
            .catch ((error: string) => {
                return reject(error);
            });

        });
    };

    return new Promise((resolve: any, reject: any) => {

        const gameResponses: GameResponse[] = [];

        RawGames.forEach((RawGame: RawGame) => {
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
            let screenshots: IGDBImage[] = undefined;
            let video: string = undefined;
            const price: string = undefined;
            const discount_percent: number = undefined;

            // id
            id = RawGame.id;

            // name
            name = RawGame.name;

            // aggregated_rating
            aggregated_rating = RawGame.aggregated_rating;

            // total_rating_count
            total_rating_count = RawGame.total_rating_count;

            // steam url
            if (RawGame.external_games) {
                const foundSteamIndex: number = RawGame.external_games.findIndex((IGDBExternalGame: IGDBExternalGame) => { return IGDBExternalGame.category == IGDBExternalCategoryEnum.steam; });

                if (foundSteamIndex !== -1) {
                    steamid = parseInt(RawGame.external_games[foundSteamIndex].uid);
                }
            }

            // cover
            if (RawGame.cover && isNaN(Number(RawGame.cover))) {
                RawGame.cover.url = getIGDBImage(RawGame.cover.image_id, IGDBImageSizeEnums.cover_big);
            }
            cover = RawGame.cover;

            // summary
            summary = RawGame.summary;

            // link icons
            linkIcons = RawGame.platforms && RawGame.platforms.map((platform: IGDBPlatform) => {
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
            linkIcons = RawGame.platforms && ArrayClean(linkIcons, undefined);

            // genres
            genres = RawGame.genres && RawGame.genres.map((genre: IGDBPlatform) => { return { id: genre.id, name: genre.name }; });

            // platforms
            platforms = RawGame.platforms && RawGame.platforms.map((platform: IGDBPlatform) => { return { id: platform.id, name: platform.name }; });

            // first release date
            first_release_date = RawGame.first_release_date;

            // release dates
            release_dates = RawGame.release_dates && RawGame.platforms && RawGame.platforms.map((platform: IGDBPlatform) => {
                const platformId: number = platform.id;
                const foundSteamIndex: number = RawGame.release_dates.findIndex((releaseDate: IGDBReleaseDate) => { return releaseDate.platform === platformId; });
                return foundSteamIndex !== -1 ? RawGame.release_dates[foundSteamIndex].date : undefined;
            });

            // screenshots
            screenshots = RawGame.screenshots && RawGame.screenshots.map((x: IGDBImage) => {
                x.url = getIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big);
                return x;
            });

            // video
            if (RawGame.videos) {
                const foundTrailerVideoIndex: number = RawGame.videos.findIndex((video: IGDBVideo) => { return video.name === "Trailer"; });
                if (foundTrailerVideoIndex !== -1) {
                    video = `https://www.youtube.com/embed/${RawGame.videos[foundTrailerVideoIndex].video_id}`;
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
        pricePromise(RawGames)
        .then((prices: SteamAPIGetPriceInfoResponse[]) => {
            gameResponses.forEach((x: GameResponse, index: number) => {
                x.price = prices[index].price;
                x.discount_percent = prices[index].discount_percent;
            });

            return resolve(gameResponses);
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}