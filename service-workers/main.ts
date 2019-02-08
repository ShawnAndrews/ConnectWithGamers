const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
import { ServiceWorkerEnums } from "../client/client-server-common/common";
import { processVideoPreview } from "./workers/video-previews/main";
import { processImageCacheing } from "./workers/image-cacheing/main";

const REFRESH_TIME_MS: number = 500;
const MAX_ITERATIONS: number = 2;
const serviceWorkerRef: Map<ServiceWorkerEnums, any> = new Map<ServiceWorkerEnums, any>();
const serviceWorkerQueue: Map<ServiceWorkerEnums, Array<any>> = new Map<ServiceWorkerEnums, Array<any>>();
const serviceWorkerRunning: Map<ServiceWorkerEnums, boolean> = new Map<ServiceWorkerEnums, boolean>();
const serviceWorkerMultiTaskEnabled: Map<ServiceWorkerEnums, boolean> = new Map<ServiceWorkerEnums, boolean>();

export interface ServiceWorkerMessage {
    serviceWorkerEnum: ServiceWorkerEnums;
    running: boolean;
}

if (!isMainThread) {

    if (Number(workerData) === ServiceWorkerEnums.video_previews) {
        parentPort.on("message", (gameId: number) => processVideoPreview(gameId) );
    }
    
    if (Number(workerData) === ServiceWorkerEnums.image_cacheing) {
        parentPort.on("message", (gameId: number) => processImageCacheing(gameId) );
    }

}

export default function StartServiceWorkers(): void {

    for (const ServiceWorkerEnum in ServiceWorkerEnums) {
        if (!isNaN(Number(ServiceWorkerEnum))) {
            const newWorker = new Worker(__filename, { workerData: ServiceWorkerEnum });
            newWorker.on("message", (message: ServiceWorkerMessage) => handleMessageFromWorker(message));
            newWorker.on("online", () => console.log(`Service worker (#${ServiceWorkerEnum}) started!`));
            newWorker.on("error", () => restartWorker(Number(ServiceWorkerEnum)));
            serviceWorkerRef.set(Number(ServiceWorkerEnum), newWorker);
            serviceWorkerQueue.set(Number(ServiceWorkerEnum), []);
            serviceWorkerRunning.set(Number(ServiceWorkerEnum), false);
            if (ServiceWorkerEnums.image_cacheing === Number(ServiceWorkerEnum)) {
                serviceWorkerMultiTaskEnabled.set(Number(ServiceWorkerEnum), false);
            } else {
                serviceWorkerMultiTaskEnabled.set(Number(ServiceWorkerEnum), true);
            }
        }
    }

    setInterval(() => {
        for (const ServiceWorkerEnum in ServiceWorkerEnums) {
            if (!isNaN(Number(ServiceWorkerEnum))) {
                const workerMultiTaskEnabled: boolean = serviceWorkerMultiTaskEnabled.get(Number(ServiceWorkerEnum));
                
                if (workerQueueEnabled) {
                    const workerRunning: boolean = serviceWorkerRunning.get(Number(ServiceWorkerEnum));
                    const workerQueueEmpty: boolean = serviceWorkerQueue.get(Number(ServiceWorkerEnum)).length === 0;

                    if (!workerRunning && !workerQueueEmpty) {
                        attemptRunNewTaskOnWorker(Number(ServiceWorkerEnum));
                    }
                } else {
                   attemptRunNewTaskOnWorker(Number(ServiceWorkerEnum));
                }
            }
        }
    }, REFRESH_TIME_MS);

}

export function addTaskToWorker(data: any, serviceWorkerEnum: ServiceWorkerEnums): void {
    const workerMultiTaskEnabled: boolean = serviceWorkerMultiTaskEnabled.get(Number(ServiceWorkerEnum));
    
    if (workerMultiTaskEnabled) {
        serviceWorkerQueue.get(serviceWorkerEnum).push(data);
    } else {
        serviceWorkerRef.get(serviceWorkerEnum).postMessage(data);
    }
}

function restartWorker(serviceWorkerEnum: ServiceWorkerEnums): void {
    console.log(`Restarting worker #${serviceWorkerEnum}...`);
    const newWorker = new Worker(__filename, { workerData: serviceWorkerEnum });
    serviceWorkerRef.set(Number(serviceWorkerEnum), newWorker);
    serviceWorkerRunning.set(Number(serviceWorkerEnum), false);
}

function handleMessageFromWorker(message: ServiceWorkerMessage): void {
    const oldStateRunning: boolean = serviceWorkerRunning.get(message.serviceWorkerEnum);
    const newStateRunning: boolean = message.running;
    const workerMultiTaskEnabled: boolean = serviceWorkerMultiTaskEnabled.get(Number(ServiceWorkerEnum));
    
    if (oldStateRunning && !newStateRunning && workerMultiTaskEnabled) {
        attemptRunNewTaskOnWorker(message.serviceWorkerEnum);
    }

    serviceWorkerRunning.set(message.serviceWorkerEnum, newStateRunning);
}

function attemptRunNewTaskOnWorker(serviceWorkerEnum: ServiceWorkerEnums): void {
    const ref: any = serviceWorkerRef.get(serviceWorkerEnum);
    const queue: Array<any> = serviceWorkerQueue.get(serviceWorkerEnum);

    if (ref && queue.length > 0) {
        ref.postMessage(queue.shift());
    }
}
