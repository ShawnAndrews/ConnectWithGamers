import accountController from "./controllers/accountController/account";
import { router as chatroomController } from "./controllers/chatroomController/chatroom";
import igdbController from "./controllers/igdbController/igdb";
import config from "./config";
import logIP from "./controllers/logger/main";
import { Request, Response, Express, NextFunction } from "express";
import StartServiceWorkers from "./service-workers/main";
const blocked = require("blocked");
const express = require("express");
const app: Express = express();
const https = require("https");
const fs = require("fs");
const path = require("path");
const forceSSL = require("express-force-ssl");
const secureServer = config.useStrictlyHttps ? https.createServer({ key: fs.readFileSync(config.https.key), cert: fs.readFileSync(config.https.cert), ca: fs.readFileSync(config.https.ca) }, app) : undefined;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MAX_POST_BODY_SIZE = "50mb";
const PROCESS_STALL_THRESHOLD_MS = "1000";

/* detect any block in event loop */
blocked((ms: number) => {
    console.log(`Event loop blocked (${ms}ms)`);
    console.trace();
}, { threshold: PROCESS_STALL_THRESHOLD_MS });

/* parse post body */
app.use(bodyParser.json({limit: MAX_POST_BODY_SIZE}));
app.use(bodyParser.urlencoded({limit: MAX_POST_BODY_SIZE, extended: false }));

/* transform request to HTTPS */
if (config.useStrictlyHttps) {
    app.use(forceSSL);
}

/* enable cookies  */
app.use(cookieParser());

/* log ip and date of access */
app.use((req: Request, res: Response, next: NextFunction) => {
    const ip: string = req.connection.remoteAddress.replace(/^.*:/, ``);
    const accessTime: string = new Date().toLocaleTimeString();
    if (req.url === `/bundle.css` && ip !== "1") {
        console.log(`Request (${ip} at ${accessTime}): ${req.url} `);
        logIP(req.connection.remoteAddress);
    }
    next();
});

/* chatroom controller */
app.use("/chatroom", chatroomController);

/* account authentication controller */
app.use("/account", accountController);

/* igdb controller */
app.use("/igdb", igdbController);

/* common */
app.get("/favicon.ico", (req: Request, res: Response) => {res.sendFile(path.join(__dirname, "../client/favicon.ico")); });
app.get("/robots.txt", (req: Request, res: Response) => {res.sendFile(path.join(__dirname, "../client/robots.txt")); });
app.get("/riot.txt", (req: Request, res: Response) => {res.sendFile(path.join(__dirname, "../client/riot.txt")); });

/* cache */
console.log(`before: ${__dirname} || after: ${path.join(__dirname, "/../cache")}`);
app.use("/cache", express.static(path.join(__dirname, "/../cache")));

/* client */
app.get("/bundle.js", (req: Request, res: Response) => {res.sendFile(path.join(__dirname, "../client/dist/bundle.js")); });
app.get("/bundle.css", (req: Request, res: Response) => {res.sendFile(path.join(__dirname, "../client/dist/bundle.css")); });
app.use("*", express.static(path.join(__dirname, "../client/dist")));

/* start HTTP/HTTPS server */
app.listen(config.httpPort);
if (config.useStrictlyHttps) {
    secureServer.listen(config.httpsPort);
}

/* start service workers */
StartServiceWorkers();