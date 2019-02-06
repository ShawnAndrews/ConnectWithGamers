const fs = require("fs");
const { parentPort } = require("worker_threads");
import * as ytdl from "ytdl-core";
import { igdbModel } from "../../../models/db/igdb/main";
import { GameResponse, ServiceWorkerEnums } from "../../../client/client-server-common/common";
import { Writable } from "stream";
import { ServiceWorkerMessage } from "../../main";

const MAX_VIDEO_CAPTURE_LEN_MS: number = 30000;

export function processVideoPreview(gameId: number) {

    const message = (running: boolean): ServiceWorkerMessage => ( { serviceWorkerEnum: ServiceWorkerEnums.video_previews, running: running } );

    const sendNotRunningMessage = (): void => parentPort.postMessage(message(false));
    const sendRunningMessage = (): void => parentPort.postMessage(message(true));

    try {
        sendRunningMessage();

        igdbModel.getGame(gameId, true)
            .then((game: GameResponse) => {

                if (game.video && !game.video_cached) {
                    ytdl.getInfo(game.video)
                        .then((videoInfo: any) => {
                            const videoLenMs: number = videoInfo.player_response.streamingData.formats.length > 0 && videoInfo.player_response.streamingData.formats[0].approxDurationMs;

                            if (videoLenMs) {
                                const outputPath: string = `cache/video-previews/${gameId}.mp4`;
                                const captureStartTimeMs: number = videoLenMs < MAX_VIDEO_CAPTURE_LEN_MS + 3000 ? 0 : videoLenMs - MAX_VIDEO_CAPTURE_LEN_MS;
                                const writable: Writable = fs.createWriteStream(outputPath);
                                const readable: any = ytdl(game.video, { filter: (format: any) => format.container === "mp4", begin: captureStartTimeMs }).pipe(writable);

                                readable.on(`close`, () => {
                                    if (getFilesizeInBytes(outputPath) === 0) {
                                        fs.unlink(outputPath);
                                        sendNotRunningMessage();
                                    } else {
                                        igdbModel.updateVideoCached(gameId, true)
                                            .then(() => {
                                                sendNotRunningMessage();
                                            })
                                            .catch((err: string) => {
                                                console.log(`Failure updating video_preview! ${err}`);
                                                sendNotRunningMessage();
                                            });
                                    }
                                });

                            } else {
                                console.log(`Failure getting video length! ${videoLenMs}`);
                                sendNotRunningMessage();
                            }
                        })
                        .catch((err: string) => {
                            console.log(`Failure getting video_preview meta data! ${err}`);
                            sendNotRunningMessage();
                        });

                } else {
                    sendNotRunningMessage();
                }

            })
            .catch((err: string) => {
                console.log(`Failed to get video preview for game id #${gameId}: ${err}`);
                sendNotRunningMessage();
            });
    } catch (err) {
        sendNotRunningMessage();
    }

}

function getFilesizeInBytes(path: string): number {
    const stats = fs.statSync(path);
    const fileSizeInBytes: number = stats.size;
    return fileSizeInBytes;
}