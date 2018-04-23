import config from "../../../config";
import { genRandStr } from "../../../util/main";
import DatabaseBase from "../base/dbBase";
import { EMAIL_VERIFICATION_LEN, SALT_RNDS } from "../account/main";
import {
    validateUsername, validateEmail, validateURL, validatePassword,
    GenericResponseModel, DbAccountSettingsResponse, DbAccountImageResponse } from "../../../client/client-server-common/common";
const bcrypt = require("bcrypt");
const imgur = require("imgur");

imgur.setClientId(config.imgur.clientId);

class SettingsModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Get necessary information displayed on Account Settings screen.
     */
    getAccountSettings(accountid: number): Promise<DbAccountSettingsResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["username", "email", "discord", "steam", "twitch", "image", "emailVerification"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    const username = dbResponse.data.recordsets[0][0].username;
                    const email = dbResponse.data.recordsets[0][0].email;
                    const discord = dbResponse.data.recordsets[0][0].discord || "";
                    const steam = dbResponse.data.recordsets[0][0].steam || "";
                    const twitch = dbResponse.data.recordsets[0][0].twitch || "";
                    const image = dbResponse.data.recordsets[0][0].image;
                    const emailVerified = dbResponse.data.recordsets[0][0].emailVerification === null;
                    const dbAccountSettingsResponse: DbAccountSettingsResponse = {
                        username: username,
                        email: email,
                        discord: discord,
                        steam: steam,
                        twitch: twitch,
                        image: image,
                        emailVerified: emailVerified};
                    return resolve(dbAccountSettingsResponse);
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

    /**
     * Change the account profile picture given a base64 encoded string.
     */
    changeAccountImage(accountid: number, imageBase64: string): Promise<DbAccountImageResponse> {
        return new Promise( (resolve, reject) => {
            imgur.uploadBase64(imageBase64)
                .then((response: any) => {
                    const link: string = response.data.link;
                    this.update(
                        "dbo.accounts",
                        ["accountid", "image"],
                        [this.sql.Int, this.sql.VarChar],
                        [accountid, link],
                        ["image"],
                        "accountid=@accountid")
                        .then((dbResponse: GenericResponseModel) => {
                            if (dbResponse.data.rowsAffected[0] == 1) {
                                const dbAccountImageResponse: DbAccountImageResponse = { link: link };
                                return resolve(dbAccountImageResponse);
                            } else {
                                return reject(`Database error.`);
                            }
                        })
                        .catch((error: any) => {
                            return reject(`Database error.`);
                        });
                })
                .catch((error: string) => {
                    return reject(`Error changing account image. ${error}`);
                });

        });
    }

    /**
     * Delete the current account's profile picture, if assigned.
     */
    deleteAccountImage(accountid: number): Promise<DbAccountImageResponse> {
        return new Promise( (resolve, reject) => {
            this.update(
                "dbo.accounts",
                ["accountid", "image"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, undefined],
                ["image"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        const dbAccountImageResponse: DbAccountImageResponse = { link: undefined };
                        return resolve(dbAccountImageResponse);
                    } else {
                        return reject(`Database error.`);
                    }
                })
                .catch((error: any) => {
                    return reject(`Database error.`);
                });
        });
    }

    /**
     * Change the account's username.
     */
    changeAccountUsername(accountid: number, newUsername: string): Promise<null> {

        return new Promise( (resolve, reject) => {

            const usernameValidationError: string = validateUsername(newUsername);
            if (usernameValidationError) {
                return reject(usernameValidationError);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "username"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newUsername],
                ["username"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve();
                    } else {
                        return reject(`Username is already taken.`);
                    }
                })
                .catch((error: any) => {
                    return reject(`Username is already taken.`);
                });

        });
    }

    /**
     * Change the account's email address.
     */
    changeAccountEmail(accountid: number, newEmail: string): Promise<null> {

        const emailVerification = genRandStr(EMAIL_VERIFICATION_LEN);

        return new Promise( (resolve, reject) => {

            const emailValidationError: string = validateEmail(newEmail);
            if (emailValidationError) {
                return reject(emailValidationError);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "email", "emailVerification"],
                [this.sql.Int, this.sql.VarChar, this.sql.VarChar],
                [accountid, newEmail, emailVerification],
                ["email", "emailVerification"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve();
                    } else {
                        return reject(`Email is already taken.`);
                    }
                })
                .catch((error: string) => {
                    return reject(`Email is already taken.`);
                });

        });
    }

    /**
     * Change the account's password.
     */
    changeAccountPassword(accountid: number, newPassword: string): Promise<null> {

        return new Promise( (resolve, reject) => {

            const passwordValidationError: string = validatePassword(newPassword);
            if (passwordValidationError) {
                return reject(passwordValidationError);
            }

            const salt = bcrypt.genSaltSync(SALT_RNDS);
            const hash = bcrypt.hashSync(newPassword, salt);

            this.update(
                "dbo.accounts",
                ["accountid", "passwordHash", "salt"],
                [this.sql.Int, this.sql.VarChar, this.sql.VarChar],
                [accountid, hash, salt],
                ["passwordHash", "salt"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve();
                    } else {
                        return reject(`Database error already taken.`);
                    }
                })
                .catch((error: string) => {
                    return reject(`Internal error changing password.`);
                });

        });
    }

    /**
     * Change the account's Discord link.
     */
    changeAccountDiscord(accountid: number, newDiscord: string): Promise<null> {

        return new Promise( (resolve, reject) => {

            const discordValidationError: string = validateURL(newDiscord);
            if (discordValidationError) {
                return reject(discordValidationError);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "discord"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newDiscord],
                ["discord"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve();
                    } else {
                        return reject(`Database error.`);
                    }
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

    /**
     * Change the account's Steam link.
     */
    changeAccountSteam(accountid: number, newSteam: string): Promise<null> {

        return new Promise( (resolve, reject) => {

            const discordValidationError: string = validateURL(newSteam);
            if (discordValidationError) {
                return reject(discordValidationError);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "steam"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newSteam],
                ["steam"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve();
                    } else {
                        return reject(`Database error.`);
                    }
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

    /**
     * Change the account's Twitch link.
     */
    changeAccountTwitch(accountid: number, newTwitch: string): Promise<null> {

        return new Promise( (resolve, reject) => {

            const discordValidationError: string = validateURL(newTwitch);
            if (discordValidationError) {
                return reject(discordValidationError);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "twitch"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newTwitch],
                ["twitch"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve();
                    } else {
                        return reject(`Database error.`);
                    }
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

}

export const settingsModel: SettingsModel = new SettingsModel();