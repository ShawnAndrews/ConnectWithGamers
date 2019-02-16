const { parentPort } = require("worker_threads");
import { ServiceWorkerEnums, PriceInfoResponse, GenericModelResponse, DbTables, DbTablePricingsFields, DbTableIGDBGamesFields, GameResponse } from "../../../client/client-server-common/common";
import { ServiceWorkerMessage } from "../../main";
import { getSteamPricings } from "./steam/main";
import { igdbModel } from "../../../models/db/igdb/main";

const message = (running: boolean): ServiceWorkerMessage => ( { serviceWorkerEnum: ServiceWorkerEnums.pricing_update, running: running } );
const sendNotRunningMessage = (): void => parentPort.postMessage(message(false));
const sendRunningMessage = (): void => parentPort.postMessage(message(true));

export function processPricingsUpdate(gameId: number) {

    try {
        sendRunningMessage();

        let igdb_games_sys_key_id: number = undefined;
        let steam_link: string = undefined;

        igdbModel.getGame(gameId, true)
            .then((gameResponse: GameResponse) => {
                steam_link = gameResponse.steam_link;

                if (steam_link) {

                    igdbModel.getGameSysKey(gameId)
                    .then((sys_key_id: number) => {
                        igdb_games_sys_key_id = sys_key_id;

                        // check for expired pricings
                        igdbModel.isGamePricingExpired(gameId)
                        .then((expired: boolean) => {

                            if (expired) {
                                const pricingPromises: Promise<PriceInfoResponse[]>[] = [];

                                pricingPromises.push(getSteamPricings(igdb_games_sys_key_id, steam_link));

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