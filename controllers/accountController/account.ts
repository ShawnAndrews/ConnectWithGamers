const express = require("express");
const RateLimit = require("express-rate-limit");
import { Request, Response, Router } from "express";
const router: Router = express.Router();
import { AUTH_TOKEN_NAME, validateCredentials, RecoveryEmailInfo, EmailRecoveryVerifyResponse, DatalessResponse, EmailVerifiedFlagResponse, AccountImageResponse, AccountInfo, AuthenticationInfo, TokenInfo, TwitchIdResponse, SteamIdResponse, SteamFriendsResponse, DiscordLinkResponse, TwitchFollowersResponse, AccountInfoResponse, AccountsInfo, SteamFriend, TwitchUser } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { accountModel } from "../../models/db/account/main";
import { securityModel } from "../../models/db/security/main";
import { settingsModel } from "../../models/db/settings/main";
import { sendRecoveryEmail } from "../../util/nodemailer";

export const routes = new routeModel();

/* routes */
routes.addRoute("signup", "/signup");
routes.addRoute("login", "/login");
routes.addRoute("public/info", "/public/info");
routes.addRoute("settings", "/settings");
routes.addRoute("settings/change", "/settings/change");
routes.addRoute("settings/twitchId", "/settings/twitchId");
routes.addRoute("settings/twitchFollowers", "/settings/twitchFollowers");
routes.addRoute("settings/steamId", "/settings/steamId");
routes.addRoute("settings/steamFriends", "/settings/steamFriends");
routes.addRoute("settings/discordLink", "/settings/discordLink");
routes.addRoute("settings/image/change", "/settings/image/change");
routes.addRoute("settings/image/delete", "/settings/image/delete");
routes.addRoute("email/resend", "/email/resend");
routes.addRoute("email/verify", "/email/verify");
routes.addRoute("email/recovery", "/email/recovery");
routes.addRoute("email/recovery/verify", "/email/recovery/verify");
routes.addRoute("recover/password", "/recover/password");
routes.addRoute("delete", "/delete");

// limit account creation requests to 5acc/1hr per ip
const createAccountLimiter = new RateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    delayMs: 0
});

