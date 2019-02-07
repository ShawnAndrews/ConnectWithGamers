const fs = require("fs");
const { parentPort } = require("worker_threads");
import * as ytdl from "ytdl-core";
import { igdbModel } from "../../../models/db/igdb/main";
import { GameResponse, ServiceWorkerEnums, IGDBImageSizeEnums, IGDBImageUploadPath } from "../../../client/client-server-common/common";
import { ServiceWorkerMessage } from "../../main";

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
  
    cachedImageSizes.forEach((imageSize: string) => {
      
      igdbModel.getGame(gameId, true)
          .then((game: GameResponse) => {

            if (!game.image_cached) {
              const outputPath: string = `cache/image-cacheing/${imageSize}/${gameId}.jpg`;
              const inputPath: string = `${IGDBImageUploadPath}/${imageSize}/${gameId}.jpg`;
              
              downloadAndSaveImage(inputPath, outputPath)
              .then(() => {
                igdbModel.updateGameImageCached(gameId, true);
              })
              .then(() => {
                sendNotRunningMessage();
              })
              .catch((err: string) => {
                console.log(`Failed to download/save/update image data: ${err}`);
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


      });

    } catch (err) {
      sendNotRunningMessage();
    }





    const outputPath: string = `cache/image-cacheing/${gameId}.mp4`;
    const message = (running: boolean): ServiceWorkerMessage => ( { serviceWorkerEnum: ServiceWorkerEnums.video_previews, running: running } );

    const sendNotRunningMessage = (): void => parentPort.postMessage(message(false));
    const sendRunningMessage = (): void => parentPort.postMessage(message(true));

    try {
        sendRunningMessage();

        igdbModel.getGame(gameId, true)
            .then((game: GameResponse) => {
                const failedUploadCached: boolean = fs.existsSync(outputPath) && getFilesizeInBytes(outputPath) === 0;

                if (failedUploadCached) {
                    console.log(`found 0 byte video for game id #${gameId} and deleted.`);
                    fs.unlink(outputPath);
                }

                if (game.video && (!game.video_cached || failedUploadCached)) {
                    ytdl.getInfo(game.video)
                        .then((videoInfo: any) => {
                            const videoLenMs: number = videoInfo.player_response.streamingData.formats.length > 0 && videoInfo.player_response.streamingData.formats[0].approxDurationMs;

                            if (videoLenMs) {
                                const captureStartTimeMs: number = videoLenMs < MAX_VIDEO_CAPTURE_LEN_MS + 3000 ? 0 : videoLenMs - MAX_VIDEO_CAPTURE_LEN_MS;
                                const writable: Writable = fs.createWriteStream(outputPath);
                                const readable: any = ytdl(game.video, { filter: (format: any) => format.container === "mp4", begin: captureStartTimeMs }).pipe(writable);

                                readable.on(`close`, () => {
                                    igdbModel.updateVideoCached(gameId, true)
                                        .then(() => {
                                            sendNotRunningMessage();
                                        })
                                        .catch((err: string) => {
                                            console.log(`Failure updating video_preview! ${err}`);
                                            sendNotRunningMessage();
                                        });
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
    } catch (e) {
        sendNotRunningMessage();
    }

}

function downloadAndSaveImage(inputPath: string, outputPath: string): Promise<any> {

    return new Promise((resolve, reject) => {
        
      request(inputPath, { encoding: 'binary' }, (error: any, response: any, body: any) {
      
        if (error) {
          return reject(error);
        }
      
        try {
          fs.writeFileSync(outputPath, body, 'binary');
          return resolve();
        } catch (e) {
          return reject(e);
        }
        
      });
      
    });
    
}
