const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
import { ServiceWorkerEnums } from "../client/client-server-common/common";
import { processVideoPreview } from "./workers/video-previews/main";

const serviceWorkerRef: Map<ServiceWorkerEnums, any> = new Map<ServiceWorkerEnums, any>();
const serviceWorkerQueue: Map<ServiceWorkerEnums, Array<any>> = new Map<ServiceWorkerEnums, Array<any>>();
let iterationsWithData: number = 0;
let addedData: boolean = false;

export interface ServerWorkerFinishedMessage {
    enum: ServiceWorkerEnums;
}

if (!isMainThread) {

    if (Number(workerData) === ServiceWorkerEnums.video_previews) {
        parentPort.on("message", (gameId: number) => processVideoPreview(gameId) );
    }

}

export default function StartServiceWorkers(): void {

    for (const ServiceWorkerEnum in ServiceWorkerEnums) {
        if (!isNaN(Number(ServiceWorkerEnum))) {
            const newWorker = new Worker(__filename, { workerData: ServiceWorkerEnum });
            newWorker.on("message", (message: ServerWorkerFinishedMessage) => assignNewTaskToWorker(message.enum));
            newWorker.on("error", (err: any) => console.log(`Service worker (#${ServiceWorkerEnum}) crashed: ${JSON.stringify(err)}`));
            serviceWorkerRef.set(Number(ServiceWorkerEnum), newWorker);
            serviceWorkerQueue.set(Number(ServiceWorkerEnum), []);
        }
    }

    setInterval(() => {
        if (addedData && iterationsWithData < 2) {
            iterationsWithData++;
        }

        if (iterationsWithData === 2 && serviceWorkerQueue.get(ServiceWorkerEnums.video_previews).length !== 0) {
            assignNewTaskToWorker(ServiceWorkerEnums.video_previews);
            addedData = false;
            iterationsWithData = 0;
        }
    }, 1000);

}

export function addTaskToWorker(data: any, serviceWorkerEnum: ServiceWorkerEnums): void {
    serviceWorkerQueue.get(serviceWorkerEnum).push(data);
    addedData = true;
}

export function assignNewTaskToWorker(serviceWorkerEnum: ServiceWorkerEnums): void {
    const ref: any = serviceWorkerRef.get(serviceWorkerEnum);
    const queue: Array<any> = serviceWorkerQueue.get(serviceWorkerEnum);

    if (ref && queue.length > 0) {
        ref.postMessage(queue.shift());
    }
}