import { scheduleNewGamesJob, scheduleRouteJob, scheduleRefreshGamesJob } from "./jobs";
import { runBus } from "./bus";

scheduleRouteJob(`* * 1 * *`); // every hour
scheduleNewGamesJob({ hour: 0, minute: 0 });
scheduleRefreshGamesJob(1000); // every 3 seconds
runBus();