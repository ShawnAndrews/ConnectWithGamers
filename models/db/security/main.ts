const fs = require("fs");
const bcrypt = require("bcryptjs");
import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import { genRandStr } from "../../../util/main";
import {
    AUTH_TOKEN_NAME,
    GenericModelResponse, AuthenticationInfo,
    TokenInfo,
    DbTables,
    DbTableAccountsFields,
    DbTableTokensFields,
    AccountTypeEnums,
    EMAIL_VERIFICATION_LEN, ACCOUNT_RECOVERYID_LEN } from "../../../client/client-server-common/common";
import Axios, { AxiosResponse } from "axios";

export enum SecurityCacheEnum {
    attachment = "attachment",
    emote = "emote",
    profile = "profile"
}

class SecurityModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Authenticate IGDB account authorization code.
     */
    IGDBAuthenticate(igdbAuthCode: string): Promise<TokenInfo> {

        const insertIGDBTokenPromise = (dbAccountid: number, accessToken: string, expiresIn: Date): Promise<void> => {

            return new Promise( (resolve, reject) => {
                const tokenEnum: AccountTypeEnums = AccountTypeEnums.IGDB;

                this.insert(
                    DbTables.tokens,
                    DbTableTokensFields.slice(1),
                    [dbAccountid, tokenEnum, accessToken, Date.now() / 1000, expiresIn.getTime() / 1000],
                    "?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?)")
                    .then((dbResponse: GenericModelResponse) => {
                        if (dbResponse.error) {
                            return reject(dbResponse.error);
                        } else {
                            return resolve();
                        }
                    });

            });

        };

        return new Promise((resolve, reject) => {

            // get access token from auth code
            Axios.post(`${config.igdb.token_url}?client_secret=${config.igdb.client_secret}&code=${igdbAuthCode}&redirect_uri=${config.igdb.redirect_uri}&grant_type=${config.igdb.grant_type}&client_id=${config.igdb.client_id}`)
                .then((response: AxiosResponse) => {
                    const igdbAccessToken: string = response.data.access_token;
                    const expiresIn: Date = new Date();
                    expiresIn.setSeconds(expiresIn.getSeconds() + response.data.expires_in);

                    // get IGDB user info
                    Axios({
                            method: "get",
                            url: `https://api-v3.igdb.com/private/me`,
                            headers: {
                                "user-key": config.igdb.key,
                                "Authorization": `Bearer ${igdbAccessToken}`
                            }
                        })
                        .then((response: AxiosResponse) => {
                            const igdbAccountId: number = response.data.id;
                            const igdbAccountUsername: string = response.data.username;

                            // get account id
                            this.getAccountIdByIGDBAccountId(igdbAccountId, igdbAccountUsername)
                                .then((accountId: number) => {

                                    // insert token code
                                    insertIGDBTokenPromise(accountId, igdbAccessToken, expiresIn)
                                        .then(() => {
                                            const tokenInfo: TokenInfo = { token: igdbAccessToken, tokenExpiration: expiresIn };

                                            return resolve(tokenInfo);
                                        })
                                        .catch(() => {
                                            return reject(`Failed to insert IGDB token.`);
                                        });

                                })
                                .catch(() => {
                                    return reject(`Failed to get account id from IGDB id.`);
                                });

                        })
                        .catch((err: string) => {
                            return reject(`Invalid token code.`);
                        });
                })
                .catch((err: string) => {
                    return reject(`Invalid auth code.`);
                });

        });

    }

    /**
     * Get account id by IGDB account id. If does not exist, create account.
     */
    getAccountIdByIGDBAccountId(igdbAccountId: number, igdbUsername: string): Promise<number> {

        return new Promise((resolve, reject) => {

            // check if igdb account exists
            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[14]} = ?`,
                [igdbAccountId])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {
                        const accountId: number = dbResponse.data[0].accounts_sys_key_id;

                        return resolve(accountId);
                    } else {

                        this.getUnusedAccountUsername(igdbUsername)
                            .then((uniqueUsername: string) => {

                                const columnValues: any[] = [AccountTypeEnums.IGDB, uniqueUsername, undefined, undefined, undefined, Date.now() / 1000, undefined, undefined, undefined, genRandStr(EMAIL_VERIFICATION_LEN), genRandStr(ACCOUNT_RECOVERYID_LEN), false, undefined, igdbAccountId];

                                // create IGDB-linked account
                                this.insert(
                                    DbTables.accounts,
                                    DbTableAccountsFields.slice(1),
                                    columnValues,
                                    `?, ?, ?, ?, ?, FROM_UNIXTIME(?), ?, ?, ?, ?, ?, ?, ?, ?`)
                                    .then((response: GenericModelResponse) => {
                                        const accountId: number = response.data.insertId;
                                        return resolve(accountId);
                                    })
                                    .catch((error: string) => {
                                        return reject(`Failed to create IGDB-linked account.`);
                                    });

                            })
                            .catch(() => {
                                return reject(`Failed to generate unique username.`);
                            });

                    }

                })
                .catch((err: string) => {
                    return reject(`Database error: ${err}`);
                });

        });

    }

    /**
     * Find an unused account username. If attempted username already exists, generate a unique username.
     */
    getUnusedAccountUsername(attemptedUsername: string): Promise<string> {

        return new Promise((resolve, reject) => {

            // check if an account exists with attempted username
            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[2]} = ?`,
                [attemptedUsername])
                .then((dbResponse: GenericModelResponse) => {

                    if (dbResponse.data.length > 0) {

                        // generate unique username
                        this.custom(`SHOW TABLE STATUS LIKE '${DbTables.accounts}'`, [])
                            .then((dbResponse: GenericModelResponse) => {
                                const nextAIValue: number = dbResponse.data[0].Auto_increment;
                                const uniqueUsername: string = `Anonymous${nextAIValue}`;

                                return resolve(uniqueUsername);
                            })
                            .catch((err: string) => {
                                return reject(`Database error: ${err}`);
                            });

                    } else {
                        return resolve(attemptedUsername);
                    }

                })
                .catch((err: string) => {
                    return reject(`Database error: ${err}`);
                });

        });

    }

    /**
     * Authenticate account credentials.
     */
    authenticate(username: string, password: string, remember: boolean): Promise<AuthenticationInfo> {
        return new Promise((resolve, reject) => {
            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[2]}=?`,
                [username])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const dbPasswordHash: string = dbResponse.data[0].password_hash;
                        const dbAccountId: number = dbResponse.data[0].accounts_sys_key_id;
                        if (bcrypt.compareSync(password, dbPasswordHash)) {
                            const response: AuthenticationInfo = { accountid: dbAccountId, username: username, remember: remember };
                            return resolve(response);
                        } else {
                            return reject(`Incorrect username or password.`);
                        }
                    } else {
                        return reject(`Incorrect username or password.`);
                    }
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });

    }

    /**
     * Authorize account access via HTTP request cookie.
     */
    authorize(cookie: string | string[]): Promise<number> {

        const formattedCookie: string = typeof cookie === "string" ? cookie : cookie.join("");

        return new Promise((resolve, reject) => {

            if (!formattedCookie) {
                return reject("Please login to proceed.");
            }

            const authCookieMatch: string[] = formattedCookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

            // validate
            if (!authCookieMatch) {
                return reject("Auth cookie not found.");
            }

            const authToken: string = authCookieMatch[1];

            this.select(
                DbTables.tokens,
                DbTableTokensFields,
                `${DbTableTokensFields[3]}=?`,
                [authToken])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const accountid: number = Number(dbResponse.data[0].accounts_sys_key_id);
                        return resolve(accountid);
                    } else {
                        return reject(`Valid auth token not found in database.`);
                    }
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });

    }

    /**
     * Issue a new token with an associated expiration date.
     */
    token(username: string, remember: boolean): Promise<TokenInfo> {

        const getAccountInfoPromise = (): Promise<GenericModelResponse> => {

            return new Promise((resolve, reject) => {

                const response: GenericModelResponse = {error: undefined, data: undefined};

                this.select(
                    DbTables.accounts,
                    DbTableAccountsFields,
                    `${DbTableAccountsFields[2]}=?`,
                    [username])
                    .then((dbResponse: GenericModelResponse) => {
                        if (dbResponse.error) {
                            return reject(response);
                        } else {
                            if (dbResponse.data.length > 0) {
                                const accountid = Number(dbResponse.data[0].accounts_sys_key_id);
                                const salt = dbResponse.data[0].salt;
                                response.data = { accountid: accountid, salt: salt };
                                return resolve(response);
                            } else {
                                response.error = `Incorrect username or password.`;
                                return reject(response);
                            }
                        }
                    });

            });
        };

        /**
         * Insert token into database.
         */
        const insertTokenPromise = (dbAccountid: number): Promise<GenericModelResponse> => {

            return new Promise( (resolve, reject) => {

                const response: GenericModelResponse = {error: undefined, data: undefined};
                const authToken: string = genRandStr(config.token_length);
                const authTokenExpiration: number = remember ? Date.now() + config.token_remember_expiration : Date.now() + config.token_expiration;
                const tokenEnum: AccountTypeEnums = AccountTypeEnums.CWG;

                this.insert(
                    DbTables.tokens,
                    DbTableTokensFields.slice(1),
                    [dbAccountid, tokenEnum, authToken, Date.now() / 1000, authTokenExpiration / 1000],
                    "?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?)")
                    .then((dbResponse: GenericModelResponse) => {
                        if (dbResponse.error) {
                            return reject(dbResponse.error);
                        } else {
                            response.data = {token: authToken, tokenExpiration: new Date(authTokenExpiration)};
                            return resolve(response);
                        }
                    });

            });

        };

        return new Promise( (resolve, reject) => {

            getAccountInfoPromise()
            .then((response: GenericModelResponse) => {
                // insert new token
                const accountid = response.data.accountid;
                return insertTokenPromise(accountid);
            })
            .then((response: GenericModelResponse) => {
                const TokenInfo: TokenInfo = {token: response.data.token, tokenExpiration: response.data.tokenExpiration};
                return resolve(TokenInfo);
            })
            .catch((error: string) => {
                return reject(error);
            });

        });

    }

    /**
     * Upload base64 image to disk.
     */
    uploadImage(imageBase64: string, SecurityCacheEnum: SecurityCacheEnum, fileExtension: string, uid: string): Promise < void > {
        const outputPath: string = __dirname + `/../../../../cache/chatroom/${SecurityCacheEnum}/${uid}.${fileExtension}`;

        return new Promise( (resolve, reject) => {
            if (!imageBase64) {
                return resolve();
            }

            fs.writeFile(outputPath, imageBase64, "base64", (err: any) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    /**
     * Delete base64 image from disk.
     */
    deleteImage(SecurityCacheEnum: SecurityCacheEnum, fileExtension: string, uid: string): Promise <void> {
        const path: string = __dirname + `/../../../../cache/chatroom/${SecurityCacheEnum}/${uid}.${fileExtension}`;

        return new Promise( (resolve, reject) => {
            if (!fs.existsSync(path)) {
                return resolve();
            }

            fs.unlink(path, (err: any) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

}

export const securityModel: SecurityModel = new SecurityModel();
