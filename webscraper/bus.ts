import { DbTables, GenericModelResponse, DbTableBusMessagesFields, PriceInfoResponse, BusMessage, BusMessagesEnum, steamAppUrl, ReviewEnum, StateEnum, cleanString, Achievement, getSteamAppAchievementsUrl } from "../client/client-server-common/common";
import DatabaseBase from "../models/db/base/dbBase";
import { setInterval } from "timers";
import axios, { AxiosResponse } from "axios";
import { getSteamPricings, getSteamGenres, getSteamPlatforms, getSteamModes, getSteamImages, getSteamAchievements } from "./cache/getSteamGame";
import { cacheSteamGame, cachePricings, cacheGenres, cachePlatforms, cacheModes, cacheImages, cacheDeveloperAndPublisher, cacheAchievements } from "./cache/setSteamGame";
import * as cheerio from "cheerio";
import { log } from "./logger/main";

const BUS_POLLER_REFRESH: number = 1000;
const db: DatabaseBase = new DatabaseBase();
let busIsBusy: boolean = false;

export const runBus = () => {
    setInterval(() => {

        db.custom(
            `SELECT * FROM ${DbTables.bus_messages} WHERE ${DbTableBusMessagesFields[0]} = ${BusMessagesEnum.game} LIMIT 1`,
            [])
            .then((dbResponse: GenericModelResponse) => {
                const results: BusMessage[] = dbResponse.data;

                if (results.length > 0 && !busIsBusy) {
                    const busMessage: BusMessage = results[0];

                    busIsBusy = true;

                    // game
                    if (busMessage.bus_messages_enum_sys_key_id === BusMessagesEnum.game) {
                        const steamId: number = dbResponse.data[0].value;

                        processSteamId(steamId)
                            .then(() => {
                                log(`[Bus] Successfully processed steam id #${steamId}.`);
                            })
                            .catch((error: string) => {
                                log(`[Bus] Failed processing steam id #${steamId}. ${error}`);
                            })
                            .finally(() => busIsBusy = false);
                    }

                }

            })
            .catch((error: string) => {
                log(`[Bus] Failed to poll bus messages table. ${error}`);
            });

    }, BUS_POLLER_REFRESH);
};

