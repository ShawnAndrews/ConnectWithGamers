const bcrypt = require("bcryptjs");
import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import { genRandStr } from "../../../util/main";
import {
    AUTH_TOKEN_NAME,
    GenericModelResponse, AuthenticationInfo,
    TokenInfo } from "../../../client/client-server-common/common";

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
                "accounts",
                ["accountid", "passwordHash"],
                `username=?`,
                [username])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const dbPasswordHash: string = dbResponse.data[0].passwordHash;
                        const dbAccountId: number = dbResponse.data[0].accountid;
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
                "tokens",
                ["accountid"],
                `${AUTH_TOKEN_NAME}=?`,
                [authToken])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const accountid: number = Number(dbResponse.data[0].accountid);
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
                    "accounts",
                    ["accountid", "salt"],
                    `username=?`,
                    [username])
                    .then((dbResponse: GenericModelResponse) => {
                        if (dbResponse.error) {
                            return reject(response);
                        } else {
                            if (dbResponse.data.length > 0) {
                                const accountid = Number(dbResponse.data[0].accountid);
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

                this.insert(
                    "tokens",
                    ["accountid", "authToken", "createdOn", "expiresOn"],
                    [dbAccountid, authToken, Date.now() / 1000, authTokenExpiration / 1000],
                    "?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?)")
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

}

export const securityModel: SecurityModel = new SecurityModel();