import accountController from "./controllers/accountController/account";
import { router as chatroomController } from "./controllers/chatroomController/chatroom";
import igdbController from "./controllers/igdbController/igdb";
import registerChatHandlers from "./controllers/chatroomController/chatroom";
import config from "./config";
import connectToDatabase from "./models/db/connect";
import logIP from "./controllers/logger/main";
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const forceSSL = require("express-force-ssl");
const secureServer = config.useStrictlyHttps ? https.createServer({ key: fs.readFileSync(config.https.key), cert: fs.readFileSync(config.https.cert), ca: fs.readFileSync(config.https.ca) }, app) : undefined;
const chatServer = config.useStrictlyHttps ? https.Server(secureServer) : http.Server(app);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MAX_POST_BODY_SIZE = "50mb";

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
app.use((req: any, res: any, next: any) => {
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

/* client */
app.get("/favicon.ico", (req: any, res: any) => {res.sendFile(path.join(__dirname, "../client/favicon.ico")); });
app.get("/bundle.js", (req: any, res: any) => {res.sendFile(path.join(__dirname, "../client/dist/bundle.js")); });
app.get("/bundle.css", (req: any, res: any) => {res.sendFile(path.join(__dirname, "../client/dist/bundle.css")); });
app.use("*", express.static(path.join(__dirname, "../client/dist")));

/* set chat handlers */
registerChatHandlers(chatServer);

/* start chat server */
chatServer.listen(config.chatPort);

/* start HTTP/HTTPS server */
app.listen(config.httpPort, () => { connectToDatabase(); });
if (config.useStrictlyHttps) {
  secureServer.listen(config.httpsPort);
}