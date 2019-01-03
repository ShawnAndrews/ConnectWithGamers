import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { accountModel } from "./main";
import { GenericModelResponse, DbAccountImageResponse, RecoveryEmailInfo, AccountsInfo, DbAccountInfoResponse, DbTwitchIdResponse, DbTwitchFollowsResponse, DbSteamIdResponse, DbSteamFriendsResponse, DbDiscordLinkResponse, DbVerifyEmailResponse } from "../../../client/client-server-common/common";

describe("Database model", function() {
    const accountUsername: string = "Tester";
    let accountId: number;

    it("creates account", function() {
        const accountEmail: string = "testaddress@hotmail.com";
        const accountPassword: string = "123456";
        const accountTwitch: string = "canadianshawn";
        const accountSteam: string = "canadianshawn";
        const accountDiscord: string = "https://discord.gg/NsMCPr";

        const createAccountPromise: Promise<number> = accountModel.createAccount(accountUsername, accountEmail, accountPassword, accountTwitch, accountSteam, accountDiscord);

        return createAccountPromise
            .then((response: number) => {
                expect(response).is.not.undefined;
                accountId = response;
            });
    });

    it("gets account id from username", function() {
        expect(accountId).is.not.undefined;
        const createAccountPromise: Promise<GenericModelResponse> = accountModel.getAccountId(accountUsername);

        return expect(createAccountPromise).to.eventually.be.fulfilled;
    });

    it("gets account username from id", function() {
        expect(accountId).is.not.undefined;
        const createAccountPromise: Promise<GenericModelResponse> = accountModel.getAccountUsername(accountId);

        return expect(createAccountPromise).to.eventually.be.fulfilled;
    });

    it("gets account profile picture", function() {
        expect(accountId).is.not.undefined;
        const getAccountProfilePicturePromise: Promise<DbAccountImageResponse> = accountModel.getAccountImage(accountId);

        return expect(getAccountProfilePicturePromise).to.eventually.be.fulfilled;
    });

    it("gets account recovery info", function() {
        expect(accountId).is.not.undefined;
        const getAccountRecoveryInfoPromise: Promise<RecoveryEmailInfo> = accountModel.getAccountRecoveryInfoByUsername(accountUsername);

        return expect(getAccountRecoveryInfoPromise).to.eventually.be.fulfilled;
    });

    it("verifies account recovery link", function() {
        expect(accountId).is.not.undefined;
        const accountRecoveryUid: string = "foo";
        const getAccountRecoveryInfoPromise: Promise<boolean> = accountModel.verifyRecoveryExists(accountRecoveryUid);

        return expect(getAccountRecoveryInfoPromise).to.eventually.be.fulfilled;
    });

    it("gets public accounts info by username filter", function() {
        expect(accountId).is.not.undefined;
        const usernameFilter: string = "anon";
        const getAccountsInfoPromise: Promise<AccountsInfo> = accountModel.getAccountsByUsernameFilter(usernameFilter);

        return expect(getAccountsInfoPromise).to.eventually.be.fulfilled;
    });

    it("gets public accounts info by username filter", function() {
        expect(accountId).is.not.undefined;
        const usernameFilter: string = "anon";
        const getAccountsInfoPromise: Promise<AccountsInfo> = accountModel.getAccountsByUsernameFilter(usernameFilter);

        return expect(getAccountsInfoPromise).to.eventually.be.fulfilled;
    });

    it("gets multiple public accounts info by ids", function() {
        expect(accountId).is.not.undefined;
        const getAccountsInfoPromise: Promise<AccountsInfo> = accountModel.getAccountsInfoById([accountId]);

        return expect(getAccountsInfoPromise).to.eventually.be.fulfilled;
    });

    it("gets account info by id", function() {
        expect(accountId).is.not.undefined;
        const getAccountInfoPromise: Promise<DbAccountInfoResponse> = accountModel.getAccountInfo(accountId);

        return expect(getAccountInfoPromise).to.eventually.be.fulfilled;
    });

    it("gets account twitch link", function() {
        expect(accountId).is.not.undefined;
        const getTwitchLinkPromise: Promise<number> = accountModel.getTwitchId(accountId);

        return expect(getTwitchLinkPromise).to.eventually.be.fulfilled;
    });

    it("gets account's twitch active live streams", function() {
        expect(accountId).is.not.undefined;
        const getTwitchFollowsPromise: Promise<DbTwitchFollowsResponse> = accountModel.getTwitchFollows(accountId);

        return expect(getTwitchFollowsPromise).to.eventually.be.fulfilled;
    });

    it("gets account steam link", function() {
        expect(accountId).is.not.undefined;
        const getSteamLinkPromise: Promise<DbSteamIdResponse> = accountModel.getSteamId(accountId);

        return expect(getSteamLinkPromise).to.eventually.be.fulfilled;
    });

    it("gets account steam friends", function() {
        expect(accountId).is.not.undefined;
        const steamId: number = 76561198044131862;
        const getSteamFriendsPromise: Promise<DbSteamFriendsResponse> = accountModel.getSteamFriends(steamId);

        return expect(getSteamFriendsPromise).to.eventually.be.fulfilled;
    });

    it("gets account discord link", function() {
        expect(accountId).is.not.undefined;
        const getDiscordLinkPromise: Promise<DbDiscordLinkResponse> = accountModel.getDiscordLink(accountId);

        return expect(getDiscordLinkPromise).to.eventually.be.fulfilled;
    });

    it("sends account verification email", function() {
        expect(accountId).is.not.undefined;
        const sendVerificationEmailPromise: Promise<null> = accountModel.resendAccountEmail(accountId);

        return expect(sendVerificationEmailPromise).to.eventually.be.fulfilled;
    });

    it("verifies account email verification code", function() {
        expect(accountId).is.not.undefined;
        const accountVerificationCode: string = "65rLnAgDnqE6A2G";
        const verifyAccountVerificationCodePromise: Promise<DbVerifyEmailResponse> = accountModel.verifyAccountEmail(accountId, accountVerificationCode);

        return expect(verifyAccountVerificationCodePromise).to.eventually.be.fulfilled;
    });

    it("deletes account", function() {
        const deleteAccountPromise: Promise<void> = accountModel.deleteAccountById(accountId);

        return expect(deleteAccountPromise).to.eventually.be.fulfilled;
    });

});