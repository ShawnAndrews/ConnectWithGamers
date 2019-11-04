import { DbTables, GenericModelResponse, BusMessagesEnum, DbTableSteamGamesFields, STEAM_RATE_LIMIT_MS, DbTableRouteCacheFields, cheerioOptions, DbTableBusMessagesFields, BusMessagesPriorityEnum } from "../client/client-server-common/common";
import DatabaseBase from "../models/db/base/dbBase";
import { scheduleJob } from "node-schedule";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { log } from "./logger/main";

const steamIdsNotAvailableInRegion: number[] = [801220];
const db: DatabaseBase = new DatabaseBase();

export const scheduleRefreshGamesJob = (rule: any) => {
    scheduleJob(rule, () => {
        let steamIdToRefresh: number;

        db.custom(
            `SELECT ${DbTableSteamGamesFields[0]}
            FROM ${DbTables.steam_games}
            ORDER BY ${DbTableSteamGamesFields[8]} ASC
            LIMIT 1`,
            [])
            .then((dbResponse: GenericModelResponse) => {

                if (dbResponse.data.length > 0) {
                    steamIdToRefresh = dbResponse.data[0][DbTableSteamGamesFields[0]];

                    db.custom(
                        `INSERT INTO ${DbTables.bus_messages} (${DbTableBusMessagesFields.join(`,`)})
                        VALUES (${BusMessagesEnum.game}, ${BusMessagesPriorityEnum.low}, ?, NOW())`,
                        [steamIdToRefresh])
                        .then()
                        .catch(() => {
                            // do nothing, steam id already exists in db to be updated
                        });
                } else {
                    log(`[Refresh games job] Failed because there are no games in database.`);
                }

            })
            .catch((error: string) => {
                log(`[Refresh games job] Failed to select a game to refresh. ${error}`);
            });

    });
};

export const scheduleRouteJob = (rule: any) => {
    scheduleJob(rule, () => {
        log(`[Route job] Started.`);

        db.custom(
            `DELETE FROM ${DbTables.route_cache}
            WHERE ${DbTableRouteCacheFields[2]} <= NOW() - INTERVAL 1 DAY`,
            [])
            .then((dbResponse: GenericModelResponse) => {
                log(`[Route job] Ended and deleted ${dbResponse.data[`affectedRows`]} routes cached.`);
            })
            .catch((error: string) => {
                log(`[Route job] Failed. ${error}`);
            });
    });
};

export const scheduleNewGamesJob = (rule: any) => {
    scheduleJob(rule, () => {
        const jobStartTime: Date = new Date();
        log(`[Games job] Started.`);

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

                log(`[Games job] Detected #${steamIdsToAdd.length} missing games and added them to the bus.`);

                return addGamesToBus(steamIdsToAdd);
            })
            .then(() => {
                const jobEndTime: Date = new Date();
                log(`[Games job] Ended and took ${Math.floor((Math.abs(jobEndTime.getTime() - jobStartTime.getTime()) / 1000) / 60)} minutes!`);
            })
            .catch((error: string) => {
                log(`[Games job] Failed. ${error}`);
            });

    });
};

function addGamesToBus(steamIds: number[]): Promise<void> {

    return new Promise((resolve: any, reject: any) => {

        const filteredSteamIds: number[] = [...new Set(steamIds)];

        if (filteredSteamIds.length === 0) {
            return resolve();
        }

        db.custom(
            `INSERT INTO ${DbTables.bus_messages} (${DbTableBusMessagesFields.join(`,`)})
            VALUES
            ${filteredSteamIds.map(() => `(${BusMessagesEnum.game}, ${BusMessagesPriorityEnum.medium}, ?, NOW())`).join(`,`)}`,
            filteredSteamIds)
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
            const $: CheerioStatic = cheerio.load(response.data, cheerioOptions);
            const promises: Promise<number[]>[] = [];
            const createPagePromise = (pageNum: number): Promise<number[]> => {

                return new Promise((resolve: any, reject: any) => {

                    setTimeout(() => {
                        const httpParams: any = { method: "get", url: getPageLink(pageNum), headers: { "birthtime": 28801 }, maxRedirects: 5 };

                        axios(httpParams)
                        .then((innerResponse: AxiosResponse) => {
                            const $: CheerioStatic = cheerio.load(innerResponse.data, cheerioOptions);
                            const steamIds: number[] = [];

                            $("#search_resultsRows > a").each((i: number, element: CheerioElement) => {
                                const link: string = $(element).attr("href").concat("&cc=us");
                                const steamGamesSysKeyId: number = parseInt(link.substring(link.indexOf("app/") + 4, link.indexOf("/", link.indexOf("app/") + 5)));

                                if (!isNaN(steamGamesSysKeyId)) {
                                    steamIds.push(steamGamesSysKeyId);
                                } else {
                                    log(`[Games job] Skipping game in Steam list because could not add steam id #${steamGamesSysKeyId} in link ${link}.`);
                                }

                            });

                            return resolve(steamIds);
                        })
                        .catch(() => {
                            log(`[Games job] Skipping page #${pageNum}/${max_pages} due to failed HTTP request.`);
                            return resolve([]);
                        });

                    }, STEAM_RATE_LIMIT_MS * pageNum);

                });

            };

            max_pages = parseInt($(".search_pagination_right > a").last().prev().html());

            for (let i = 1; i <= max_pages; i++) {
                promises.push(createPagePromise(i));
            }

            Promise.all(promises)
                .then((steamIds: number[][]) => {
                    return resolve([].concat(...steamIds));
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