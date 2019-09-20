import * as fs from "fs";

export function log(message: string): void {
    const logsDirectoryPath: string = __dirname + `/../../logs`;
    const todayFilePath: string = __dirname + `/../../logs/${new Date().getFullYear()}_${new Date().getMonth().toString().padStart(2, `0`)}_${new Date().getDay().toString().padStart(2, `0`)}.txt`;

    try {

        // create logs directory if it doesn't exist
        if (!fs.existsSync(logsDirectoryPath)) {
            fs.mkdirSync(logsDirectoryPath);
        }

        // create current day log
        if (!fs.existsSync(todayFilePath)) {
            fs.writeFileSync(todayFilePath, ``);
        }

        // append new message line
        fs.appendFileSync(todayFilePath, `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}: ${message}\r\n`, { flag: "a" });

    } catch (error) {
        console.log(`Failed to write message to log! ${error}`);
    }

}