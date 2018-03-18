const express = require("express");
const app = express();
const chatServer = require("http").Server(app);
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
import accountController from "./controllers/accountController/account";
import igdbController from "./controllers/igdbController/igdb";
import registerChatHandlers from "./controllers/chatroomController/chatroom";
import config from "./config";
import db from "./models/db";
import logIP from "./controllers/logger/main";

/* parse post body */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* enable cookies  */
app.use(cookieParser());

/* log ip and date of access */
app.use((req: any, res: any, next: any) => {
  console.log(`Request (${req.connection.remoteAddress.replace(/^.*:/, ``)}): ${req.url}`);
  logIP(req.connection.remoteAddress);
  next();
});

/* account authentication controller */
app.use("/account", accountController);

/* igdb api controller */
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

/* start HTTP server */
app.listen(config.serverPort, () => {

  // connect to db
  db.connect(config.connectionStrings["local"])
    .then(() => {
      console.log(`Successfully connected to database.`);
    })
    .catch((error: any) => {
      console.log(`Error connecting to db: ${error}. Shutting down now.`);
      process.exit();
    });

});