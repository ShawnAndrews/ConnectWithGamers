import { DbTables, GenericModelResponse, BusMessagesEnum, DbTableSteamGamesFields, STEAM_RATE_LIMIT_MS } from "../client/client-server-common/common";
import DatabaseBase from "../models/db/base/dbBase";
import { scheduleJob } from "node-schedule";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { log } from "./logger/main";

const steamIdsNotAvailableInRegion: number[] = [801220];
const db: DatabaseBase = new DatabaseBase();

export const scheduleDailyJob = (rule: any) => {
    scheduleJob(rule, () => {
        const jobStartTime: Date = new Date();
        log(`[Daily job] Started.`);

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

                log(`[Daily job] Detected #${steamIdsToAdd.length} missing games and added them to the bus.`);

                return addGamesToBus(steamIdsToAdd);
            })
            .then(() => {
                const jobEndTime: Date = new Date();
                log(`[Daily job] Ended and took ${Math.floor((Math.abs(jobEndTime.getTime() - jobStartTime.getTime()) / 1000) / 60)} minutes!`);
            })
            .catch((error: string) => {
                log(`[Daily job] Failed. ${error}`);
            });

    });
};

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
            .then(() => {
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
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
                            log(`[Daily job] Found game on in Steam list buy could not add steam id #${steamGamesSysKeyId} in link ${link}.`);
                        }

                    });

                    pages_processed++;
                    if (pages_processed === max_pages - 1) {
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
                        addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                    })
                    .catch(() => {
                        log(`[Daily job] Attempting to retry page #${i}/${max_pages}... (1/3)`);

                        axios(httpParams)
                        .then((innerResponse: AxiosResponse) => {
                            addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                        })
                        .catch(() => {
                            log(`[Daily job] Attempting to retry page #${i}/${max_pages}... (2/3)`);

                            axios(httpParams)
                            .then((innerResponse: AxiosResponse) => {
                                addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                            })
                            .catch(() => {
                                log(`[Daily job] Attempting to retry page #${i}/${max_pages}... (3/3)`);

                                axios(httpParams)
                                .then((innerResponse: AxiosResponse) => {
                                    addSteamIdsToList(innerResponse).then(() => { return resolve(steamIds); }).catch(() => {});
                                })
                                .catch(() => {
                                    return reject(`Failed to request steam results page #${i}. All retry attempts exhausted.`);
                                });

                            });

                        });

                    });

                }, STEAM_RATE_LIMIT_MS * i);

            }

        })
        .catch((error: string) => {
            return reject(error);
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
            })
            .catch((error: string) => {
                return reject(error);
            });

    });

}