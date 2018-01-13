const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
import accountController from "./controllers/accountController/account";
import config from "./config";
import db from "./models/db";

/* parse post body */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* enable cookies  */
app.use(cookieParser());

/* account authentication controller */
app.use("/account", accountController);

/* client */
app.get("/bundle.js", function(req: any, res: any) {res.sendFile(path.join(__dirname, "../client/dist/bundle.js")); });
app.get("/bundle.css", function(req: any, res: any) {res.sendFile(path.join(__dirname, "../client/dist/bundle.css")); });
app.use("*", express.static(path.join(__dirname, "../client/dist")));

/* listen */
app.listen(config.serverPort, function () {
  console.log(`Example app listening on port ${config.serverPort}!`);
  console.log("Directory: " + path.join(__dirname, "client/dist"));

  // connect to db
  db.connect(config.connectionStrings["local"])
    .then((res: any) => {
      console.log(`Successfully connected to database.`);
    })
    .catch((err: any) => {
      console.log(`Error connecting to db: ${err}. Shutting down now.`);
      process.exit();
    });

});