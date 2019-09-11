import { DbTables, GenericModelResponse, DbTableBusMessagesFields, BusMessagesEnum, PriceInfoResponse, PricingsEnum } from "../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import DatabaseBase from "../models/db/base/dbBase";
import populate from "./populate/main";
import { setInterval } from "timers";
import { scheduleJob } from "node-schedule";

const db: DatabaseBase = new DatabaseBase();
const getPageLink = (pageNum: number): string => `https://store.steampowered.com/search/?sort_by=Released_DESC&category1=998%2C996&page=${pageNum}`;
const STEAM_RATE_LIMIT_MS: number = 5000;

const updateAndFindNewGamesJob = scheduleJob({ hour: 0, minute: 1, dayOfWeek: 0 }, () => {
    console.log(`Time for tea! - ${(new Date()).getTime()}`);
});
const pollGamesTimer: NodeJS.Timeout = setInterval(() => {
    let link: string;

    db.custom(
        `SELECT * FROM ${DbTables.bus_messages} WHERE ${DbTableBusMessagesFields[0]} = ${BusMessagesEnum.game} LIMIT 1`,
        [])
        .then((dbResponse: GenericModelResponse) => {
            const results: Object[] = dbResponse.data;

            if (results.length > 0) {
                link = dbResponse.data[0].value;
                const steamGamesSysKeyId: number = parseInt(link.substring(link.indexOf("app/") + 4, link.indexOf("/", link.indexOf("app/") + 5)));

                db.custom(
                    `DELETE FROM ${DbTables.bus_messages} WHERE ${DbTableBusMessagesFields[1]} = ?`,
                    [link])
                    .then(() => {

                        axios({
                            method: "get",
                            url: link,
                            headers: {
                                "birthtime": 28801
                            },
                            maxRedirects: 5
                        })
                        .then((response: AxiosResponse) => {
                            const $: CheerioStatic = cheerio.load(response.data);

                            console.log(`Name: ${$(".apphub_AppName").html()}`);
                            console.log(`Pricings: ${JSON.stringify(getSteamPricings(response.data, steamGamesSysKeyId))}`);
                            console.log(``);
                            // db.custom(
                            //     `INSERT INTO ${DbTables.bus_messages} (bus_messages_enum_sys_key_id, value, log_dt) VALUES (0, ?, NOW())`,
                            //     [link])
                            //     .then((dbResponse: GenericModelResponse) => {
                            //         if (dbResponse.error) {
                            //             console.log(`Failed to insert game '${link}': ${dbResponse.error}`);
                            //         }
                            //     });

                            // max_pages = parseInt($(".search_pagination_right > a").last().prev().html());

                            // for (let i = 1; i <= max_pages; i++) {

                            //     setTimeout(() => {
                            //         console.log(`Processing page #${i}/${max_pages}...`);
                            //         axios({
                            //             method: "get",
                            //             url: getPageLink(i),
                            //             headers: {
                            //                 "birthtime": 28801
                            //             },
                            //             maxRedirects: 5
                            //         })
                            //         .then((response: AxiosResponse) => {
                            //             const $: CheerioStatic = cheerio.load(response.data);

                            //             $("#search_resultsRows > a").each((i: number, element: CheerioElement) => {
                            //                 const link: string = $(element).attr("href");

                            //                 db.custom(
                            //                     `INSERT INTO ${DbTables.bus_messages} (bus_messages_enum_sys_key_id, value, log_dt) VALUES (0, ?, NOW())`,
                            //                     [link])
                            //                     .then((dbResponse: GenericModelResponse) => {
                            //                         if (dbResponse.error) {
                            //                             console.log(`Failed to insert game '${link}': ${dbResponse.error}`);
                            //                         }
                            //                     });

                            //             });

                            //         })
                            //         .catch((error: string) => {
                            //             console.log(`Failed to request steam results page #${i}: ${error}`);
                            //         });

                            //     }, STEAM_RATE_LIMIT_MS * i);

                            // }

                        })
                        .catch((error: string) => {
                            console.log(`Failed to request steam results page count: ${error}`);
                        });

                    });
            }

        });

}, STEAM_RATE_LIMIT_MS);

function getSteamPricings(data: string, steamGamesSysKeyId: number): PriceInfoResponse[] {

    const $: CheerioStatic = cheerio.load(data);
    const pricings: PriceInfoResponse[] = [];

    // main game/bundles
    $(".game_area_purchase_game").each((i: number, element: CheerioElement) => {
        const monthNameToNumber = (name: string) =>  new Date(Date.parse(name + " 1, 2012")).getMonth() + 1;
        const title: string = $(element).find(`h1`).clone().children().remove().end().text().replace(`Buy `, ``).replace(`Pre-Purchase`, ``).replace(`Play`, ``).trim();
        const discountPercent: number = Number.parseInt($(element).find(`.discount_pct, .bundle_base_discount`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
        const discountEndDate: number = $(element).find(`.game_purchase_discount_countdown`).length > 0
        ? (parseInt(data.substring(data.indexOf(`$DiscountCountdown, `), data.indexOf(` );`, data.indexOf(`$DiscountCountdown, `) + 20))) || new Date(`${$(element).find(`.game_purchase_discount_countdown`).text().split(" ").splice(-2)}, ${monthNameToNumber($(element).find(`.game_purchase_discount_countdown`).text().split(" ").splice(-2)[0]) >= monthNameToNumber(new Date().toLocaleString(`default`, { month: `long` })) ? new Date().getFullYear() : new Date().getFullYear() + 1}`).getTime())
        : undefined;
        const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_purchase_price`).text().replace(`$`, ``).trim();
        const price: number = rawPrice.includes(`Free`) ? undefined : Number.parseFloat(rawPrice);
        const pricingEnum: PricingsEnum = i === 0 ? PricingsEnum.main_game : PricingsEnum.bundles;
        console.log(`title: ${title}`);
        console.log(`discountPercent: ${discountPercent}`);
        console.log(`discountEndDate: ${discountEndDate}`);
        console.log(`rawPrice: ${rawPrice}`);
        console.log(`price: ${price}`);
        console.log(`pricingEnum: ${pricingEnum}`);
        if ((rawPrice.includes(`Free`) && !price) || (!isNaN(Number.parseFloat(rawPrice)) && !isNaN(price))) {
            const pricing: PriceInfoResponse = { pricingEnum: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, log_dt: new Date() };
            pricings.push(pricing);
        }
    });

    // dlc
    $(".game_area_dlc_row").each((i: number, element: CheerioElement) => {
        const coming_soon: boolean = undefined;
        const preorder: boolean = undefined;
        const pricingEnum: PricingsEnum = PricingsEnum.dlc;
        const title: string = $(element).find(`.game_area_dlc_name`).text().trim();
        const discountPercent: number = Number.parseInt($(element).find(`.discount_pct`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
        const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_area_dlc_price`).text().replace(`$`, ``).trim();
        const price = (rawPrice === `N/A` || rawPrice === `Free`) ? undefined : Number.parseFloat(rawPrice);

        const pricing: PriceInfoResponse = { pricingEnum: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, log_dt: new Date() };
        pricings.push(pricing);
    });

    // demo

    return pricings;

}