import { DbTables, GenericModelResponse, DbTableBusMessagesFields, PriceInfoResponse, PricingsEnum, BusMessage, BusMessagesEnum, DbTableSteamGamesFields, steamAppUrl, DbTablePricingsFields, GameResponse, ReviewEnum, DbTableGenresFields, DbTableSteamGenreEnumFields, StateEnum } from "../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import DatabaseBase from "../models/db/base/dbBase";
import { setInterval } from "timers";
import { scheduleJob } from "node-schedule";

const steamIdsNotAvailableInRegion: number[] = [801220];
const db: DatabaseBase = new DatabaseBase();
const STEAM_RATE_LIMIT_MS: number = 1000;
const BUS_POLLER_REFRESH: number = 1000;
let busIsBusy: boolean = false;

const updateAndFindNewGamesJob = scheduleJob({ hour: 11, minute: 19 }, () => {
    console.log (`Job started at ${new Date().toLocaleTimeString()}!`);

    let allSteamIds: number[];
    let cwgSteamIds: number[];
    let steamIdsToAdd: number[];

    getAllSteamDatabaseGames()
        .then((response: number[]) => {
            allSteamIds = response
                .filter(x => !steamIdsNotAvailableInRegion.includes(x));

            return getAllCWGDatabaseGames();
        })
        .then((response: number[]) => {
            cwgSteamIds = response;

            steamIdsToAdd = allSteamIds
                .filter(x => cwgSteamIds.indexOf(x) === -1);

            console.log(`(job) 1:(${allSteamIds.length}) - 2:(${cwgSteamIds.length}) = ${steamIdsToAdd.length}`);
            console.log(`(job) Attempting to new add ${steamIdsToAdd.length} games to bus!`);

            return addGamesToBus(steamIdsToAdd);
        })
        .then(() => {
            console.log (`Job ended at ${new Date().toLocaleTimeString()}!`);
        });

});
const busPoller: NodeJS.Timeout = setInterval(() => {

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
                    const link: string = steamAppUrl.concat(`/${steamId}/?cc=us`);

                    addSteamGames(link)
                        .then()
                        .catch()
                        .finally(() => busIsBusy = false);
                } else {
                    console.log(`ERROR`);
                }

            }

        });

}, BUS_POLLER_REFRESH);

function addGamesToBus(steamIds: number[]): Promise<void> {

    return new Promise((resolve: any, reject: any) => {

        if (steamIds.length === 0) {
            return resolve();
        }

        db.custom(
            `INSERT INTO ${DbTables.bus_messages} (bus_messages_enum_sys_key_id, value, log_dt)
            VALUES
            ${steamIds.map(() => `(${BusMessagesEnum.game}, ?, NOW())`).join(`,`)}`,
            steamIds)
            .then((dbResponse: GenericModelResponse) => {
                console.log(`Inserted #${steamIds.length} games to bus! - Error? ${JSON.stringify(dbResponse)}`);
                return resolve();
            });

    });

}

