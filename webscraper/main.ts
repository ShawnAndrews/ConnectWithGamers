import { scheduleGamesJob, scheduleRouteJob } from "./jobs";
import { runBus } from "./bus";

scheduleRouteJob({ hour: 4, minute: 0 });
scheduleGamesJob({ hour: 17, minute: 0 });
runBus();