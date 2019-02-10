const bcrypt = require("bcryptjs");
import axios from "axios";
import DatabaseBase from "../base/dbBase";
import { genRandStr } from "../../../util/main";
import { sendVerificationEmail } from "../../../util/nodemailer";
import { GenericModelResponse, RecoveryEmailInfo, AccountsInfo, SteamFriend, TwitchUser, TwitchEmote, TwitchPair, AccountInfo, GameRating, DbTableAccountsFields, DbTables, DbTableRatingsFields, DbTableIGDBGamesFields } from "../../../client/client-server-common/common";
import config from "../../../config";

export const SALT_RNDS = 10;
export const EMAIL_VERIFICATION_LEN = 15;
export const ACCOUNT_RECOVERYID_LEN = 32;

class AccountModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Create an account.
     */
    createAccount(username: string, email: string, password: string, defaultTwitch?: string, defaultSteam?: string, defaultDiscord?: string): Promise<number> {

        const salt = bcrypt.genSaltSync(SALT_RNDS);
        const hash = bcrypt.hashSync(password, salt);
        const emailVerification = genRandStr(EMAIL_VERIFICATION_LEN);
        const columnValues: any[] = [username, email, hash, salt, Date.now() / 1000, defaultDiscord || undefined, defaultSteam || undefined, defaultTwitch || undefined, undefined, emailVerification, genRandStr(ACCOUNT_RECOVERYID_LEN)];

        return new Promise( (resolve, reject) => {

            this.insert(
                DbTables.accounts,
                DbTableAccountsFields.slice(1),
                columnValues,
                `?, ?, ?, ?, FROM_UNIXTIME(?), ?, ?, ?, ?, ?, ?`)
                .then((response: GenericModelResponse) => {
                    sendVerificationEmail(email, `http://www.connectwithgamers.com/account/verify/${emailVerification}`)
                    .then(() => {
                        const accountId: number = response.data.insertId;
                        return resolve(accountId);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
                })
                .catch((error: string) => {
                    console.log(`Faled insert: ${error}`);
                    return reject(`Username is taken.`);
                });

        });
    }

    /**
     * Get account id.
     */
    getAccountId(username: string): Promise<GenericModelResponse> {

        return new Promise( (resolve, reject) => {

            const response: GenericModelResponse = {error: undefined, data: undefined};

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[1]}=?`,
                [username])
                .then((dbResponse: GenericModelResponse) => {
                    const accountid: number = dbResponse.data[0].accounts_sys_key_id;
                    response.data = { accountid: accountid };
                    return resolve(response);
                })
                .catch((error: string) => {
                    response.error = error;
                    return reject(response);
                });

        });
    }

    /**
     * Get account username.
     */
    getAccountUsername(accountid: number): Promise<GenericModelResponse> {

        return new Promise( (resolve, reject) => {

            const response: GenericModelResponse = {error: undefined, data: undefined};

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const username = dbResponse.data[0].username;
                    response.data = { username: username };
                    return resolve(response);
                })
                .catch((error: string) => {
                    response.error = error;
                    return reject(response);
                });

        });
    }
    /**
     * Get account recovery info by username.
     */
    getAccountRecoveryInfoByUsername(username: string): Promise<RecoveryEmailInfo> {

        return new Promise( (resolve, reject) => {
            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[1]}=?`,
                [username])
                .then((dbResponse: GenericModelResponse) => {
                    const RecoveryEmailInfo: RecoveryEmailInfo = { email: dbResponse.data[0].email, uid: dbResponse.data[0].recovery_verification_code };
                    return resolve(RecoveryEmailInfo);
                })
                .catch((error: string) => {
                    return reject(`Username not found in database.`);
                });
        });
    }

    /**
     * Verify recovery link is valid.
     */
    verifyRecoveryExists(uid: string): Promise<boolean> {

        return new Promise( (resolve, reject) => {
            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[11]}=?`,
                [uid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                })
                .catch((error: string) => {
                    return reject(`Username not found in database.`);
                });
        });
    }

    /**
     * Get public account information by username filter.
     */
    getAccountsByUsernameFilter(usernameFilter: string): Promise<AccountsInfo> {
        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[1]} LIKE ${usernameFilter ? `?` : `'%'`}`,
                [`%${usernameFilter}%`])
                .then((dbResponse: GenericModelResponse) => {
                    const accounts: AccountInfo[] = [];
                    if (dbResponse.data.length > 0) {
                        dbResponse.data.forEach((element: any) => {
                            const account: AccountInfo = {
                                accountid: element.accounts_sys_key_id,
                                username: element.username,
                                discord: element.discord,
                                steam: element.steam,
                                twitch: element.twitch
                            };
                            accounts.push(account);
                        });
                    }

                    const dbUsers: AccountsInfo = { accounts: accounts };
                    return resolve(dbUsers);
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject();
                });

        });
    }

    /**
     * Get All public accounts information.
     */
    getAccountsInfoById(accountIds: number[]): Promise<AccountsInfo> {

        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[0]} IN (${accountIds.map(() => "?").join(",")})`,
                accountIds)
                .then((dbResponse: GenericModelResponse) => {
                    const accounts: AccountInfo[] = [];

                    if (dbResponse.data.length > 0) {
                        dbResponse.data.forEach((element: any) => {
                            const account: AccountInfo = {
                                accountid: element.accounts_sys_key_id,
                                username: element.username,
                                discord: element.discord,
                                steam: element.steam,
                                twitch: element.twitch,
                                profile: element.profile,
                                profile_file_extension: element.profile_file_extension
                            };
                            accounts.push(account);
                        });
                    }

                    const dbUsers: AccountsInfo = { accounts: accounts };
                    return resolve(dbUsers);
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject();
                });

        });
    }

    /**
     * Send verification email to confirm account's email address.
     */
    resendAccountEmail(accountid: number): Promise<null> {

        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const dbEmailVerification: string = dbResponse.data[0].email_verification_code;
                    const dbEmail: string = dbResponse.data[0].email;
                    sendVerificationEmail(dbEmail, `www.connectwithgamers.com/account/verify/${dbEmailVerification}`)
                    .then(() => {
                        return resolve();
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

                })
                .catch((error: string) => {
                    return reject(`Error: ${error}`);
                });

        });
    }

    /**
     * Verify visited URL contains a valid email verification code.
     */
    verifyAccountEmail(accountid: number, verificationCode: string): Promise<boolean> {

        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[0]}=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const dbEmailVerification: string = dbResponse.data[0].email_verification_code;

                    if (dbEmailVerification !== verificationCode) {
                        return resolve(false);
                    }

                    return this.update(
                        DbTables.accounts,
                        `${DbTableAccountsFields[10]}=?`,
                        [undefined],
                        `${DbTableAccountsFields[0]}=?`,
                        [accountid])
                        .then((dbResponse: GenericModelResponse) => {
                            if (dbResponse.data.affectedRows == 1) {
                                return resolve(true);
                            } else {
                                return reject(`Database error: Failed to update.`);
                            }
                        })
                        .catch((error: string) => {
                            return reject(`Database error. ${error}`);
                        });
                })
                .catch((error: string) => {
                    return reject(`Database error. ${error}`);
                });

        });
    }

    /**
     * Delete account by id.
     */
    deleteAccountById(accountid: number): Promise<void> {

        return new Promise( (resolve, reject) => {

            this.delete(
                DbTables.accounts,
                [`${DbTableAccountsFields[0]}=?`],
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    return resolve();
                })
                .catch((error: string) => {
                    return reject(`Database error. ${error}`);
                });

        });
    }

    /**
     * Rate game.
     */
    rateGame(gameRating: GameRating): Promise<void> {

        return new Promise( (resolve, reject) => {

            this.select(
                DbTables.igdb_games,
                DbTableIGDBGamesFields,
                `${DbTableIGDBGamesFields[1]}=?`,
                [gameRating.igdb_id])
                .then((dbResponse: GenericModelResponse) => {
                    const igdb_game_sys_key_id: number = dbResponse.data[0][DbTableIGDBGamesFields[0]];
                    const columnValues: any[] = [igdb_game_sys_key_id, gameRating.account_id, gameRating.rating, gameRating.date];

                    this.select(
                        DbTables.ratings,
                        DbTableRatingsFields,
                        `${DbTableRatingsFields[1]}=? AND ${DbTableRatingsFields[2]}=?`,
                        [igdb_game_sys_key_id, gameRating.account_id])
                        .then((dbResponse: GenericModelResponse) => {

                            if (dbResponse.data.length > 0) {

                                // update rating
                                this.update(
                                    DbTables.ratings,
                                    `${DbTableRatingsFields[3]}=?`,
                                    [gameRating.rating],
                                    `${DbTableRatingsFields[1]}=? AND ${DbTableRatingsFields[2]}=?`,
                                    [igdb_game_sys_key_id, gameRating.account_id])
                                    .then(() => {
                                        return resolve();
                                    })
                                    .catch((error: string) => {
                                        return reject(`Database error. ${error}`);
                                    });
                            } else {

                                // insert rating
                                this.insert(
                                    DbTables.ratings,
                                    DbTableRatingsFields.slice(1),
                                    columnValues,
                                    `?, ?, ?, FROM_UNIXTIME(?)`)
                                    .then(() => {
                                        return resolve();
                                    })
                                    .catch((error: string) => {
                                        return reject(`Database error. ${error}`);
                                    });
                            }
                        })
                        .catch((error: string) => {
                            return reject(`Database error. ${error}`);
                        });
                })
                .catch((err: string) => {

                });

        });
    }

}

export const accountModel: AccountModel = new AccountModel();