function cacheSteamGame(steamGamesSysKeyId: number, name: string, steamReviewEnumSysKeyId: number, totalReviewCount: number, summary: string, firstReleaseDate: Date, video: string, steamStateEnumSysKeyId: number): Promise<void>  {

    return new Promise((resolve: any, reject: any) => {

        db.custom(
            `SELECT *
            FROM ${DbTables.steam_games}
            WHERE ${DbTableSteamGamesFields[0]} = ?`,
            [steamGamesSysKeyId])
            .then((dbResponse: GenericModelResponse) => {
                const steamGamesRecordsInDb: GameResponse[] = dbResponse.data;

                if (steamGamesRecordsInDb.length > 0) {
                    const gameResponse: GameResponse = steamGamesRecordsInDb[0];

                    if (gameResponse.name != name || gameResponse.steam_review_enum_sys_key_id != steamReviewEnumSysKeyId || gameResponse.total_review_count != totalReviewCount || gameResponse.summary != summary || gameResponse.first_release_date != firstReleaseDate || gameResponse.steam_state_enum_sys_key_id != steamStateEnumSysKeyId) {

                        // update game info
                        db.custom(
                            `UPDATE ${DbTables.steam_games}
                            SET ${DbTableSteamGamesFields[1]} = ?, ${DbTableSteamGamesFields[2]} = ?, ${DbTableSteamGamesFields[3]} = ?, ${DbTableSteamGamesFields[4]} = ?, ${DbTableSteamGamesFields[5]} = ?, ${DbTableSteamGamesFields[7]} = ?, ${DbTableSteamGamesFields[8]} = ?
                            WHERE ${DbTableSteamGamesFields[0]} = ?`,
                            [name, steamReviewEnumSysKeyId, totalReviewCount, summary, firstReleaseDate, steamStateEnumSysKeyId, new Date(), steamGamesSysKeyId])
                            .then((dbResponse: GenericModelResponse) => {
                                if (dbResponse.error) {
                                    return reject(`Failed to insert game (Steam id #${steamGamesSysKeyId}): ${dbResponse.error}`);
                                }
                                return resolve();
                            });

                    } else {

                        // no changes to game info
                        return resolve();
                    }

                } else {

                    // add game
                    db.custom(
                        `INSERT INTO ${DbTables.steam_games} (${DbTableSteamGamesFields.join(`,`)})
                        VALUES (${DbTableSteamGamesFields.map(() => `?`).join(`,`)})`,
                        [steamGamesSysKeyId, name, steamReviewEnumSysKeyId, totalReviewCount, summary, firstReleaseDate, video, steamStateEnumSysKeyId, new Date()])
                        .then((dbResponse: GenericModelResponse) => {
                            if (dbResponse.error) {
                                return reject(`Failed to insert game (Steam id #${steamGamesSysKeyId}): ${dbResponse.error}`);
                            }
                            return resolve();
                        });

                }

            });

    });

}

function cacheGenres(genres: string[], steamGamesSysKeyId: number): Promise <void> {

    return new Promise((resolve: any, reject: any) => {

        genres.forEach((genre: string) => {
            let genreEnumSysKeyId: number;

            // add genre enum if it doesnt exist in db
            db.custom(
                `SELECT *
                FROM ${DbTables.steam_genre_enum}
                WHERE ${DbTableSteamGenreEnumFields[1]} = ?`,
                [genre])
                .then((dbResponse: GenericModelResponse) => {
                    const genreExistsInDb: boolean = dbResponse.data.length > 0;

                    if (!genreExistsInDb) {
                        return db.custom(
                            `INSERT INTO ${DbTables.steam_genre_enum} (${DbTableSteamGenreEnumFields[1]})
                            VALUES (?)`,
                            [genre]);
                    } else {
                        genreEnumSysKeyId = dbResponse.data[0][DbTableSteamGenreEnumFields[0]];
                    }
                })
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse) {
                        genreEnumSysKeyId = dbResponse.data[`insertId`];
                    }
                    return resolve();
                })
                .finally(() => {
                    return db.custom(
                        `INSERT INTO ${DbTables.genres} (${DbTableGenresFields[1]}, ${DbTableGenresFields[2]})
                        VALUES (?, ?)`,
                        [genreEnumSysKeyId, steamGamesSysKeyId])
                        .then(() => { return resolve(); });
                });

        });

    });

}