router.post(routes.getRoute("signup"), createAccountLimiter);
router.post(routes.getRoute("signup"), (req: Request, res: Response) => {

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
    accountModel.createAccount(signupData.username, signupData.email, signupData.password)
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

router.post(routes.getRoute("login"), (req: Request, res: Response) => {

    const datalessResponse: DatalessResponse = { error: undefined };

    // validate credentials
    const error: string = validateCredentials(req.body.username, req.body.password, undefined, req.body.remember);
    if (error) {
        datalessResponse.error = error;
        return res
        .send(datalessResponse);
    }

    // authenticate
    securityModel.authenticate(req.body.username, req.body.password, req.body.remember)
        .then((response: AuthenticationInfo) => {
            // authentication success
            return securityModel.token(response.username, response.remember);
        })
        .then((response: TokenInfo) => {
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

router.post(routes.getRoute("public/info"), (req: Request, res: Response) => {

    const publicAccountInfoResponse: AccountInfoResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.getAccountsInfoById([accountId]);
    })
    .then((response: AccountsInfo) => {
        publicAccountInfoResponse.data = {
            image: response.accounts[0].image,
            username: response.accounts[0].username,
            discord: response.accounts[0].discord,
            steam: response.accounts[0].steam,
            twitch: response.accounts[0].twitch
        };
        return res
        .send(publicAccountInfoResponse);
    })
    .catch((error: string) => {
        publicAccountInfoResponse.error = error;
        return res
        .send(publicAccountInfoResponse);
    });

});

router.post(routes.getRoute("settings"), (req: Request, res: Response) => {

    const accountInfoResponse: AccountInfoResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return settingsModel.getAccountInfo(accountId);
    })
    .then((response: AccountInfo) => {
        const accountInfo: AccountInfo = {
            username: response.username,
            email: response.email,
            steam: response.steam,
            discord: response.discord,
            twitch: response.twitch,
            image: response.image,
            emailVerified: response.emailVerified
        };
        accountInfoResponse.data = accountInfo;
        return res
        .send(accountInfoResponse);
    })
    .catch((error: string) => {
        accountInfoResponse.error = error;
        return res
        .send(accountInfoResponse);
    });

});

router.post(routes.getRoute("settings/change"), (req: Request, res: Response) => {
    const datalessResponse: DatalessResponse = { error: undefined };
    const newSettings: any = req.body.newSettings;

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        const changePromises: Promise<null>[] = [];

        if (newSettings.username) {
            changePromises.push(settingsModel.changeAccountUsername(accountId, newSettings.username));
        }

        if (newSettings.email) {
            changePromises.push(settingsModel.changeAccountEmail(accountId, newSettings.email));
        }

        if (newSettings.password) {
            changePromises.push(settingsModel.changeAccountPassword(accountId, newSettings.password));
        }

        if (newSettings.steam || newSettings.steam === "") {
            changePromises.push(settingsModel.changeAccountSteam(accountId, newSettings.steam));
        }

        if (newSettings.discord || newSettings.discord === "") {
            changePromises.push(settingsModel.changeAccountDiscord(accountId, newSettings.discord));
        }

        if (newSettings.twitch || newSettings.twitch === "") {
            changePromises.push(settingsModel.changeAccountTwitch(accountId, newSettings.twitch));
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

router.post(routes.getRoute("settings/twitchId"), (req: Request, res: Response) => {
    const twitchIdResponse: TwitchIdResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.getTwitchId(accountId);
    })
    .then((response: number) => {
        twitchIdResponse.data = response;
        return res
        .send(twitchIdResponse);
    })
    .catch((error: string) => {
        twitchIdResponse.error = error;
        return res
        .send(twitchIdResponse);
    });

});

router.post(routes.getRoute("settings/twitchFollowers"), (req: Request, res: Response) => {
    const twitchFollowersResponse: TwitchFollowersResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.getTwitchFollows(accountId);
    })
    .then((follows: TwitchUser[]) => {
        twitchFollowersResponse.data = follows;
        return res
        .send(twitchFollowersResponse);
    })
    .catch((error: string) => {
        twitchFollowersResponse.error = error;
        return res
        .send(twitchFollowersResponse);
    });

});

router.post(routes.getRoute("settings/steamId"), (req: Request, res: Response) => {
    const steamIdResponse: SteamIdResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.getSteamId(accountId);
    })
    .then((steamId: number) => {
        steamIdResponse.data = steamId;
        return res
        .send(steamIdResponse);
    })
    .catch((error: string) => {
        steamIdResponse.error = error;
        return res
        .send(steamIdResponse);
    });

});

router.post(routes.getRoute("settings/discordLink"), (req: Request, res: Response) => {
    const discordLinkResponse: DiscordLinkResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.getDiscordLink(accountId);
    })
    .then((link: string) => {
        discordLinkResponse.data = link;
        return res
        .send(discordLinkResponse);
    })
    .catch((error: string) => {
        discordLinkResponse.error = error;
        return res
        .send(discordLinkResponse);
    });

});

router.post(routes.getRoute("settings/steamFriends"), (req: Request, res: Response) => {
    const steamFriendsResponse: SteamFriendsResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.getSteamId(accountId);
    })
    .then((response: number) => {
        const steamId: number = response;
        return accountModel.getSteamFriends(steamId);
    })
    .then((friends: SteamFriend[]) => {
        steamFriendsResponse.data = friends;
        return res
        .send(steamFriendsResponse);
    })
    .catch((error: string) => {
        steamFriendsResponse.error = error;
        return res
        .send(steamFriendsResponse);
    });

});

