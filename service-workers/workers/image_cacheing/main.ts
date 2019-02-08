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
                igdbModel.updateImageCached(gameId, true);
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