function processSteamId(steamId: number): Promise<void> {

    const gamePageLink: string = steamAppUrl.concat(`/${steamId}/?cc=us`);

    return new Promise((resolve: any, reject: any) => {

        let responseGamePage: AxiosResponse;
        let responseGameAchievementsPage: AxiosResponse;
        const steamGamesSysKeyId: number = parseInt(gamePageLink.substring(gamePageLink.indexOf("app/") + 4, gamePageLink.indexOf("/", gamePageLink.indexOf("app/") + 5)));
        const gameAchievementsLink: string = getSteamAppAchievementsUrl(steamGamesSysKeyId);

        axios({
            method: "get",
            url: gamePageLink,
            headers: {
                Cookie: "birthtime=-97347599"
            },
            maxRedirects: 5
        })
        .then((response: AxiosResponse) => {
            responseGamePage = response;

            return axios({
                method: "get",
                url: gameAchievementsLink,
                headers: {
                    Cookie: "birthtime=-97347599"
                },
                maxRedirects: 5
            });

        })
        .then((response: AxiosResponse) => {
            responseGameAchievementsPage = response;

            const $: CheerioStatic = cheerio.load(responseGamePage.data);

            const name: string = $(".apphub_AppName").html();
            const pricings: PriceInfoResponse[] = getSteamPricings(responseGamePage.data, steamGamesSysKeyId);
            const genres: string[] = getSteamGenres(responseGamePage.data);
            const totalReviewCountTemp: number =
            ($(".user_reviews_summary_row .summary .responsive_hidden").length > 0 ? parseInt($(".user_reviews_summary_row .summary .responsive_hidden").html().trim().substring(1, $(".user_reviews_summary_row .summary .responsive_hidden").html().trim().length - 2)) : undefined) ||
            ($(".user_reviews_summary_row .summary").length > 0 && $(".user_reviews_summary_row .summary").html().trim() === `No user reviews` ? -1 : undefined) ||
            ($(".user_reviews_summary_row .summary .game_review_summary").length > 0 && $(".user_reviews_summary_row .summary .game_review_summary").html().includes(`user reviews`) ? parseInt($(".user_reviews_summary_row .summary .game_review_summary").html().replace(` user reviews`, ``)) : undefined);
            const totalReviewCount: number = totalReviewCountTemp === -1 ? 0 : totalReviewCountTemp;
            const reviewEnum: ReviewEnum = $(`.user_reviews_summary_row .game_review_summary:not(.not_enough_reviews)`).length > 0 ? ReviewEnum[$(`.user_reviews_summary_row .game_review_summary:not(.not_enough_reviews)`).html()] : ReviewEnum.NoUserReviews;
            const summary: string = cleanString($(".game_area_description").text().substr(0, 10000));
            const firstReleaseDate: Date = $(".release_date > div.date").html().includes(`, 2019`) ? new Date($(".release_date > div.date").html()) : undefined;
            const video: string = $(".highlight_movie").length > 0 ? $(".highlight_movie").attr("data-mp4-source") : undefined;
            const stateEnum: StateEnum =
            ($(`head > title`).html().includes(`Pre-purchase`) ? StateEnum.preorder : undefined) ||
            ($(`.early_access_header`).length > 0 ? StateEnum.earlyaccess : undefined) ||
            ((firstReleaseDate && firstReleaseDate.getTime() < (new Date()).getTime()) ? StateEnum.released : undefined) ||
            StateEnum.upcoming;
            const platforms: number[] = getSteamPlatforms(responseGamePage.data);
            const modes: string[] = getSteamModes(responseGamePage.data);
            const images: string[] = getSteamImages(responseGamePage.data, steamGamesSysKeyId);
            const developer: string = $(`.user_reviews .dev_row`).length > 0 ? $(`.user_reviews .dev_row`).first().find(`a`).html() : undefined;
            const publisher: string = $(`.user_reviews .dev_row`).length > 0 ? $(`.user_reviews .dev_row`).last().find(`a`).html() : undefined;
            const achievements: Achievement[] = getSteamAchievements(responseGameAchievementsPage.data);
            const deleteBusMessage = (steamGamesSysKeyId: number): Promise<GenericModelResponse> => db.custom(`DELETE FROM ${DbTables.bus_messages} WHERE ${DbTableBusMessagesFields[1]} = ?`, [steamGamesSysKeyId]);

            // // debug
            // console.log(`Name: ${name} - ${developer} - ${publisher}`);
            // console.log(`Pricings: ${JSON.stringify(pricings)}`);
            // console.log(`Total review count: ${totalReviewCount}`);
            // console.log(`Review enum: ${reviewEnum}`);
            // console.log(`Genres: ${genres.join(`, `)}`);
            // console.log(`Summary: ${summary.length} chars long`);
            // console.log(`Release date: ${firstReleaseDate ? firstReleaseDate.getTime() : undefined}`);
            // console.log(`Video: ${video}`);
            // console.log(`State: ${stateEnum}`);
            // console.log(`Platforms: ${platforms}`);
            // console.log(`Modes: ${modes}`);
            // console.log(`Images: #${images.length - 2} screenshots`);
            // console.log(`Achievements: ${achievements.length}`);
            // console.log(``);

            if (!name) {
                deleteBusMessage(steamGamesSysKeyId)
                .then(() => {
                    return reject(`Game page not setup yet and redirected to homepage.`);
                });
            } else {
                cacheSteamGame(steamGamesSysKeyId, name, reviewEnum, totalReviewCount, summary, firstReleaseDate, video, stateEnum)
                .then(() => {
                    return cachePricings(pricings);
                })
                .then(() => {
                    return cacheGenres(genres, steamGamesSysKeyId);
                })
                .then(() => {
                    return cachePlatforms(platforms, steamGamesSysKeyId);
                })
                .then(() => {
                    return cacheModes(modes, steamGamesSysKeyId);
                })
                .then(() => {
                    return cacheImages(images, steamGamesSysKeyId);
                })
                .then(() => {
                    return cacheDeveloperAndPublisher(developer, publisher, steamGamesSysKeyId);
                })
                .then(() => {
                    return cacheAchievements(achievements, steamGamesSysKeyId);
                })
                .then(() => {
                    return deleteBusMessage(steamGamesSysKeyId);
                })
                .then(() => {
                    return resolve();
                })
                .catch((error: string) => {
                    return reject(error);
                });
            }

        })
        .catch((error: string) => {
            busIsBusy = false;
            return reject(error);
        });

    });

}