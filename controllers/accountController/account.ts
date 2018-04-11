const express = require("express");
// const RateLimit = require("express-rate-limit");
const router = express.Router();
import { AUTH_TOKEN_NAME, validateCredentials, DatalessResponse, DbVerifyEmailResponse, EmailVerifyResponse, AccountSettingsResponse, AccountImageResponse, DbAccountSettingsResponse, DbAccountImageResponse, DbAuthenticateResponse, DbTokenResponse, DbAuthorizeResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";

const routes = new routeModel();

/* routes */
routes.addRoute("signup", "/signup");
routes.addRoute("login", "/login");
routes.addRoute("settings", "/settings");
routes.addRoute("settings/change", "/settings/change");
routes.addRoute("settings/image/change", "/settings/image/change");
routes.addRoute("settings/image/delete", "/settings/image/delete");
routes.addRoute("email/resend", "/email/resend");
routes.addRoute("email/verify", "/email/verify");

// limit account creation requests to 5acc/1hr per ip
// const createAccountLimiter = new RateLimit({
//     windowMs: 60 * 60 * 1000,
//     max: 5,
//     delayMs: 0
// });

// router.post(routes.getRoute("signup"), createAccountLimiter);
router.post(routes.getRoute("signup"), (req: any, res: any) => {

    const datalessResponse: DatalessResponse = { error: undefined };
    const signupData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    // validate
    const error: string = validateCredentials(signupData.username, signupData.password, signupData.email);
    if (error) {
        datalessResponse.error = error;
        return res
        .send(datalessResponse);
    }

    // create account in db
    db.createAccount(signupData.username, signupData.email, signupData.password)
        .then(() => {
            return res
            .send(datalessResponse);
        })
        .catch((error: string) => {
            datalessResponse.error = error;
            return res
            .send(datalessResponse);
        });

});

router.post(routes.getRoute("login"), (req: any, res: any) => {

    const datalessResponse: DatalessResponse = { error: undefined };

    // validate credentials
    const error: string = validateCredentials(req.body.username, req.body.password, undefined, req.body.remember);
    if (error) {
        datalessResponse.error = error;
        return res
        .send(datalessResponse);
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
            .send(datalessResponse);
        })
        .catch((error: string) => {
            // authentication or token failure
            datalessResponse.error = error;
            return res
            .send(datalessResponse);
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
            twitch: response.twitch,
            image: response.image,
            emailVerified: response.emailVerified
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

router.post(routes.getRoute("settings/change"), (req: any, res: any) => {
    const datalessResponse: DatalessResponse = { error: undefined };
    const newSettings: any = req.body.newSettings;

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        const changePromises: Promise<null>[] = [];

        if (newSettings.username) {
            changePromises.push(db.changeAccountUsername(response.accountid, newSettings.username));
        }

        if (newSettings.email) {
            changePromises.push(db.changeAccountEmail(response.accountid, newSettings.email));
        }

        if (newSettings.password) {
            changePromises.push(db.changeAccountPassword(response.accountid, newSettings.password));
        }

        if (newSettings.steam) {
            changePromises.push(db.changeAccountSteam(response.accountid, newSettings.steam));
        }

        if (newSettings.discord) {
            changePromises.push(db.changeAccountDiscord(response.accountid, newSettings.discord));
        }

        if (newSettings.twitch) {
            changePromises.push(db.changeAccountTwitch(response.accountid, newSettings.twitch));
        }

        Promise.all(changePromises)
        .then((vals: any) => {
            return res
            .send(datalessResponse);
        })
        .catch((error: string) => {
            datalessResponse.error = error;
            return res
            .send(datalessResponse);
        });

    })
    .catch((error: string) => {
        datalessResponse.error = error;
        return res
        .send(datalessResponse);
    });

});

router.post(routes.getRoute("settings/image/change"), (req: any, res: any) => {
    const accountImageResponse: AccountImageResponse = { error: undefined };
    const imageBase64: string = Object.keys(req.body)[0].split(",")[1];

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.changeAccountImage(response.accountid, imageBase64);
    })
    .then((response: DbAccountImageResponse) => {
        accountImageResponse.link = response.link;
        return res
        .send(accountImageResponse);
    })
    .catch((error: string) => {
        accountImageResponse.error = error;
        return res
        .send(accountImageResponse);
    });

});

router.post(routes.getRoute("email/resend"), (req: any, res: any) => {
    const datalessResponse: DatalessResponse = { error: undefined };

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.resendAccountEmail(response.accountid);
    })
    .then(() => {
        return res
        .send();
    })
    .catch((error: string) => {
        datalessResponse.error = error;
        return res
        .send(datalessResponse);
    });

});

router.post(routes.getRoute("email/verify"), (req: any, res: any) => {
    const verifyEmailResponse: EmailVerifyResponse = { error: undefined };
    const verificationCode: any = req.body.verificationCode;

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.verifyAccountEmail(response.accountid, verificationCode);
    })
    .then((response: DbVerifyEmailResponse) => {
        verifyEmailResponse.data = { verificationSuccessful: response.verificationSuccessful };
        return res
        .send(verifyEmailResponse);
    })
    .catch((error: string) => {
        verifyEmailResponse.error = error;
        return res
        .send(verifyEmailResponse);
    });

});

router.post(routes.getRoute("settings/image/delete"), (req: any, res: any) => {
    const accountImageResponse: AccountImageResponse = { error: undefined };

    // authorize
    db.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return db.deleteAccountImage(response.accountid);
    })
    .then((response: DbAccountImageResponse) => {
        accountImageResponse.link = response.link;
        return res
        .send(accountImageResponse);
    })
    .catch((error: string) => {
        accountImageResponse.error = error;
        return res
        .send(accountImageResponse);
    });

});

export default router;