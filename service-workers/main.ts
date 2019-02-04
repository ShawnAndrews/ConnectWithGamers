const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
import { ServiceWorkerEnums } from "../client/client-server-common/common";
import { processVideoPreview } from "./workers/video-previews/main";

const ITERATION_TIME_MS: number = 2000;
const MAX_ITERATIONS: number = 2;
const serviceWorkerRef: Map<ServiceWorkerEnums, any> = new Map<ServiceWorkerEnums, any>();
const serviceWorkerQueue: Map<ServiceWorkerEnums, Array<any>> = new Map<ServiceWorkerEnums, Array<any>>();
const serviceWorkerIterations: Map<ServiceWorkerEnums, number> = new Map<ServiceWorkerEnums, number>();
const serviceWorkerAddedDataFlag: Map<ServiceWorkerEnums, boolean> = new Map<ServiceWorkerEnums, boolean>();

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
            serviceWorkerIterations.set(Number(ServiceWorkerEnum), 0);
            serviceWorkerAddedDataFlag.set(Number(ServiceWorkerEnum), false);
        }
    }

    setInterval(() => {
        for (const ServiceWorkerEnum in ServiceWorkerEnums) {
            if (!isNaN(Number(ServiceWorkerEnum))) {
                const workerIterations: number = serviceWorkerIterations.get(Number(ServiceWorkerEnum));
                if (serviceWorkerAddedDataFlag.get(Number(ServiceWorkerEnum)) && workerIterations < MAX_ITERATIONS) {
                    serviceWorkerIterations.set(Number(ServiceWorkerEnum), workerIterations + 1);
                }

                if (workerIterations === MAX_ITERATIONS && serviceWorkerQueue.get(Number(ServiceWorkerEnum)).length !== 0) {
                    runTaskOnWorker(Number(ServiceWorkerEnum));
                    serviceWorkerAddedDataFlag.set(Number(ServiceWorkerEnum), false);
                    serviceWorkerIterations.set(Number(ServiceWorkerEnum), 0);
                }
            }
        }
    }, ITERATION_TIME_MS);

}

export function addTaskToWorker(data: any, serviceWorkerEnum: ServiceWorkerEnums): void {
    serviceWorkerQueue.get(serviceWorkerEnum).push(data);
    serviceWorkerAddedDataFlag.set(ServiceWorkerEnums, false);
}

export function runTaskOnWorker(serviceWorkerEnum: ServiceWorkerEnums): void {
    const ref: any = serviceWorkerRef.get(serviceWorkerEnum);
    const queue: Array<any> = serviceWorkerQueue.get(serviceWorkerEnum);

    if (ref && queue.length > 0) {
        ref.postMessage(queue.shift());
    }
}
