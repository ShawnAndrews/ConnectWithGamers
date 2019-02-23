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
    TokenEnums } from "../../../client/client-server-common/common";
import { resolve } from "path";

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
     * Authenticate account credentials.
     */
    authenticate(username: string, password: string, remember: boolean): Promise<AuthenticationInfo> {
        return new Promise((resolve, reject) => {
            this.select(
                DbTables.accounts,
                DbTableAccountsFields,
                `${DbTableAccountsFields[1]}=?`,
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
                `${DbTableTokensFields[2]}=?`,
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
                    `${DbTableAccountsFields[1]}=?`,
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
                const tokenEnum: TokenEnums.CWG_TOKEN;

                this.insert(
                    DbTables.tokens,
                    DbTableTokensFields.slice(1),
                    [dbAccountid, authToken, tokenEnum, Date.now() / 1000, authTokenExpiration / 1000],
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
