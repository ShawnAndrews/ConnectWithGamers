import { DbTables, GenericModelResponse, DbTableBusMessagesFields, BusMessagesEnum } from "../client/client-server-common/common";
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

                db.custom(
                    `DELETE FROM ${DbTables.bus_messages} WHERE ${DbTableBusMessagesFields[1]} = ?`,
                    [link])
                    .then(() => {
                        console.log(`Processing... ${link}`);

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

}, 1000);