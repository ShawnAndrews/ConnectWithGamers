const { parentPort } = require("worker_threads");
import { ServiceWorkerEnums, PriceInfoResponse, GenericModelResponse, DbTables, DbTablePricingsFields, DbTableIGDBGamesFields, GameResponse } from "../../../client/client-server-common/common";
import { ServiceWorkerMessage } from "../../main";
import { getSteamPricings } from "./steam/main";
import { getGogPricings } from "./gog/main";
import { getMicrosoftPricings } from "./microsoft/main";
import { getApplePricings } from "./apple/main";
import { getAndroidPricings } from "./android/main";
import { igdbModel } from "../../../models/db/igdb/main";

const message = (running: boolean): ServiceWorkerMessage => ( { serviceWorkerEnum: ServiceWorkerEnums.pricing_update, running: running } );
const sendNotRunningMessage = (): void => parentPort.postMessage(message(false));
const sendRunningMessage = (): void => parentPort.postMessage(message(true));

export function processPricingsUpdate(gameId: number) {

    try {
        sendRunningMessage();

        let igdb_games_sys_key_id: number = undefined;
        let steam_link: string = undefined;
        let gog_link: string = undefined;
        let microsoft_link: string = undefined;
        let apple_link: string = undefined;
        let android_link: string = undefined;

        igdbModel.getGame(gameId, true)
            .then((gameResponse: GameResponse) => {
                steam_link = gameResponse.steam_link;
                gog_link = gameResponse.gog_link;
                microsoft_link = gameResponse.microsoft_link;
                apple_link = gameResponse.apple_link;
                android_link = gameResponse.android_link;

                if (steam_link || gog_link || microsoft_link || apple_link || android_link) {

                    igdbModel.getGameSysKey(gameId)
                    .then((sys_key_id: number) => {
                        igdb_games_sys_key_id = sys_key_id;

                        // check for expired pricings
                        igdbModel.isGamePricingExpired(gameId)
                        .then((expired: boolean) => {

                            if (expired) {
                                const pricingPromises: Promise<PriceInfoResponse[]>[] = [];

                                if (steam_link) {
                                    pricingPromises.push(getSteamPricings(igdb_games_sys_key_id, steam_link));
                                }
                                if (gog_link) {
                                    pricingPromises.push(getGogPricings(igdb_games_sys_key_id, gog_link));
                                }
                                if (microsoft_link) {
                                    pricingPromises.push(getMicrosoftPricings(igdb_games_sys_key_id, microsoft_link));
                                }
                                if (apple_link) {
                                    pricingPromises.push(getApplePricings(igdb_games_sys_key_id, apple_link));
                                }
                                if (android_link) {
                                    pricingPromises.push(getAndroidPricings(igdb_games_sys_key_id, android_link));
                                }

                                Promise.all(pricingPromises)
                                .then((vals: PriceInfoResponse[][]) => {
                                    const pricings: PriceInfoResponse[] = [].concat(...vals);

                                    igdbModel.addGamePricings(pricings)
                                        .then(() => {
                                            sendNotRunningMessage();
                                        })
                                        .catch((error: string) => {
                                            console.log(`Failed inserting new pricings for game id #${gameId}: ${error}`);
                                            sendNotRunningMessage();
                                        });

                                })
                                .catch((error: string) => {
                                    console.log(`Failed to get pricings for game id #${gameId}: ${error}`);
                                    sendNotRunningMessage();
                                });

                            } else {
                                sendNotRunningMessage();
                            }
                        })
                        .catch((error: string) => {
                            console.log(`Failed inserting new pricings for game id #${gameId}: ${error}`);
                            sendNotRunningMessage();
                        });
                    })
                    .catch((error: string) => {
                        console.log(`Failed to get game's sys key id for pricings for game id #${gameId}: ${error}`);
                        sendNotRunningMessage();
                    });

                } else {
                    sendNotRunningMessage();
                }

            })
            . catch((error: string) => {
                console.log(`Failed getting game for new pricings for game id #${gameId}: ${error}`);
                sendNotRunningMessage();
            });

    } catch (err) {
        sendNotRunningMessage();
    }

}