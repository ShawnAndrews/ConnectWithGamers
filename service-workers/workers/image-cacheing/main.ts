const fs = require("fs");
const { parentPort } = require("worker_threads");
import { igdbModel } from "../../../models/db/igdb/main";
import { GameResponse, ServiceWorkerEnums, IGDBImageSizeEnums, IGDBImageUploadPath, IGDBImage } from "../../../client/client-server-common/common";
import { ServiceWorkerMessage } from "../../main";
import Axios, { AxiosResponse } from "axios";

const message = (running: boolean): ServiceWorkerMessage => ( { serviceWorkerEnum: ServiceWorkerEnums.image_cacheing, running: running } );
const sendNotRunningMessage = (): void => parentPort.postMessage(message(false));
const sendRunningMessage = (): void => parentPort.postMessage(message(true));
const cachedImageSizes: string[] = [IGDBImageSizeEnums.micro, IGDBImageSizeEnums.cover_big, IGDBImageSizeEnums.screenshot_big, IGDBImageSizeEnums.screenshot_med];

cachedImageSizes.forEach((imageSize: string) => {
    const outputFolderPath: string = `cache/image-cacheing/${imageSize}`;

    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
    }
});

export function processImageCacheing(gameId: number) {

    try {
        sendRunningMessage();

        igdbModel.getGame(gameId, true, true)
            .then((game: GameResponse) => {

                if (!game.image_cached) {
                    const downloadPromises: Promise<void>[] = [];
                    const downloadUids: string[] = game.screenshots.map((x: IGDBImage) => x.image_id).concat(game.cover.image_id);

                    cachedImageSizes.forEach((imageSize: string) => {
                        downloadUids.forEach((uid: string) => {
                            const outputPath: string = `cache/image-cacheing/${imageSize}/${uid}.jpg`;
                            const inputPath: string = `${IGDBImageUploadPath}/t_${imageSize}/${uid}.jpg`;

                            downloadPromises.push(downloadAndSaveImage(inputPath, outputPath));
                        });
                    });

                    Promise.all(downloadPromises)
                    .then(() => {
                        console.log(`Successfully downloaded!`);
                        igdbModel.updateImageCached(gameId, true)
                            .then(() => {
                                console.log(`Successfully updated!`);
                                sendNotRunningMessage();
                            })
                            .catch((err: string) => {
                                console.log(`Failed to update image_cached: ${err}`);
                                sendNotRunningMessage();
                            });
                    })
                    .catch((err: string) => {
                        console.log(`Error cacheing images(#${gameId}): Error: ${err}`);
                        sendNotRunningMessage();
                    });


                } else {
                    sendNotRunningMessage();
                }

            })
            .catch((err: string) => {
                console.log(`Failed to get image cached for game id #${gameId}: ${err}`);
                sendNotRunningMessage();
            });

    } catch (err) {
      sendNotRunningMessage();
    }

}

function downloadAndSaveImage(inputPath: string, outputPath: string): Promise<void> {
    const writer = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
        Axios(inputPath, {
            method: "GET",
            responseType: "stream"
          })
          .then((response: AxiosResponse) => {
              response.data.pipe(writer);
          })
          .catch((err: string) => {
              console.log(`Failed to download image for game. Error: ${err}`);
              return reject(err);
          });

          writer.on("finish", () => { return resolve(); } );
          writer.on("error", (error: string) => { return reject(error); } );
    });
  }