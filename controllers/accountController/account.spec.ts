import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { routes } from "./account";
import { validateCredentials, Authentication, DbAccountRecoveryResponse, TokenInfo, AUTH_TOKEN_NAME, number, RecoveryEmailInfo, DbSteamIdResponse, DbDiscordLinkResponse, AccountInfo } from "../../client/client-server-common/common";
import { accountModel } from "../../models/db/account/main";
import { securityModel } from "../../models/db/security/main";
import { settingsModel } from "../../models/db/settings/main";
import { sendRecoveryEmail } from "../../util/nodemailer";

describe("Account Routes", function() {
    const accountRouterPrefix: string = `/account`;
    const signupData = {
        accountid: -1,
        username: "Tester",
        password: "123456",
        email: "tester@hotmail.com",
        recoveryuid: ""
    };
    let loginCookie: string;

    it(accountRouterPrefix.concat(routes.getRoute("signup")), function() {

        // validate
        const error: string = validateCredentials(signupData.username, signupData.password, signupData.email);
        expect(error).is.undefined;

        // create account in db
        return accountModel.createAccount(signupData.username, signupData.email, signupData.password)
        .then((response: number) => {
            signupData.accountid = response;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("login")), function() {

        // validate
        const error: string = validateCredentials(signupData.username, signupData.password, signupData.email);
        expect(error).is.undefined;

        // authenticate
        return securityModel.authenticate(signupData.username, signupData.password, false)
        .then((response: Authentication) => {
            // authentication success
            return securityModel.token(response.username, response.remember);
        })
        .then((response: TokenInfo) => {
            // token success
            loginCookie = ` ${AUTH_TOKEN_NAME}=${response.token}`;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/change")), function() {
        const changePromises: Promise<null>[] = [];
        signupData.username = signupData.username.concat("2");
        signupData.email = ("2").concat(signupData.email);
        signupData.password = signupData.password.concat("2");
        const newSettings: any = {
            username: signupData.username,
            email: signupData.email,
            password: signupData.password,
            steam: "canadianshawn",
            discord: "https://discord.gg/Acvmnn",
            twitch: "canadianshawn"
        };

        changePromises.push(settingsModel.changeAccountUsername(signupData.accountid, newSettings.username));
        changePromises.push(settingsModel.changeAccountEmail(signupData.accountid, newSettings.email));
        changePromises.push(settingsModel.changeAccountPassword(signupData.accountid, newSettings.password));
        changePromises.push(settingsModel.changeAccountSteam(signupData.accountid, newSettings.steam));
        changePromises.push(settingsModel.changeAccountDiscord(signupData.accountid, newSettings.discord));
        changePromises.push(settingsModel.changeAccountTwitch(signupData.accountid, newSettings.twitch));

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(Promise.all(changePromises)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(settingsModel.getAccountInfo(response.accountid)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/twitchId")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.getTwitchId(response.accountid)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/twitchFollowers")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.getTwitchFollows(response.accountid)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/steamId")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.getSteamId(response.accountid)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/discordLink")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.getDiscordLink(response.accountid)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/steamFriends")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return accountModel.getSteamId(response.accountid);
        })
        .then((response: DbSteamIdResponse) => {
            const steamId: number = response.steamId;
            return expect(accountModel.getSteamFriends(steamId)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/image/change")), function() {
        const testImageBase64: string = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABfmlDQ1BJQ0MgUHJvZmlsZQAAKJGlkLFLAlEcx79qYdiFQxENDTdIQyiIDTWWDUKIiBlktZznqcGpx91JRGNDq4NLRUsW/Qe1Rf9AEATVFETNDQURhFzf5wlC6NQ73vt9+L7f9917X8Db0NWKNRQFKlXbzCTi8npuQ/a/IIBJSIhiXlEtYymdTmLg+HqAR9T7iDhrcF/fMVrQLBXwjJAXVMO0yYvk1I5tCG6QJ9SyUiCfkcMmL0i+E3re5TfBJZe/BZvZzDLglchyyeWw4LzL4i2yWjYrZJ0cquh1tXsf8RJJq66tsk53poUMEohDRh51bEOHjQhrlZn198U6vhRq9KhcDezCpKOEMr1hqnWeqrEWqWv8dHZwiOz/ZmoV52LuH6QVYPjVcT5nAf8x0D5wnJ9Tx2m3AN8TcNPs+WtNxvlOvdHTQidAcB+4vO5p+XPgihlPPRuKqXQkH6e3WAQ+LoCxHDDOrAOb/9138+7uo/UIZPeA5C1weATMsD+49QuWonTmLfeghwAABLNJREFUSMeVVlkotVsYxjGEZEyGTBkzz1HGFEqGGxkTSVzJeIELuVHIhemXKWQqQjIL+ZE5U2SMzNOFeTrHcc7Tfmv3nc/+9t7nvditvdb7Pc87ryUhKSkpIUj+4ImEGCIlJSVMUyABvqGFqqqqq6trZGRkVlZWUVHRr1+/6urqKioqCgoKEhMTvby8tLS0RPD/JCD0gICA3t7e6+vrf4TK/f39+Ph4XFwcp7msLULPzc3lQ3x/f399ff31Q7CJI75ae3s7AiWCgNDNzc3/5snn5yeAsGACMQVHUPiTJ/gbEhJCyeMkkJaWxm9GRgYQ8SUTC/ayoJmsXzxpbm4WQUBnHR0dBLGxsTE7O7uzs8MHZS2g0N/fDx3yYG1tjV8dAghogd+tra2rqyukwdvbW1FRUU1NzcXFZWhoiPJB6AsLC56enioqKjIyMk5OTqmpqXt7ew8PD9hh55VFoKysfHt7C7jz8/Ozs7OcnBx7e3tjY2OcNjQ0kOGDg4PA1dbWtrGxIWh8AldeX19NTU2ZVf4fAto1MDB4eXlhhntxcdHPz8/CwiIvL4920AcODg5ubm4DAwOsPGFfBIGlpSX0+FEmubm5sbKympqaoihtb2/7+Pjs7u7SX35iIO7u7uw8swhgAn3Q0tISHByMQMfExACxsbERsaIjBHBzc/Pg4CA2NhZ++Pr6lpeX05G/v78IAmdn5/f3d4wBVi2kp6fr6upeXl4S0PT0NEsBdszNzcEzTgLahckXFxcom5SUlPz8/OLi4qqqqs7Ozq6uLjk5uf39fYo1sopBgmyPjY0hdPPz86grZAsOceaACOzs7KioWUImHx0dMfvgpwQFBXF6QGs088rKClQRKDBhWry9veEXQxQKp6enRMCcTtTGZJaHh4cwAhyAICws7KdpycnJUEBkmJXDHIjUfWhMSZ5wTlMlJaWkpCTAIdzoIIwBlFBNTQ24NTQ0MJwB9Pj42N3d/fHxgY7BDtBh/sTEBJnPnhY/Z1F2djY6S11dHTcM+hN26ejohIaGWltbA4iiMTo6urS0dHh4WFtbm5mZaWtri7kSEREBNGHDjsjRtG1tbYGBgeHh4RQBWFddXY0aZ4bl+fmZFjA8ISEBrYASF+EB34nKykp8oK+vjwamMbe+vo6GWl1dnZmZQcIJGtMNdwDcBT30ZWVlxb3RUKyIPq5iahxNTU1ECQtcwmDFIioqKjo6WkFBwcTEBD1YUlKCvwIuA4G3KCnV19cXFhbGx8ejlTAzkGHc78gHEk5qGONpaWmYGYBGG6L8BFwGAgmwA1VYjarHeEBLIxQoGNTo8vLyb56gxlBFiFJfX9/IyAj6X7D5XM8WUoXvPT09eLnA8MnJyeHhYYwEFM/T0xPl4OTkBLYjPpzoXAT0AfzAtEHVopNhL0qTjkCDZsYOxhG8wR0FTS4cTgIKKKYeDD8+Poa9d3d3mHcoYjIffuDVJGA+i0nA/wyjm+YPChHKyC0ubZp3GLQi0IUT8B8yra2tgCstLYWyvLw8xjK9IVCmgh9b4hNI8QRWo6LwDMCOoaEh0PEeMDMzE9C3/5eAD2FkZFRWVgaHHB0dm5qa9PT0xEIXh0DkC1y4/Au+9hzs+TG6JQAAAABJRU5ErkJggg==";

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(settingsModel.changeAccountImage(signupData.accountid, testImageBase64)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("email/resend")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.resendAccountEmail(signupData.accountid)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("email/verify")), function() {
        const verificationCode: string = "foo";

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.verifyAccountEmail(response.accountid, verificationCode)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("email/recovery")), function() {

        return accountModel.getAccountRecoveryInfoByUsername(signupData.username)
        .then((response: RecoveryEmailInfo) => {
            const email: string = response.email;
            const uid: string = response.uid;
            signupData.recoveryuid = uid;
            return expect(sendRecoveryEmail(email, uid)).to.eventually.be.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("email/recovery/verify")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.verifyRecoveryExists(signupData.recoveryuid)).is.eventually.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("settings/image/delete")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(settingsModel.deleteAccountImage(response.accountid)).is.eventually.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("recover/password")), function() {
        const newPassword: string = "123456";

        return settingsModel.getAccountRecoveryId(signupData.username)
        .then((response: string) => {
            signupData.recoveryuid = response;
            return settingsModel.recoverAccountPassword(newPassword, signupData.recoveryuid);
        })
        .then((response: DbAccountRecoveryResponse) => {
            return expect(settingsModel.resetAccountRecoveryId(response.accountid)).is.eventually.fulfilled;
        });

    });

    it(accountRouterPrefix.concat(routes.getRoute("delete")), function() {

        return securityModel.authorize(loginCookie)
        .then((response: number) => {
            return expect(accountModel.deleteAccountById(response.accountid)).is.eventually.fulfilled;
        });

    });

});