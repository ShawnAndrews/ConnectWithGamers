import { RawGame, GameResponse, IGDBVideo, IGDBPlatform, IGDBReleaseDate, IGDBImage, GameFields, buildIGDBRequestBody, IconEnums, GenreEnums, IGDBGenre, PlatformEnums, SimilarGame, IGDBExternalCategoryEnum, IGDBExternalGame } from "../../../client/client-server-common/common";
import { ArrayClean } from "../../../util/main";
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

export function convertRawGame(RawGames: RawGame[]): Promise<GameResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        const gameResponses: GameResponse[] = [];

        RawGames.forEach((RawGame: RawGame) => {
            let id: number = undefined;
            let name: string = undefined;
            let aggregated_rating: number;
            let total_rating_count: number = undefined;
            let cover: IGDBImage = undefined;
            let summary: string = undefined;
            let linkIcons: string[] = undefined;
            let genres: number[] = undefined;
            let platforms: number[] = undefined;
            let first_release_date: number = undefined;
            let release_dates: number[] = undefined;
            let screenshots: IGDBImage[] = undefined;
            let video: string = undefined;
            let similar_games: SimilarGame[] = undefined;
            let steam_link: string = undefined;
            let gog_link: string = undefined;
            let microsoft_link: string = undefined;
            let apple_link: string = undefined;
            let android_link: string = undefined;

            // id
            id = RawGame.id;

            // name
            name = RawGame.name;

            // aggregated_rating
            aggregated_rating = RawGame.aggregated_rating;

            // total_rating_count
            total_rating_count = RawGame.total_rating_count;

            // cover
            if (RawGame.cover && isNaN(Number(RawGame.cover)) && RawGame.cover.image_id) {
                if (typeof RawGame.cover === "number") {
                    return undefined;
                }
                RawGame.cover.alpha_channel =  RawGame.cover.alpha_channel || false;
                RawGame.cover.animated =  RawGame.cover.animated || false;
                cover = RawGame.cover && RawGame.cover.image_id ? RawGame.cover : undefined;
            }

            // similar games
            if (RawGame.similar_games) {
                similar_games = [];
                RawGame.similar_games.forEach((rawSimilarGame: RawGame) => {
                    const similarGameCoverId: string = rawSimilarGame.cover && isNaN(Number(rawSimilarGame.cover)) && rawSimilarGame.cover.image_id;
                    const similarGame: SimilarGame = {id: rawSimilarGame.id, name: rawSimilarGame.name, cover_id: similarGameCoverId};
                    similar_games.push(similarGame);
                });
            }

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
                return x;
            });

            // video
            if (RawGame.videos) {
                const foundTrailerVideoIndex: number = RawGame.videos.findIndex((video: IGDBVideo) => { return video.name === "Trailer"; });
                if (foundTrailerVideoIndex !== -1) {
                    video = `https://www.youtube.com/embed/${RawGame.videos[foundTrailerVideoIndex].video_id}`;
                }
            }

            // links
            if (RawGame.external_games) {
                const getExternalGameFromCategory = (category: number): IGDBExternalGame => {
                    let foundIndex: number = undefined;

                    RawGame.external_games.forEach((raw_external_game: IGDBExternalGame, index: number) => {
                        if (raw_external_game.category === category) {
                            foundIndex = index;
                        }
                    });

                    return foundIndex !== -1 ? RawGame.external_games[foundIndex] : undefined;
                };

                steam_link = getExternalGameFromCategory(IGDBExternalCategoryEnum.steam) && (getExternalGameFromCategory(IGDBExternalCategoryEnum.steam).url ? `${getExternalGameFromCategory(IGDBExternalCategoryEnum.steam).url}/?cc=us` : `${config.steam.appURL}/${getExternalGameFromCategory(IGDBExternalCategoryEnum.steam).uid}/?cc=us`);
                gog_link = getExternalGameFromCategory(IGDBExternalCategoryEnum.gog) && getExternalGameFromCategory(IGDBExternalCategoryEnum.gog).url;
                microsoft_link = getExternalGameFromCategory(IGDBExternalCategoryEnum.microsoft) && getExternalGameFromCategory(IGDBExternalCategoryEnum.microsoft).url;
                apple_link = getExternalGameFromCategory(IGDBExternalCategoryEnum.apple) && getExternalGameFromCategory(IGDBExternalCategoryEnum.apple).url;
                android_link = getExternalGameFromCategory(IGDBExternalCategoryEnum.android) && getExternalGameFromCategory(IGDBExternalCategoryEnum.android).url;
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
                similar_games: similar_games,
                video_cached: false,
                image_cached: false,
                steam_link: steam_link,
                gog_link: gog_link,
                microsoft_link: microsoft_link,
                apple_link: apple_link,
                android_link: android_link,
                pricings: undefined
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