function cachePricings(pricings: PriceInfoResponse[]): Promise <void> {

    return new Promise((resolve: any, reject: any) => {

        if (pricings.length === 0) {
            return resolve();
        }

        pricings.forEach((pricing: PriceInfoResponse) => {

            db.custom(
                `SELECT *
                FROM ${DbTables.pricings}
                WHERE ${DbTablePricingsFields[1]} = ? AND ${DbTablePricingsFields[2]} = ? AND ${DbTablePricingsFields[3]} = ?`,
                [pricing.pricingEnumSysKeyId, pricing.steamGamesSysKeyId, pricing.title])
                .then((dbResponse: GenericModelResponse) => {
                    const pricingRecordsInDb: PriceInfoResponse[] = dbResponse.data;
                    const isPricingInDb: boolean = pricingRecordsInDb.length > 0;
                    const pricingsVals: any[] = [pricing.pricingEnumSysKeyId, pricing.steamGamesSysKeyId, pricing.title, pricing.price, pricing.discount_percent, pricing.discount_end_dt, pricing.log_dt];

                    // if pricing is not in database, or it is but the price or discount changed
                    if (!isPricingInDb || (isPricingInDb && (pricingRecordsInDb[0].price !== pricing.price || pricingRecordsInDb[0].discount_percent !== pricing.discount_percent))) {

                        // add pricing record
                        db.custom(
                            `INSERT INTO ${DbTables.pricings}
                            (${DbTablePricingsFields.slice(1).join()})
                            VALUES
                            (${DbTablePricingsFields.slice(1).map(() => "?").join()})`,
                            pricingsVals)
                            .then(() => {
                                return resolve();
                            });

                    } else {
                        // nothing change
                        return resolve();
                    }

                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    });

}

function getAllCWGDatabaseGames(): Promise<number[]> {

    return new Promise((resolve: any, reject: any) => {

        db.custom(
            `SELECT ${DbTableSteamGamesFields[0]}
            FROM ${DbTables.steam_games}`,
            [])
            .then((dbResponse: GenericModelResponse) => {
                const steamIds: number[] = dbResponse.data.map((x: any) => x[DbTableSteamGamesFields[0]]);
                return resolve(steamIds);
            });

    });

}

function getAllSteamDatabaseGames(): Promise<number[]> {

    let max_pages: number = -1;
    let pages_processed: number = 0;
    const steamIds: number[] = [];
    const getPageLink = (pageNum: number): string => `https://store.steampowered.com/search/?sort_by=Released_DESC&category1=998&page=${pageNum}`;

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "get",
            url: getPageLink(1),
            headers: {
                "birthtime": 28801
            },
            maxRedirects: 5
        })
        .then((response: AxiosResponse) => {
            const $: CheerioStatic = cheerio.load(response.data);
            const addSteamIdsToList = (innerResponse: AxiosResponse): Promise<void> => {

                return new Promise((resolve: any, reject: any) => {

                    const $: CheerioStatic = cheerio.load(innerResponse.data);

                    $("#search_resultsRows > a").each((i: number, element: CheerioElement) => {
                        const link: string = $(element).attr("href").concat("&cc=us");
                        const steamGamesSysKeyId: number = parseInt(link.substring(link.indexOf("app/") + 4, link.indexOf("/", link.indexOf("app/") + 5)));

                        if (!isNaN(steamGamesSysKeyId)) {
                            steamIds.push(steamGamesSysKeyId);
                        } else {
                            console.log(`Could not add steam id #${steamGamesSysKeyId} in link ${link}!`);
                        }

                    });

                    pages_processed++;
                    if (pages_processed === max_pages - 1) {
                        console.log(`Processed all pages. Returning.`);
                        return resolve();
                    } else {
                        return reject();
                    }

                });

            };

            max_pages = parseInt($(".search_pagination_right > a").last().prev().html());

            for (let i = 1; i <= max_pages; i++) {

                setTimeout(() => {
                    const httpParams: any = { method: "get", url: getPageLink(i), headers: { "birthtime": 28801 }, maxRedirects: 5 };

                    axios(httpParams)
                    .then((innerResponse: AxiosResponse) => {
                        console.log(`Processed page #${i}/${max_pages} (pages_processed: #${pages_processed})...`);

                        addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                    })
                    .catch((error: string) => {
                        console.log(`(1/3) Attempting to retry page #${i}...`);

                        axios(httpParams)
                        .then((innerResponse: AxiosResponse) => {
                            console.log(`Processed page #${i}/${max_pages} (pages_processed: #${pages_processed})...`);

                            addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                        })
                        .catch((error: string) => {
                            console.log(`(2/3) Attempting to retry page #${i}...`);

                            axios(httpParams)
                            .then((innerResponse: AxiosResponse) => {
                                console.log(`Processed page #${i}/${max_pages} (pages_processed: #${pages_processed})...`);

                                addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                            })
                            .catch((error: string) => {
                                console.log(`(3/3) Attempting to retry page #${i}...`);

                                axios(httpParams)
                                .then((innerResponse: AxiosResponse) => {
                                    console.log(`Processed page #${i}/${max_pages} (pages_processed: #${pages_processed})...`);

                                    addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                                })
                                .catch((error: string) => {
                                    console.log(`Failed to request steam results page #${i}: ${error}`);
                                });

                            });

                        });

                    });

                }, STEAM_RATE_LIMIT_MS * i);

            }

        })
        .catch((error: string) => {
            console.log(`Failed to request steam results page count: ${error}`);
        });

    });

}

