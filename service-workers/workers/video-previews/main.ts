const fs = require("fs");
const { parentPort } = require("worker_threads");
import ytdl = require("ytdl-core");
import { igdbModel } from "../../../models/db/igdb/main";
import { GameResponse, ServiceWorkerEnums } from "../../../client/client-server-common/common";
import { Writable } from "stream";
import { ServerWorkerFinishedMessage } from "../../main";

export function processVideoPreview(gameId: number) {
    console.log(`Processing game id #${gameId}...`);

    const message: ServerWorkerFinishedMessage = { enum: ServiceWorkerEnums.video_previews };

    try {

        igdbModel.getGame(gameId)
            .then((game: GameResponse) => {

                const runNextTask = (): void => {
                    igdbModel.updateVideoCached(gameId, true)
                        .then(() => {
                            parentPort.postMessage(message);
                        })
                        .catch((err: string) => {
                            console.log(`Failure updating video_preview! ${err}`);
                        });
                }:
            
                if (game.video && !game.video_cached) {
                    const writable: Writable = fs.createWriteStream(`cache/video-previews/${gameId}.mp4`);
                    const readable: Writable = ytdl(game.video, { filter: (format: any) => format.container === "mp4" }).pipe(writable);

                    readable.on(`close`, () => {
                        console.log(`Worker finished #${gameId}!`);
                        runNextTask();
                    });

                    readable.on(`error`, (err: any) => {
                        console.log(`Worker crashed #${gameId}! ${JSON.stringify(err)}`);
                    });

                } else {
                    runNextTask();
                }

            })
            .catch((err: string) => {
                console.log(`Failed to get video preview for game id #${gameId}: ${err}`);
            });
    } catch (err) {
        runNextTask();
    }

}
