const bcrypt = require("bcrypt");
import config from "../config";
import DatabaseBase from "./dbBase";
import { ResponseModel } from "../client/client-server-common/common";

const TOKEN_LEN = 40;
const SALT_RNDS = 10;

class DatabaseModel extends DatabaseBase {

    constructor() {
        super();
    }

    createAccount(username: string, email: string, password: string): Promise<ResponseModel> {

        const salt = bcrypt.genSaltSync(SALT_RNDS);
        const hash = bcrypt.hashSync(password, salt);

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            this.insert("dbo.accounts",
                ["username", "email", "passwordHash", "salt", "createdOn"],
                [this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.DateTime],
                [username, email, hash, salt, Date.now()])
                .then(() => {
                    return resolve(response);
                })
                .catch(() => {
                    response.errors.push("Username is taken.");
                    return resolve(response);
                });

        });
    }

    authenticate(username: string, password: string, remember: boolean): Promise<ResponseModel> {

        return new Promise((resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            this.select(
                "dbo.accounts",
                ["username"],
                [this.sql.VarChar],
                [username],
                ["passwordHash"],
                "username=@username")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.recordsets[0].length > 0) {
                        const dbPasswordHash = dbResponse.data.recordsets[0][0].passwordHash;
                        if (bcrypt.compareSync(password, dbPasswordHash)) {
                            response.data = {username: username, remember: remember};
                            return resolve(response);
                        } else {
                            response.errors.push(`Incorrect username or password.`);
                            return reject(response);
                        }
                    } else {
                        response.errors.push(`Incorrect username or password.`);
                        return reject(response);
                    }
                })
                .catch((err) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });

    }

    token(username: string, remember: boolean): Promise<ResponseModel> {

        const generate_token = (length: number): string => {
            const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
            const b = [];
            for (let i = 0; i < length; i++) {
                const j: string = (Math.random() * (a.length - 1)).toFixed(0);
                b[i] = a[Number(j)];
            }
            return b.join("");
        };

        const getAccountIdPromise = (): Promise<ResponseModel> => {

            return new Promise((resolve, reject) => {

                const response: ResponseModel = {errors: [], data: undefined};

                this.select(
                    "dbo.accounts",
                    ["username"],
                    [this.sql.VarChar],
                    [username],
                    ["accountid"],
                    "username=@username")
                    .then((dbResponse: ResponseModel) => {
                        if (dbResponse.errors.length > 0) {
                            return reject(response);
                        } else {
                            if (dbResponse.data.recordsets[0].length > 0) {
                                const dbAccountid = Number(dbResponse.data.recordsets[0][0].accountid);
                                response.data = dbAccountid;
                                return resolve(response);
                            } else {
                                response.errors.push(`Incorrect username or password.`);
                                return reject(response);
                            }
                        }
                    });

            });
        };

        const getAccountTokenPromise = (dbAccountid: number): Promise<ResponseModel> => {

            return new Promise((resolve, reject) => {

                const response: ResponseModel = {errors: [], data: undefined};

                this.select(
                    "dbo.tokens",
                    ["accountid"],
                    [this.sql.Int],
                    [dbAccountid],
                    ["tokenHash"],
                    "accountid=@accountid")
                    .then((dbResponse: ResponseModel) => {
                        if (dbResponse.errors.length > 0) {
                            return reject(response);
                        } else {
                            if (dbResponse.data.recordsets[0].length > 0) {
                                response.data = {tokenFound: true, dbAccountid: dbAccountid};
                                return resolve(response);
                            } else {
                                response.data = {tokenFound: false, dbAccountid: dbAccountid};
                                return resolve(response);
                            }
                        }
                    });

            });

        };

        const insertTokenPromise = (dbAccountid: number): Promise<ResponseModel> => {

            return new Promise( (resolve, reject) => {

                const token = generate_token(TOKEN_LEN);
                const tokenSalt = bcrypt.genSaltSync(10);
                const response: ResponseModel = {errors: [], data: undefined};

                this.insert(
                    "dbo.tokens",
                    ["accountid", "tokenHash", "salt", "createdOn"],
                    [this.sql.Int, this.sql.VarChar, this.sql.VarChar, this.sql.DateTime],
                    [dbAccountid, bcrypt.hashSync(token, tokenSalt), tokenSalt, Date.now()])
                    .then((dbResponse: ResponseModel) => {
                        if (dbResponse.errors.length > 0) {
                            return reject(response);
                        } else {
                            let tokenExpiration = undefined;
                            if (remember == true) {
                                tokenExpiration = new Date(Date.now() + config.token_remember_expiration);
                            } else {
                                tokenExpiration = new Date(Date.now() + config.token_expiration);
                            }
                            response.data = {token: token, tokenExpiration: tokenExpiration};
                            return resolve(response);
                        }
                    });

            });

        };

        const updateTokenPromise = (dbAccountid: number): Promise<ResponseModel> => {

            // return promise
            return new Promise( (resolve, reject) => {

                const token = generate_token(TOKEN_LEN);
                const tokenSalt = bcrypt.genSaltSync(10);
                const response: ResponseModel = {errors: [], data: undefined};

                this.update(
                    "dbo.tokens",
                    ["accountid", "tokenHash", "salt"],
                    [this.sql.Int, this.sql.VarChar, this.sql.VarChar],
                    [dbAccountid, bcrypt.hashSync(token, tokenSalt), tokenSalt],
                    "accountid=@accountid")
                    .then((dbResponse: ResponseModel) => {
                        if (dbResponse.errors.length > 0) {
                            return reject(response);
                        } else {
                            let tokenExpiration = undefined;
                            if (remember == true) {
                                tokenExpiration = new Date(Date.now() + config.token_remember_expiration);
                            }
                            else {
                                tokenExpiration = new Date(Date.now() + config.token_expiration);
                            }
                            response.data = {token: token, tokenExpiration: tokenExpiration};
                            return resolve(response);
                        }
                    });

            });

        };

        return getAccountIdPromise()
               .then((response) => {
                    // look for token
                    console.log("looking for existing token");
                    return getAccountTokenPromise(response.data);
               })
               .then((response) => {
                   if (response.data.tokenFound) {
                    // token found, updating token
                    console.log("token found. updating token");
                    return updateTokenPromise(response.data.dbAccountid);
                   } else {
                    // token not found, inserting token
                    console.log("token not found. inserting token");
                    return insertTokenPromise(response.data.dbAccountid);
                   }
                });

    }

}

export default new DatabaseModel();