import config from "../../../config";
import { genRandStr } from "../../../util/main";
import DatabaseBase from "../base/dbBase";
import { EMAIL_VERIFICATION_LEN, SALT_RNDS, ACCOUNT_RECOVERYID_LEN } from "../account/main";
import {
    validateUsername, validateEmail, validateURL, validatePassword,
    GenericResponseModel, DbAccountSettingsResponse, DbAccountImageResponse, DbAccountRecoveryResponse } from "../../../client/client-server-common/common";
import axios from "axios";
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
                "accounts",
                ["username", "email", "discord", "steam", "twitch", "image", "emailVerification"],
                `accountid=?`,
                [accountid])
                .then((dbResponse: GenericResponseModel) => {
                    const username = dbResponse.data[0].username;
                    const email = dbResponse.data[0].email;
                    const discord = dbResponse.data[0].discord || "";
                    const steam = dbResponse.data[0].steam || "";
                    const twitch = dbResponse.data[0].twitch || "";
                    const image = dbResponse.data[0].image;
                    const emailVerified = dbResponse.data[0].emailVerification === null;
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
                        "accounts",
                        "image=?",
                        [link],
                        "accountid=?",
                        [accountid])
                        .then((dbResponse: GenericResponseModel) => {
                            if (dbResponse.data.affectedRows == 1) {
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
                "accounts",
                "image=?",
                [undefined],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.affectedRows == 1) {
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
                "accounts",
                "username=?",
                [newUsername],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.affectedRows == 1) {
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
                "accounts",
                "email=?,emailVerification=?",
                [newEmail, emailVerification],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.affectedRows == 1) {
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
                "accounts",
                "passwordHash=?,salt=?",
                [hash, salt],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.affectedRows == 1) {
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

            if (newDiscord !== "") {
                const discordValidationError: string = validateURL(newDiscord);
                if (discordValidationError) {
                    return reject(discordValidationError);
                }
            }

            this.update(
                "accounts",
                "discord=?",
                [newDiscord === "" ? undefined : newDiscord],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.affectedRows == 1) {
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

        const updatePromise = (): Promise<null> => {
            return new Promise( (resolve, reject) => {
                this.update(
                    "accounts",
                    "twitch=?",
                    [newTwitch === "" ? undefined : newTwitch],
                    "accountid=?",
                    [accountid])
                    .then((dbResponse: GenericResponseModel) => {
                        if (dbResponse.data.affectedRows == 1) {
                            return resolve();
                        } else {
                            return reject("Database error.");
                        }
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
            });
        };

        return new Promise( (resolve, reject) => {

            if (newTwitch === "") {
                return updatePromise()
                    .then(() => {
                        return resolve();
                    })
                    .catch((err: string) => {
                        return reject(err);
                    });
            }

            axios
            .get(`https://api.twitch.tv/helix/users?login=${newTwitch}`,
            {
                headers: {
                    "Client-ID": config.twitch.clientId,
                    "Accept": "application/vnd.twitchtv.v5+json"
                }
            })
            .then((result: any) => {
                if (result.data.data.length > 0) {
                    return updatePromise()
                        .then(() => {
                            return resolve();
                        })
                        .catch((err: string) => {
                            return reject(err);
                        });
                } else {
                    return reject("Twitch username does not exist.");
                }
            })
            .catch((err: string) => {
                return reject(err);
            });

        });
    }

    /**
     * Change the account's Steam link.
     */
    changeAccountSteam(accountid: number, newSteam: string): Promise<null> {

        const updatePromise = (): Promise<null> => {
            return new Promise( (resolve, reject) => {
                this.update(
                    "accounts",
                    "steam=?",
                    [newSteam === "" ? undefined : newSteam],
                    "accountid=?",
                    [accountid])
                    .then((dbResponse: GenericResponseModel) => {
                        if (dbResponse.data.affectedRows == 1) {
                            return resolve();
                        } else {
                            return reject(`Database error.`);
                        }
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
           });
        };

        return new Promise( (resolve, reject) => {

            if (newSteam === "") {
                return updatePromise()
                    .then(() => {
                        return resolve();
                    })
                    .catch((err: string) => {
                        return reject(err);
                    });
            }

            axios
            .get(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1?key=${config.steam.key}&vanityurl=${newSteam}`)
            .then((result: any) => {
                if (result.data.response.steamid) {
                    return updatePromise()
                        .then(() => {
                            return resolve();
                        })
                        .catch((err: string) => {
                            return reject(err);
                        });
                } else {
                    return reject("Steam username does not exist.");
                }
            })
            .catch((err: string) => {
                return reject(err);
            });

        });
    }

    /**
     * Change the account's password via account recovery.
     */
    recoverAccountPassword(newPassword: string, uid: string): Promise<DbAccountRecoveryResponse> {

        return new Promise( (resolve, reject) => {

            const passwordValidationError: string = validatePassword(newPassword);
            if (passwordValidationError) {
                return reject(passwordValidationError);
            }

            this.select(
                "accounts",
                ["accountid"],
                "recoveryid=?",
                [uid])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.length > 0) {
                        const accountid: number = dbResponse.data[0].accountid;
                        this.changeAccountPassword(accountid, newPassword)
                        .then(() => {
                            const dbAccountRecoveryResponse: DbAccountRecoveryResponse = { accountid: accountid };
                            return resolve(dbAccountRecoveryResponse);
                        });
                    } else {
                        return reject(`Incorrect recovery id.`);
                    }
                })
                .catch((error: string) => {
                    return reject(`Internal error recovering password.`);
                });

        });
    }

    /**
     * Set a new recovery id for account.
     */
    resetAccountRecoveryId(accountid: number): Promise<null> {

        return new Promise( (resolve, reject) => {

            this.update(
                "accounts",
                "recoveryid=?",
                [genRandStr(ACCOUNT_RECOVERYID_LEN)],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.affectedRows == 1) {
                        return resolve();
                    } else {
                        return reject(`Database error finding accountid in db.`);
                    }
                })
                .catch((error: any) => {
                    return reject(`Database error reseting account recovery id.`);
                });

        });
    }

}

export const settingsModel: SettingsModel = new SettingsModel();