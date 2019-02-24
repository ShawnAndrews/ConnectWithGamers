import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { settingsModel } from "./main";
import { AccountInfo, DbAccountImageResponse, DbAccountRecoveryResponse } from "../../../client/client-server-common/common";

describe("Settings model", function() {
    const testAccountId: number = 1003;

    it("gets account settings", function() {
        const AccountInfoPromise: Promise<AccountInfo> = settingsModel.getAccountInfo(testAccountId);

        return expect(AccountInfoPromise).to.eventually.be.fulfilled;
    });

    it("gets account recovery id", function() {
        const accountRecoveryIdPromise: Promise<string> = settingsModel.getAccountRecoveryId("Anonymous");

        return expect(accountRecoveryIdPromise).to.eventually.be.fulfilled;
    });

    it("changes account profile picture", function() {
        const testImageBase64: string = "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";
        const accountImageChangePromise: Promise<DbAccountImageResponse> = settingsModel.changeAccountImage(testAccountId, testImageBase64);

        return expect(accountImageChangePromise).to.eventually.be.fulfilled;
    });

    it("deletes account profile picture", function() {
        const accountImageDeletePromise: Promise<DbAccountImageResponse> = settingsModel.deleteAccountImage(testAccountId);

        return expect(accountImageDeletePromise).to.eventually.be.fulfilled;
    });

    it("changes account username", function() {
        const testNewAccountName: string = "Anonymous";
        const accountNameChangePromise: Promise<null> = settingsModel.changeAccountUsername(testAccountId, testNewAccountName);

        return expect(accountNameChangePromise).to.eventually.be.fulfilled;
    });

    it("changes account email address", function() {
        const testNewAccountEmail: string = "Anonymous@hotmail.com";
        const accountEmailChangePromise: Promise<null> = settingsModel.changeAccountEmail(testAccountId, testNewAccountEmail);

        return expect(accountEmailChangePromise).to.eventually.be.fulfilled;
    });

    it("changes account email address", function() {
        const testNewAccountEmail: string = "Anonymous@hotmail.com";
        const accountEmailChangePromise: Promise<null> = settingsModel.changeAccountEmail(testAccountId, testNewAccountEmail);

        return expect(accountEmailChangePromise).to.eventually.be.fulfilled;
    });

    it("changes account password", function() {
        const testNewAccountPassword: string = "123456";
        const accountPasswordChangePromise: Promise<null> = settingsModel.changeAccountPassword(testAccountId, testNewAccountPassword);

        return expect(accountPasswordChangePromise).to.eventually.be.fulfilled;
    });

    it("changes account discord link", function() {
        const testNewAccountDiscord: string = "https://discord.gg/NsLKPn";
        const accountDiscordChangePromise: Promise<null> = settingsModel.changeAccountDiscord(testAccountId, testNewAccountDiscord);

        return expect(accountDiscordChangePromise).to.eventually.be.fulfilled;
    });

    it("changes account twitch link", function() {
        const testNewAccountTwitch: string = "https://www.twitch.tv/canadianshawn";
        const accountTwitchChangePromise: Promise<null> = settingsModel.changeAccountDiscord(testAccountId, testNewAccountTwitch);

        return expect(accountTwitchChangePromise).to.eventually.be.fulfilled;
    });

    it("changes account steam link", function() {
        const testNewAccountSteam: string = "https://steamcommunity.com/id/canadianshawn";
        const accountSteamChangePromise: Promise<null> = settingsModel.changeAccountDiscord(testAccountId, testNewAccountSteam);

        return expect(accountSteamChangePromise).to.eventually.be.fulfilled;
    });

    it("recovers account password", function() {
        const testNewAccountPassword: string = Math.floor(100000000 + Math.random() * 900000000).toString();
        const testAccountRecoveryUid: string = "gFuyXUs_UxLT3v1723OOg9Xlcih01Tn";
        const accountRecoveryPasswordPromise: Promise<DbAccountRecoveryResponse> = settingsModel.recoverAccountPassword(testNewAccountPassword, testAccountRecoveryUid);

        return expect(accountRecoveryPasswordPromise).to.eventually.be.fulfilled;
    });

    it("sets account recovery uid", function() {
        const accountSetRecoveryUidPromise: Promise<null> = settingsModel.resetAccountRecoveryId(testAccountId);

        return expect(accountSetRecoveryUidPromise).to.eventually.be.fulfilled;
    });

});