const express = require("express");
// const RateLimit = require("express-rate-limit");
const router = express.Router();
import { AUTH_TOKEN_NAME, validateCredentials, DatelessResponse, AccountSettingsResponse, DbAccountSettingsResponse, DbAuthenticateResponse, DbTokenResponse, DbAuthorizeResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";

const routes = new routeModel();

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
// const createAccountLimiter = new RateLimit({
//     windowMs: 60 * 60 * 1000,
//     max: 5,
//     delayMs: 0
// });

// router.post(routes.getRoute("signup"), createAccountLimiter);
router.post(routes.getRoute("signup"), (req: any, res: any) => {

    const datelessResponse: DatelessResponse = { error: undefined };
    const signupData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    // validate
    const error: string = validateCredentials(signupData.username, signupData.password, signupData.email);
    if (error) {
        datelessResponse.error = error;
        return res
        .send(datelessResponse);
    }

    // create account in db
    db.createAccount(signupData.username, signupData.email, signupData.password)
        .then(() => {
            return res
            .send(datelessResponse);
        })
        .catch((error: string) => {
            datelessResponse.error = error;
            return res
            .send(datelessResponse);
        });

});

router.post(routes.getRoute("login"), (req: any, res: any) => {

    const datelessResponse: DatelessResponse = { error: undefined };

    // validate credentials
    const error: string = validateCredentials(req.body.username, req.body.password, undefined, req.body.remember);
    if (error) {
        datelessResponse.error = error;
        return res
        .send(datelessResponse);
    }

    // authenticate
    db.authenticate(req.body.username, req.body.password, req.body.remember)
        .then((response: DbAuthenticateResponse) => {
            // authentication success
            return db.token(response.username, response.remember);
        })
        .then((response: DbTokenResponse) => {
            // token success
            const newToken: string = response.token;
            const newTokenExpiration: Date = response.tokenExpiration;
            return res
            .cookie(AUTH_TOKEN_NAME, newToken, { expires: newTokenExpiration })
            .send(datelessResponse);
        })
        .catch((error: string) => {
            // authentication or token failure
            datelessResponse.error = error;
            return res
            .send(datelessResponse);
        });

});

router.post(routes.getRoute("settings"), (req: any, res: any) => {

    const accountSettingsResponse: AccountSettingsResponse = { error: undefined };

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.getAccountSettings(response.accountid);
    })
    .then((response: DbAccountSettingsResponse) => {
        accountSettingsResponse.data = {
            username: response.username,
            email: response.email,
            steam: response.steam,
            discord: response.discord,
            twitch: response.twitch
        };
        return res
        .send(accountSettingsResponse);
    })
    .catch((error: string) => {
        accountSettingsResponse.error = error;
        return res
        .send(accountSettingsResponse);
    });

});

router.post(routes.getRoute("change/username"), (req: any, res: any) => {
    const datelessResponse: DatelessResponse = { error: undefined };
    const newUsername: string = req.body.newUsername;

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.changeAccountUsername(response.accountid, newUsername);
    })
    .then(() => {
        return res
        .send(datelessResponse);
    })
    .catch((error: string) => {
        datelessResponse.error = error;
        return res
        .send(datelessResponse);
    });

});

router.post(routes.getRoute("change/email"), (req: any, res: any) => {
    const datelessResponse: DatelessResponse = { error: undefined };
    const newEmail: string = req.body.newEmail;

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.changeAccountEmail(response.accountid, newEmail);
    })
    .then(() => {
        return res
        .send(datelessResponse);
    })
    .catch((error: string) => {
        datelessResponse.error = error;
        return res
        .send(datelessResponse);
    });

});

router.post(routes.getRoute("change/discord"), (req: any, res: any) => {
    const datelessResponse: DatelessResponse = { error: undefined };
    const newDiscord: string = req.body.newDiscord;

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.changeAccountDiscord(response.accountid, newDiscord);
    })
    .then(() => {
        return res
        .send(datelessResponse);
    })
    .catch((error: string) => {
        datelessResponse.error = error;
        return res
        .send(datelessResponse);
    });

});

router.post(routes.getRoute("change/steam"), (req: any, res: any) => {
    const datelessResponse: DatelessResponse = { error: undefined };
    const newSteam: string = req.body.newSteam;

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.changeAccountSteam(response.accountid, newSteam);
    })
    .then(() => {
        return res
        .send(datelessResponse);
    })
    .catch((error: string) => {
        datelessResponse.error = error;
        return res
        .send(datelessResponse);
    });

});

router.post(routes.getRoute("change/twitch"), (req: any, res: any) => {
    const datelessResponse: DatelessResponse = { error: undefined };
    const newTwitch: string = req.body.newTwitch;

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.changeAccountTwitch(response.accountid, newTwitch);
    })
    .then(() => {
        return res
        .send(datelessResponse);
    })
    .catch((error: string) => {
        datelessResponse.error = error;
        return res
        .send(datelessResponse);
    });

});

export default router;