function addSteamGames(link: string): Promise<void> {

    return new Promise((resolve: any, reject: any) => {

        const steamGamesSysKeyId: number = parseInt(link.substring(link.indexOf("app/") + 4, link.indexOf("/", link.indexOf("app/") + 5)));

        axios({
            method: "get",
            url: link,
            headers: {
                Cookie: "birthtime=-97347599"
            },
            maxRedirects: 5
        })
        .then((response: AxiosResponse) => {
            const $: CheerioStatic = cheerio.load(response.data);

            const name: string = $(".apphub_AppName").html();
            const pricings: PriceInfoResponse[] = getSteamPricings(response.data, steamGamesSysKeyId);
            const genres: string[] = getSteamGenres(response.data);
            const totalReviewCountTemp: number =
            ($(".user_reviews_summary_row .summary .responsive_hidden").length > 0 ? parseInt($(".user_reviews_summary_row .summary .responsive_hidden").html().trim().substring(1, $(".user_reviews_summary_row .summary .responsive_hidden").html().trim().length - 2)) : undefined) ||
            ($(".user_reviews_summary_row .summary").length > 0 && $(".user_reviews_summary_row .summary").html().trim() === `No user reviews` ? -1 : undefined) ||
            ($(".user_reviews_summary_row .summary .game_review_summary").length > 0 && $(".user_reviews_summary_row .summary .game_review_summary").html().includes(`user reviews`) ? parseInt($(".user_reviews_summary_row .summary .game_review_summary").html().replace(` user reviews`, ``)) : undefined);
            const totalReviewCount: number = totalReviewCountTemp === -1 ? 0 : totalReviewCountTemp;
            const reviewEnum: ReviewEnum = $(`.game_review_summary`).length > 0 && $(`.game_review_summary:not(.not_enough_reviews)`).length > 0 ? ReviewEnum[$(`.game_review_summary:not(.not_enough_reviews)`).html()] : ReviewEnum.NoUserReviews;
            const summary: string = $(".game_area_description").text();
            const firstReleaseDate: Date = !isNaN((new Date($(".release_date > div.date").html())).getTime()) ? new Date($(".release_date > div.date").html()) : undefined;
            const video: string = $(".highlight_movie").length > 0 && $(".highlight_movie").attr("data-mp4-source");
            const stateEnum: StateEnum =
            ($(`head > title`).html().includes(`Pre-purchase`) ? StateEnum.preorder : undefined) ||
            ($(`.early_access_header`).length > 0 ? StateEnum.earlyaccess : undefined) ||
            ((firstReleaseDate && firstReleaseDate.getTime() < (new Date()).getTime()) ? StateEnum.released : undefined) ||
            StateEnum.upcoming;

            console.log(`Name: ${name}`);
            console.log(`Pricings: ${JSON.stringify(pricings)}`);
            console.log(`Total review count: ${totalReviewCount}`);
            console.log(`Review enum: ${reviewEnum}`);
            console.log(`Genres: ${genres.join(`, `)}`);
            console.log(`Summary: ${summary.length} chars long`);
            console.log(`Release date: ${firstReleaseDate ? firstReleaseDate.getTime() : undefined}`);
            console.log(`Video: ${video}`);
            console.log(`State: ${stateEnum}`);

            console.log(``);

            cacheSteamGame(steamGamesSysKeyId, name, reviewEnum, totalReviewCount, summary, firstReleaseDate, video, stateEnum)
                .then(() => {
                    return cachePricings(pricings);
                })
                .then(() => {
                    return cacheGenres(genres, steamGamesSysKeyId);
                })
                .then(() => {

                    db.custom(
                        `DELETE FROM ${DbTables.bus_messages} WHERE ${DbTableBusMessagesFields[1]} = ?`,
                        [steamGamesSysKeyId])
                        .then(() => {
                            return resolve();
                        });

                })
                .catch((error: string) => {
                    console.log(`Failed to process Add Steam Game message (Steam id #${steamGamesSysKeyId}): ${error}`);
                });

        })
        .catch((error: string) => {
            console.log(`Failed to request steam game page (Steam id #${steamGamesSysKeyId}): ${error}`);
        });

    });

}

