const bcrypt = require("bcrypt");
import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import { genRandStr } from "../../../util/main";
import {
    AUTH_TOKEN_NAME,
    GenericResponseModel, DbAuthenticateResponse, DbAuthorizeResponse,
    DbTokenResponse } from "../../../client/client-server-common/common";

class SecurityModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Authenticate account credentials.
     */
    authenticate(username: string, password: string, remember: boolean): Promise<DbAuthenticateResponse> {
        return new Promise((resolve, reject) => {
            this.select(
                "dbo.accounts",
                ["username"],
                [this.sql.VarChar],
                [username],
                ["passwordHash"],
                "username=@username")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.recordsets[0].length > 0) {
                        const dbPasswordHash = dbResponse.data.recordsets[0][0].passwordHash;
                        if (bcrypt.compareSync(password, dbPasswordHash)) {
                            const response: DbAuthenticateResponse = { username: username, remember: remember };
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
    authorize(cookie: string): Promise<DbAuthorizeResponse> {

        return new Promise((resolve, reject) => {

            if (!cookie) {
                return reject("Cookie not found.");
            }

            const authCookieMatch: string[] = cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

            // validate
            if (!authCookieMatch) {
                return reject("Auth cookie not found.");
            }

            const authToken: string = authCookieMatch[1];
            this.select(
                "dbo.tokens",
                [AUTH_TOKEN_NAME],
                [this.sql.VarChar],
                [authToken],
                ["accountid"],
                `${AUTH_TOKEN_NAME}=@${AUTH_TOKEN_NAME}`)
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.recordsets[0].length > 0) {
                        const accountid: number = Number(dbResponse.data.recordsets[0][0].accountid);
                        const dbAuthorizeResponse: DbAuthorizeResponse = { accountid: accountid };
                        return resolve(dbAuthorizeResponse);
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
    token(username: string, remember: boolean): Promise<DbTokenResponse> {

        const getAccountInfoPromise = (): Promise<GenericResponseModel> => {

            return new Promise((resolve, reject) => {

                const response: GenericResponseModel = {error: undefined, data: undefined};

                this.select(
                    "dbo.accounts",
                    ["username"],
                    [this.sql.VarChar],
                    [username],
                    ["accountid", "salt"],
                    "username=@username")
                    .then((dbResponse: GenericResponseModel) => {
                        if (dbResponse.error) {
                            return reject(response);
                        } else {
                            if (dbResponse.data.recordsets[0].length > 0) {
                                const accountid = Number(dbResponse.data.recordsets[0][0].accountid);
                                const salt = dbResponse.data.recordsets[0][0].salt;
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
        const insertTokenPromise = (dbAccountid: number): Promise<GenericResponseModel> => {

            return new Promise( (resolve, reject) => {

                const response: GenericResponseModel = {error: undefined, data: undefined};
                const authToken: string = genRandStr(config.token_length);
                const authTokenExpiration: number = remember ? Date.now() + config.token_remember_expiration : Date.now() + config.token_expiration;

                this.insert(
                    "dbo.tokens",
                    ["accountid", "authToken", "createdOn", "expiresOn"],
                    [this.sql.Int, this.sql.VarChar, this.sql.DateTime, this.sql.DateTime],
                    [dbAccountid, authToken, Date.now(), authTokenExpiration])
                    .then((dbResponse: GenericResponseModel) => {
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
            .then((response: GenericResponseModel) => {
                // inserting token
                const accountid = response.data.accountid;
                return insertTokenPromise(accountid);
            })
            .then((response: GenericResponseModel) => {
                const dbTokenResponse: DbTokenResponse = {token: response.data.token, tokenExpiration: response.data.tokenExpiration};
                return resolve(dbTokenResponse);
            })
            .catch((error: string) => {
                return reject(error);
            });

        });

    }

}

export const securityModel: SecurityModel = new SecurityModel();