router.post(routes.getRoute("settings/image/change"), (req: Request, res: Response) => {
    const accountImageResponse: AccountImageResponse = { error: undefined };
    const imageBase64: string = Object.keys(req.body)[0].split(",")[1];

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return settingsModel.changeAccountImage(accountId, imageBase64);
    })
    .then((link: string) => {
        accountImageResponse.link = link;
        return res
        .send(accountImageResponse);
    })
    .catch((error: string) => {
        accountImageResponse.error = error;
        return res
        .send(accountImageResponse);
    });

});

router.post(routes.getRoute("email/resend"), (req: Request, res: Response) => {
    const datalessResponse: DatalessResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.resendAccountEmail(accountId);
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

router.post(routes.getRoute("email/verify"), (req: Request, res: Response) => {
    const verifyEmailResponse: EmailVerifiedFlagResponse = { error: undefined };
    const verificationCode: string = req.body.verificationCode;

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return accountModel.verifyAccountEmail(accountId, verificationCode);
    })
    .then((verificationSuccessful: boolean) => {
        verifyEmailResponse.data = verificationSuccessful;
        return res
        .send(verifyEmailResponse);
    })
    .catch((error: string) => {
        verifyEmailResponse.error = error;
        return res
        .send(verifyEmailResponse);
    });

});

router.post(routes.getRoute("email/recovery"), (req: Request, res: Response) => {
    const DatalessResponse: DatalessResponse = { error: undefined };
    const username: string = req.body.username;

    // check if username exists, send recovery
    accountModel.getAccountRecoveryInfoByUsername(username)
    .then((response: RecoveryEmailInfo) => {
        const email: string = response.email;
        const uid: string = response.uid;
        return sendRecoveryEmail(email, uid);
    })
    .then(() => {
        return res
        .send(DatalessResponse);
    })
    .catch((error: string) => {
        DatalessResponse.error = error;
        return res
        .send(DatalessResponse);
    });

});

router.post(routes.getRoute("email/recovery/verify"), (req: Request, res: Response) => {
    const emailRecoveryVerifyResponse: EmailRecoveryVerifyResponse = { error: undefined };
    const uid: string = req.body.uid;

    // verify recovery link is valid
    accountModel.verifyRecoveryExists(uid)
    .then((verifiedLink: boolean) => {
        emailRecoveryVerifyResponse.verifiedLink = verifiedLink;
        return res
        .send(emailRecoveryVerifyResponse);
    })
    .catch((error: string) => {
        emailRecoveryVerifyResponse.error = error;
        return res
        .send(emailRecoveryVerifyResponse);
    });

});

router.post(routes.getRoute("settings/image/delete"), (req: Request, res: Response) => {
    const accountImageResponse: AccountImageResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((accountId: number) => {
        return settingsModel.deleteAccountImage(accountId);
    })
    .then(() => {
        return res
        .send(accountImageResponse);
    })
    .catch((error: string) => {
        accountImageResponse.error = error;
        return res
        .send(accountImageResponse);
    });

});

router.post(routes.getRoute("recover/password"), (req: Request, res: Response) => {
    const DatalessResponse: DatalessResponse = { error: undefined };
    const password: string = req.body.password;
    const uid: string = req.body.uid;

    settingsModel.recoverAccountPassword(password, uid)
    .then((accountid: number) => {
        return settingsModel.resetAccountRecoveryId(accountid);
    })
    .then(() => {
        return res
        .send(DatalessResponse);
    })
    .catch((error: string) => {
        DatalessResponse.error = error;
        return res
        .send(DatalessResponse);
    });

});

router.post(routes.getRoute("delete"), (req: Request, res: Response) => {

    const datalessResponse: DatalessResponse = { error: undefined };

    // authorize
    securityModel.authorize(req.headers.cookie)
        .then((accountId: number) => {
            // delete account
            return accountModel.deleteAccountById(accountId);
        })
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

export default router;