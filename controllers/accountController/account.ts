const express = require("express");
const HttpStatus = require("http-status-codes");
const RateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const router = express.Router();
const igdb = require("igdb-api-node").default;
import { validateCredentials, ResponseModel } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";
import config from "../../config";

const routes = new routeModel();
const client = igdb(config.igdb.key);

/* routes */
routes.addRoute("signup", "/signup");
routes.addRoute("login", "/login");
routes.addRoute("settings", "/settings");
routes.addRoute("change/username", "/change/username");
routes.addRoute("change/email", "/change/email");
routes.addRoute("change/discord", "/change/discord");
routes.addRoute("change/steam", "/change/steam");
routes.addRoute("change/twitch", "/change/twitch");

// limit account creation requests to 5acc/1hr
const createAccountLimiter = new RateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    delayMs: 0
  });

// router.post(routes.getRoute("signup"), createAccountLimiter);
router.post(routes.getRoute("signup"), (req: any, res: any) => {

    const signupData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    // validate
    const response: ResponseModel = validateCredentials(signupData.username, signupData.password, signupData.email);
    if (response.errors.length > 0) {
        return res
        .send(response);
    }

    // create account in db
    db.createAccount(signupData.username, signupData.email, signupData.password)
        .then((response: ResponseModel) => {
            return res
            .send(response);
        })
        .catch((response: ResponseModel) => {
            return res
            .send(response);
        });

});

router.post(routes.getRoute("login"), (req: any, res: any) => {

    // validate credentials
    const response: ResponseModel = validateCredentials(req.body.username, req.body.password, undefined, req.body.remember);
    if (response.errors.length > 0) {
        return res
        .send(response);
    }

    // authenticate
    db.authenticate(req.body.username, req.body.password, req.body.remember)
        .then( (result: ResponseModel) => {
            // authentication success
            console.log("auth then: ", JSON.stringify(result));
            return db.token(result.data.username, result.data.remember);
        })
        .then((result: ResponseModel) => {
            // token success
            console.log("auth2 then: ", JSON.stringify(result));
            return res
            .cookie("authToken", result.data.token, { expires: result.data.tokenExpiration, httpOnly: true })
            .cookie("loginToken", "", { expires: result.data.tokenExpiration })
            .send();
        })
        .catch((response: ResponseModel) => {
            // authentication or token failure
            console.log("auth error, catching: ", JSON.stringify(response));
            return res
            .send(response);
        });

});

router.post(routes.getRoute("settings"), (req: any, res: any) => {

    // authorize
    db.authorize(req)
    .then((response: ResponseModel) => {
        return db.getAccountSettings(response.data.accountid);
    })
    .then((response: ResponseModel) => {
        return res
        .send(response);
    })
    .catch((response: ResponseModel) => {
        return res
        .send(response);
    });

});

router.post(routes.getRoute("change/username"), (req: any, res: any) => {
    const newUsername: string = req.body.newUsername;

    // authorize
    db.authorize(req)
    .then((response: ResponseModel) => {
        return db.changeAccountUsername(response.data.accountid, newUsername);
    })
    .then((response: ResponseModel) => {
        return res
        .send(response);
    })
    .catch((response: ResponseModel) => {
        return res
        .send(response);
    });

});

router.post(routes.getRoute("change/email"), (req: any, res: any) => {
    const newEmail: string = req.body.newEmail;

    // authorize
    db.authorize(req)
    .then((response: ResponseModel) => {
        return db.changeAccountEmail(response.data.accountid, newEmail);
    })
    .then((response: ResponseModel) => {
        return res
        .send(response);
    })
    .catch((response: ResponseModel) => {
        return res
        .send(response);
    });

});

router.post(routes.getRoute("change/discord"), (req: any, res: any) => {
    const newDiscord: string = req.body.newDiscord;

    // authorize
    db.authorize(req)
    .then((response: ResponseModel) => {
        return db.changeAccountDiscord(response.data.accountid, newDiscord);
    })
    .then((response: ResponseModel) => {
        return res
        .send(response);
    })
    .catch((response: ResponseModel) => {
        return res
        .send(response);
    });

});

router.post(routes.getRoute("change/steam"), (req: any, res: any) => {
    const newSteam: string = req.body.newSteam;

    // authorize
    db.authorize(req)
    .then((response: ResponseModel) => {
        return db.changeAccountSteam(response.data.accountid, newSteam);
    })
    .then((response: ResponseModel) => {
        return res
        .send(response);
    })
    .catch((response: ResponseModel) => {
        return res
        .send(response);
    });

});

router.post(routes.getRoute("change/twitch"), (req: any, res: any) => {
    const newTwitch: string = req.body.newTwitch;

    // authorize
    db.authorize(req)
    .then((response: ResponseModel) => {
        return db.changeAccountTwitch(response.data.accountid, newTwitch);
    })
    .then((response: ResponseModel) => {
        return res
        .send(response);
    })
    .catch((response: ResponseModel) => {
        return res
        .send(response);
    });

});

export default router;