function getSteamGenres(data: string): string[] {
    const genres: string[] = [];
    const $: CheerioStatic = cheerio.load(data);

    $(`.glance_tags.popular_tags > a`).each((i: number, element: CheerioElement) => genres.push($(element).html().trim()));

    return genres;
}

function getSteamPricings(data: string, steamGamesSysKeyId: number): PriceInfoResponse[] {

    const $: CheerioStatic = cheerio.load(data);
    const pricings: PriceInfoResponse[] = [];

    // main game/bundles
    $(".game_area_purchase_game").each((i: number, element: CheerioElement) => {
        const monthNameToNumber = (name: string) =>  new Date(Date.parse(name + " 1, 2012")).getMonth() + 1;
        const title: string = $(element).find(`h1`).clone().children().remove().end().text().replace(`Buy `, ``).replace(`Pre-Purchase`, ``).replace(`Play`, ``).trim();
        const discountPercent: number = Number.parseInt($(element).find(`.discount_pct, .bundle_base_discount`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
        const discountEndDate: Date = $(element).find(`.game_purchase_discount_countdown`).length > 0
        ? new Date((parseInt(data.substring(data.indexOf(`$DiscountCountdown, `), data.indexOf(` );`, data.indexOf(`$DiscountCountdown, `) + 20)))) || new Date(`${$(element).find(`.game_purchase_discount_countdown`).text().split(" ").splice(-2)}, ${monthNameToNumber($(element).find(`.game_purchase_discount_countdown`).text().split(" ").splice(-2)[0]) >= monthNameToNumber(new Date().toLocaleString(`default`, { month: `long` })) ? new Date().getFullYear() : new Date().getFullYear() + 1}`).getTime())
        : undefined;
        const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_purchase_price`).text().replace(`$`, ``).trim();
        const price: number = rawPrice.includes(`Free`) ? undefined : Number.parseFloat(rawPrice);
        const pricingEnum: PricingsEnum = i === 0 ? PricingsEnum.main_game : PricingsEnum.bundles;

        if ((rawPrice.includes(`Free`) && !price) || (!isNaN(Number.parseFloat(rawPrice)) && !isNaN(price))) {
            const pricing: PriceInfoResponse = { pricingEnumSysKeyId: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, discount_end_dt: discountEndDate, log_dt: new Date() };
            pricings.push(pricing);
        }
    });

    // dlc
    $(".game_area_dlc_row").each((i: number, element: CheerioElement) => {
        const pricingEnum: PricingsEnum = PricingsEnum.dlc;
        const title: string = $(element).find(`.game_area_dlc_name`).text().trim();
        const discountPercent: number = Number.parseInt($(element).find(`.discount_pct`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
        const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_area_dlc_price`).text().replace(`$`, ``).trim();
        const price: number = (rawPrice === `N/A` || rawPrice === `Free`) ? undefined : Number.parseFloat(rawPrice);

        const pricing: PriceInfoResponse = { pricingEnumSysKeyId: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, discount_end_dt: undefined, log_dt: new Date() };
        pricings.push(pricing);
    });

    // demo
    if ($(".demo_above_purchase").length > 0) {
        const pricingEnum: PricingsEnum = PricingsEnum.demo;
        const title: string = $(`.demo_above_purchase > h1`).text().trim().replace(`Download `, ``);
        const discountPercent: number = undefined;
        const price: number = undefined;
        console.log(`Demo: ${title}`);
        const pricing: PriceInfoResponse = { pricingEnumSysKeyId: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, discount_end_dt: undefined, log_dt: new Date() };
        pricings.push(pricing);
    }

    return pricings;

}