import { scheduleDailyJob } from "./jobs";
import { runBus } from "./bus";

scheduleDailyJob({ hour: 21, minute: 7 });
runBus();