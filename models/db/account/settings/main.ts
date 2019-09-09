import config from "../../../../config";
import { genRandStr } from "../../../../util/main";
import DatabaseBase from "../../base/dbBase";
import {
    validateUsername, validateEmail, validateURL, validatePassword,
    GenericModelResponse, AccountInfo, DbTables, DbTableAccountsFields,
    EMAIL_VERIFICATION_LEN, SALT_RNDS, ACCOUNT_RECOVERYID_LEN } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { securityModel, SecurityCacheEnum } from "../../security/main";
const bcrypt = require("bcryptjs");

class SettingsModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Get necessary information displayed on Account Settings screen.
     */
    getAccountInfo(accountid: number): Promise<AccountInfo> {

        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const accountId = dbResponse.data[0].accounts_sys_key_id;
                    const accountType = dbResponse.data[0].accounts_type_enum_sys_key_id;
                    const profile = dbResponse.data[0].profile;
                    const profileFileExtension = dbResponse.data[0].profile_file_extension;
                    const username = dbResponse.data[0].username;
                    const email = dbResponse.data[0].email;
                    const discord = dbResponse.data[0].discord || "";
                    const steam = dbResponse.data[0].steam || "";
                    const twitch = dbResponse.data[0].twitch || "";
                    const emailVerified = dbResponse.data[0].email_verification_code === null;
                    const accountInfo: AccountInfo = {
                        accountid: accountId,
                        profile: profile,
                        profile_file_extension: profileFileExtension,
                        username: username,
                        email: email,
                        discord: discord,
                        steam: steam,
                        twitch: twitch,
                        emailVerified: emailVerified};
                    return resolve(accountInfo);
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

    /**
     * Get account recovery uid.
     */
    getAccountRecoveryId(username: string): Promise<string> {

        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[2]}=?`,
                [username])
                .then((dbResponse: GenericModelResponse) => {
                    const recoveryid: string = dbResponse.data[0].recovery_verification_code;
                    return resolve(recoveryid);
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

    /**
     * Change the account profile picture given a base64 encoded string.
     */
    changeAccountImage(accountid: number, imageBase64: string, fileExtension: string): Promise<void> {
        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const oldFileExtension: string = dbResponse.data[0].profile_file_extension;

                    securityModel.deleteImage(SecurityCacheEnum.profile, oldFileExtension, accountid.toString())
                    .then(() => {

                        securityModel.uploadImage(imageBase64, SecurityCacheEnum.profile, fileExtension, accountid.toString())
                        .then(() => {

                            this.update(
                                DbTables.accounts,
                                `${DbTableAccountsFields[12]}=?, ${DbTableAccountsFields[13]}=?`,
                                [true, fileExtension],
                                `${DbTableAccountsFields[0]}=?`,
                                [accountid])
                                .then((dbResponse: GenericModelResponse) => {
                                    if (dbResponse.data.affectedRows == 1) {
                                        return resolve();
                                    } else {
                                        return reject(`Database error.`);
                                    }
                                })
                                .catch((error: string) => {
                                    return reject(`Database error.`);
                                });
                        })
                        .catch((err: string) => {
                            return reject(`Error changing account image. ${err}`);
                        });
                    })
                    .catch((err: string) => {
                        return reject(`Error deleting old account image. ${err}`);
                    });
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

    /**
     * Delete the current account's profile picture, if assigned.
     */
    deleteAccountImage(accountid: number): Promise<void> {
        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const profileFileExtension: string = dbResponse.data[0].profile_file_extension;

                    securityModel.deleteImage(SecurityCacheEnum.profile, profileFileExtension, accountid.toString())
                        .then(() => {

                            this.update(
                                DbTables.accounts,
                                `${DbTableAccountsFields[12]}=?, ${DbTableAccountsFields[13]}=?`,
                                [false, undefined],
                                `${DbTableAccountsFields[0]}=?`,
                                [accountid])
                                .then((dbResponse: GenericModelResponse) => {
                                    if (dbResponse.data.affectedRows == 1) {
                                        return resolve();
                                    } else {
                                        return reject(`Database error.`);
                                    }
                                })
                                .catch((error: string) => {
                                    return reject(`Database error.`);
                                });
                        })
                        .catch((err: string) => {
                            return reject(`Database error.`);
                        });
                })
                .catch((err: string) => {
                    return reject(`Database error.`);
                });
        });
    }

    /**
     * Change the account's username.
     */
    changeAccountUsername(accountid: number, newUsername: string): Promise < null > {

        return new Promise( (resolve, reject) => {

            const usernameValidationError: string = validateUsername(newUsername);
            if (usernameValidationError) {
                return reject(usernameValidationError);
            }

            this.update(
                DbTables.accounts,
                `${DbTableAccountsFields[2]}=?`,
                [newUsername],
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.affectedRows == 1) {
                        return resolve();
                    } else {
                        return reject(`Username is already taken.`);
                    }
                })
                .catch((error: string) => {
                    return reject(`Username is already taken.`);
                });

        });
    }

    /**
     * Change the account's email address.
     */
    changeAccountEmail(accountid: number, newEmail: string): Promise < null > {

        const emailVerification = genRandStr(EMAIL_VERIFICATION_LEN);

        return new Promise( (resolve, reject) => {

            const emailValidationError: string = validateEmail(newEmail);
            if (emailValidationError) {
                return reject(emailValidationError);
            }

            this.update(
                DbTables.accounts,
                `${DbTableAccountsFields[3]}=?,${DbTableAccountsFields[10]}=?`,
                [newEmail, emailVerification],
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
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
    changeAccountPassword(accountid: number, newPassword: string): Promise < null > {

        return new Promise( (resolve, reject) => {

            const passwordValidationError: string = validatePassword(newPassword);
            if (passwordValidationError) {
                return reject(passwordValidationError);
            }

            const salt = bcrypt.genSaltSync(SALT_RNDS);
            const hash = bcrypt.hashSync(newPassword, salt);

            this.update(
                DbTables.accounts,
                `${DbTableAccountsFields[4]}=?,${DbTableAccountsFields[5]}=?`,
                [hash, salt],
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
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
    changeAccountDiscord(accountid: number, newDiscord: string): Promise < null > {

        return new Promise( (resolve, reject) => {

            if (newDiscord !== "") {
                const discordValidationError: string = validateURL(newDiscord);
                if (discordValidationError) {
                    return reject(discordValidationError);
                }
            }

            this.update(
                DbTables.accounts,
                `${DbTableAccountsFields[7]}=?`,
                [newDiscord === "" ? undefined : newDiscord],
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
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
    changeAccountTwitch(accountid: number, newTwitch: string): Promise < null > {

        const updatePromise = (): Promise<null> => {
            return new Promise( (resolve, reject) => {
                this.update(
                    DbTables.accounts,
                    `${DbTableAccountsFields[9]}=?`,
                    [newTwitch === "" ? undefined : newTwitch],
                    `${DbTableAccountsFields[0]}=?`,
                    [accountid])
                    .then((dbResponse: GenericModelResponse) => {
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
            .then((result: AxiosResponse) => {
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
    changeAccountSteam(accountid: number, newSteam: string): Promise < null > {

        const updatePromise = (): Promise<null> => {
            return new Promise( (resolve, reject) => {
                this.update(
                    DbTables.accounts,
                    `${DbTableAccountsFields[8]}=?`,
                    [newSteam === "" ? undefined : newSteam],
                    `${DbTableAccountsFields[0]}=?`,
                    [accountid])
                    .then((dbResponse: GenericModelResponse) => {
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
            .then((result: AxiosResponse) => {
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
    recoverAccountPassword(newPassword: string, uid: string): Promise < number > {

        return new Promise( (resolve, reject) => {

            const passwordValidationError: string = validatePassword(newPassword);
            if (passwordValidationError) {
                return reject(passwordValidationError);
            }

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[12]}=?`,
                [uid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const accountid: number = dbResponse.data[0].accounts_sys_key_id;
                        this.changeAccountPassword(accountid, newPassword)
                        .then(() => {
                            return resolve(accountid);
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
    resetAccountRecoveryId(accountid: number): Promise < null > {

        return new Promise( (resolve, reject) => {

            this.update(
                DbTables.accounts,
                `${DbTableAccountsFields[12]}=?`,
                [genRandStr(ACCOUNT_RECOVERYID_LEN)],
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.affectedRows == 1) {
                        return resolve();
                    } else {
                        return reject(`Database error finding accountid in db.`);
                    }
                })
                .catch((error: string) => {
                    return reject(`Database error reseting account recovery id.`);
                });

        });
    }

}

export const settingsModel: SettingsModel = new SettingsModel();