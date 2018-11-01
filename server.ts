import * as core from "express-serve-static-core";
import accountController from "./controllers/accountController/account";
import { router as chatroomController } from "./controllers/chatroomController/chatroom";
import igdbController from "./controllers/igdbController/igdb";
import config from "./config";
import logIP from "./controllers/logger/main";
import { sendContactEmail } from "./util/nodemailer";
const MobileDetect = require("mobile-detect");
const blocked = require("blocked");
const express = require("express");
const app: core.Express = express();
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
app.use((req: core.Request, res: core.Response, next: core.NextFunction) => {
  if (req.url === `/bundle.css`) {
    console.log(`Request (${req.connection.remoteAddress.replace(/^.*:/, ``)}): ${req.url}`);
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
app.get("/favicon.ico", (req: core.Request, res: core.Response) => {res.sendFile(path.join(__dirname, "../client/favicon.ico")); });
app.get("/robots.txt", (req: core.Request, res: core.Response) => {res.sendFile(path.join(__dirname, "../client/robots.txt")); });
app.get("/riot.txt", (req: core.Request, res: core.Response) => {res.sendFile(path.join(__dirname, "../client/riot.txt")); });

/* desktop */
app.use(handleDesktopRequests);

/* client */
app.get("/bundle.js", (req: core.Request, res: core.Response) => {res.sendFile(path.join(__dirname, "../client/dist/bundle.js")); });
app.get("/bundle.css", (req: core.Request, res: core.Response) => {res.sendFile(path.join(__dirname, "../client/dist/bundle.css")); });
app.use("*", express.static(path.join(__dirname, "../client/dist")));

/* start HTTP/HTTPS server */
app.listen(config.httpPort);
if (config.useStrictlyHttps) {
    secureServer.listen(config.httpsPort);
}

function handleDesktopRequests(req: core.Request, res: core.Response, next: core.NextFunction): void {
  const device: any = new MobileDetect(req.headers["user-agent"]);
  if (device.phone() === null) {
    if (req.path === "/") {
      res.sendFile(path.join(__dirname, `../client/desktop/index.html`));
    } else if (req.path === "/emailform") {
      console.log(`Req email: ${JSON.stringify(req.body)}`);
      sendContactEmail(req.body.name, req.body.email, req.body.title, req.body.message)
        .then(() => {
          res.send({ success: true });
        })
        .catch((err: string) => {
          res.send({ success: false, error: err });
        });
    } else {
      res.sendFile(path.join(__dirname, `../client/desktop${req.path}`));
    }
  } else {
    next();
  }
}