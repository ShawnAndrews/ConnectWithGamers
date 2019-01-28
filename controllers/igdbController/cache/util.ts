import { RawGame, GameResponse, IGDBVideo, IGDBPlatform, IdNamePair, IGDBExternalGame, IGDBExternalCategoryEnum, IGDBReleaseDate, IGDBImage, PriceInfoResponse, GameFields, buildIGDBRequestBody, getIGDBImage, IGDBImageSizeEnums, GameExternalInfo, steamAppUrl, androidAppUrl, IconEnums, GenreEnums, IGDBGenre, PlatformEnums, SimilarGame } from "../../../client/client-server-common/common";
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

    const steamPricePromise = (rawResponse: RawGame[]): Promise<PriceInfoResponse[]> => {

        return new Promise((resolve: any, reject: any) => {
            const pricesResponse: PriceInfoResponse[] = [];
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
            .then( (PriceInfoResponse: PriceInfoResponse[]) => {
                rawResponse.forEach((x: RawGame) => {
                    const priceResponse: PriceInfoResponse = {
                        externalEnum: undefined,
                        uid: undefined,
                        price: undefined,
                        discount_percent: undefined,
                    };

                    if (x.external_games) {
                        let steamId: number = undefined;
                        x.external_games.forEach((y: IGDBExternalGame) => {
                            if (y.category === IGDBExternalCategoryEnum.steam) {
                                steamId = parseInt(y.uid);
                            }
                        });

                        const foundIndex: number = PriceInfoResponse.findIndex((priceInfo: PriceInfoResponse) => { return parseInt(priceInfo.uid) === steamId; });
                        if (foundIndex !== -1) {
                            priceResponse.externalEnum = IGDBExternalCategoryEnum.steam;
                            priceResponse.uid = steamId.toString();
                            priceResponse.price = PriceInfoResponse[foundIndex].price;
                            priceResponse.discount_percent = PriceInfoResponse[foundIndex].discount_percent;
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
            let genres: number[] = undefined;
            let platforms: number[] = undefined;
            let first_release_date: number = undefined;
            let release_dates: number[] = undefined;
            let screenshots: IGDBImage[] = undefined;
            let video: string = undefined;
            const external: GameExternalInfo = {};
            const similar_games: SimilarGame[] = [];

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
            if (RawGame.cover && isNaN(Number(RawGame.cover)) && RawGame.cover.image_id) {
                if (typeof RawGame.cover === "number") {
                    return undefined;
                }
                RawGame.cover.url = getIGDBImage(RawGame.cover.image_id, IGDBImageSizeEnums.cover_big);
                RawGame.cover.alpha_channel =  RawGame.cover.alpha_channel || false;
                RawGame.cover.animated =  RawGame.cover.animated || false;
                cover = RawGame.cover && RawGame.cover.image_id ? RawGame.cover : undefined;
            }

            // similar games
            RawGame.similar_games.forEach((rawSimilarGame: RawGame) => {
                const similarGameCoverUid: string = rawSimilarGame.cover && isNaN(Number(rawSimilarGame.cover)) && rawSimilarGame.cover.image_id;
                const similarGame: SimilarGame = {id: rawSimilarGame.id, name: rawSimilarGame.name, cover_uid: similarGameCoverUid};
                similar_games.push(similarGame);
            });

            // summary
            summary = RawGame.summary;

            // link icons
            linkIcons = RawGame.platforms && RawGame.platforms.map((platform: IGDBPlatform) => {
                if (platform.id === IconEnums["fab fa-playstation"]) {
                    return "fab fa-playstation";
                } else if (platform.id === IconEnums["fab fa-android"]) {
                    return "fab fa-android";
                } else if (platform.id === IconEnums["fab fa-windows"]) {
                    return "fab fa-windows";
                } else if (platform.id === IconEnums["fab fa-apple"]) {
                    return "fab fa-apple";
                } else if (platform.id === IconEnums["fab fa-linux"]) {
                    return "fab fa-linux";
                } else if (platform.id === IconEnums["fab fa-steam"]) {
                    return "fab fa-steam";
                } else if (platform.id === IconEnums["fab fa-xbox"]) {
                    return "fab fa-xbox";
                } else if (platform.id === IconEnums["fab fa-nintendo-switch"]) {
                    return "fab fa-nintendo-switch";
                }
            });
            linkIcons = RawGame.platforms && ArrayClean(linkIcons, undefined);

            // genres
            genres = RawGame.genres && RawGame.genres.filter((genre: IGDBGenre) => Object.keys(GenreEnums).indexOf(genre.id.toString()) !== -1).map((genre: IGDBGenre) => { return genre.id; });

            // platforms
            platforms = RawGame.platforms && RawGame.platforms.filter((platform: IGDBPlatform) => Object.keys(PlatformEnums).indexOf(platform.id.toString()) !== -1).map((platform: IGDBPlatform) => { return platform.id; });

            // first release date
            first_release_date = RawGame.first_release_date && Number(RawGame.first_release_date);

            // release dates
            release_dates = RawGame.release_dates && RawGame.platforms && RawGame.platforms.map((platform: IGDBPlatform) => {
                const platformId: number = platform.id;
                const foundSteamIndex: number = RawGame.release_dates.findIndex((releaseDate: IGDBReleaseDate) => { return releaseDate.platform === platformId; });
                const releaseDate: number = foundSteamIndex !== -1 ? RawGame.release_dates[foundSteamIndex].date : undefined;
                return releaseDate || 0;
            });

            // screenshots
            screenshots = RawGame.screenshots && isNaN(Number(RawGame.screenshots[0])) && RawGame.screenshots.map((x: IGDBImage) => {
                if (typeof x === "number") {
                    return undefined;
                }
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

            // external
            if (RawGame.external_games) {
                RawGame.external_games.forEach((x: IGDBExternalGame) => {

                    if (x.category === IGDBExternalCategoryEnum.steam) {
                        const uid: string = x.uid;

                        external.steam = {
                            uid: uid,
                            price: undefined,
                            discount_percent: undefined,
                            url: `${steamAppUrl}/${uid}`
                        };
                    } else if (x.category === IGDBExternalCategoryEnum.microsoft) {

                        external.microsoft = {
                            uid: x.uid,
                            price: undefined,
                            discount_percent: undefined,
                            url: x.url
                        };
                    } else if (x.category === IGDBExternalCategoryEnum.gog) {

                        external.gog = {
                            uid: x.uid,
                            price: undefined,
                            discount_percent: undefined,
                            url: x.url
                        };
                    } else if (x.category === IGDBExternalCategoryEnum.apple) {
                        let url: string = undefined;

                        if (x.url) {
                            const foundIndex: number = x.url.indexOf("?");
                            url = x.url.substr(0, foundIndex);
                        }

                        external.apple = {
                            uid: x.uid,
                            price: undefined,
                            discount_percent: undefined,
                            url: url
                        };
                    } else if (x.category === IGDBExternalCategoryEnum.android) {
                        external.android = {
                            uid: x.uid,
                            price: undefined,
                            discount_percent: undefined,
                            url: `${androidAppUrl}${x.uid}`
                        };
                    }
                });
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
                release_dates: release_dates,
                first_release_date: first_release_date,
                screenshots: screenshots,
                video: video,
                external: external,
                similar_games: similar_games
            };

            gameResponses.push(gameResponse);
        });

        // prices
        steamPricePromise(RawGames)
        .then((prices: PriceInfoResponse[]) => {
            gameResponses.forEach((x: GameResponse, index: number) => {
                if (x.external.steam) {
                    x.external.steam.price = prices[index].price;
                    x.external.steam.discount_percent = prices[index].discount_percent;
                }
            });

            return resolve(gameResponses);
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}