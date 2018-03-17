const bcrypt = require("bcrypt");
import config from "../config";
import DatabaseBase from "./dbBase";
import { ResponseModel, validateUsername, validateEmail, validateURL, ChatHistoryResponse, SingleChatHistory, ChatroomUser } from "../client/client-server-common/common";
import { DateTime } from "aws-sdk/clients/devicefarm";

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

    authorize(cookie: string): Promise<ResponseModel> {

        return new Promise((resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};
            const authCookieMatch: string[] = cookie.match(new RegExp("authToken=([^;]+)"));

            // validate
            if (!authCookieMatch) {
                response.errors.push("Auth cookie not found.");
                return reject(response);
            }

            const authToken: string = authCookieMatch[1];
            console.log(`AUTHENTICATING SOCKET: ${authToken}`);
            this.select(
                "dbo.tokens",
                ["authToken"],
                [this.sql.VarChar],
                [authToken],
                ["accountid"],
                "authToken=@authToken")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.recordsets[0].length > 0) {
                        const accountid: number = Number(dbResponse.data.recordsets[0][0].accountid);
                        response.data = { accountid: accountid };
                        return resolve(response);
                    } else {
                        response.errors.push(`Valid auth token not found in database.`);
                        return reject(response);
                    }
                })
                .catch((err: string) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });

    }

    getAccountSettings(accountid: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["username", "email", "discord", "steam", "twitch"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    const username = dbResponse.data.recordsets[0][0].username;
                    const email = dbResponse.data.recordsets[0][0].email;
                    const discord = dbResponse.data.recordsets[0][0].discord || "";
                    const steam = dbResponse.data.recordsets[0][0].steam || "";
                    const twitch = dbResponse.data.recordsets[0][0].twitch || "";
                    response.data = {
                        username: username,
                        email: email,
                        discord: discord,
                        steam: steam,
                        twitch: twitch};
                    return resolve(response);
                })
                .catch((err) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });
    }

    changeAccountUsername(accountid: string, newUsername: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            const usernameValidationError: string = validateUsername(newUsername);
            if (usernameValidationError) {
                response.errors.push(usernameValidationError);
                return reject(response);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "username"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newUsername],
                ["username"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve(response);
                    } else {
                        return reject(response);
                    }
                })
                .catch((err: any) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });
    }

    getAccountUsername(accountid: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["username"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    const username = dbResponse.data.recordsets[0][0].username;
                    response.data = { username: username };
                    return resolve(response);
                })
                .catch((err: any) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });
    }

    changeAccountEmail(accountid: string, newEmail: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            const emailValidationError: string = validateEmail(newEmail);
            if (emailValidationError) {
                response.errors.push(emailValidationError);
                return reject(response);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "email"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newEmail],
                ["email"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve(response);
                    } else {
                        return reject(response);
                    }
                })
                .catch((err: any) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });
    }
    changeAccountDiscord(accountid: string, newDiscord: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};
            const discordValidationError: string = validateURL(newDiscord);
            if (discordValidationError) {
                response.errors.push(discordValidationError);
                return reject(response);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "discord"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newDiscord],
                ["discord"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve(response);
                    } else {
                        return reject(response);
                    }
                })
                .catch((err: any) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });
    }

    changeAccountSteam(accountid: string, newSteam: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            const discordValidationError: string = validateURL(newSteam);
            if (discordValidationError) {
                response.errors.push(discordValidationError);
                return reject(response);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "steam"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newSteam],
                ["steam"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve(response);
                    } else {
                        return reject(response);
                    }
                })
                .catch((err: any) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });
    }

    changeAccountTwitch(accountid: string, newTwitch: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            const discordValidationError: string = validateURL(newTwitch);
            if (discordValidationError) {
                response.errors.push(discordValidationError);
                return reject(response);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "twitch"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newTwitch],
                ["twitch"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.rowsAffected[0] == 1) {
                        return resolve(response);
                    } else {
                        return reject(response);
                    }
                })
                .catch((err: any) => {
                    response.errors.push(err);
                    return reject(response);
                });

        });
    }

    token(username: string, remember: boolean): Promise<ResponseModel> {

        const genAuthToken = (): string => {
            let text: string = "";
            const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (let i = 0; i < config.token_length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

        const getAccountInfoPromise = (): Promise<ResponseModel> => {

            return new Promise((resolve, reject) => {

                const response: ResponseModel = {errors: [], data: undefined};

                this.select(
                    "dbo.accounts",
                    ["username"],
                    [this.sql.VarChar],
                    [username],
                    ["accountid", "salt"],
                    "username=@username")
                    .then((dbResponse: ResponseModel) => {
                        if (dbResponse.errors.length > 0) {
                            return reject(response);
                        } else {
                            if (dbResponse.data.recordsets[0].length > 0) {
                                const accountid = Number(dbResponse.data.recordsets[0][0].accountid);
                                const salt = dbResponse.data.recordsets[0][0].salt;
                                response.data = { accountid: accountid, salt: salt };
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
                    ["accountid"],
                    "accountid=@accountid")
                    .then((dbResponse: ResponseModel) => {
                        if (dbResponse.errors.length > 0) {
                            return reject(response);
                        } else {
                            const tokenFound: boolean = dbResponse.data.recordsets[0].length > 0;
                            response.data = {tokenFound: tokenFound};
                            return resolve(response);
                        }
                    })
                    .catch((err: any) => {
                        return reject(err);
                    });

            });

        };

        const insertTokenPromise = (dbAccountid: number): Promise<ResponseModel> => {

            return new Promise( (resolve, reject) => {

                const response: ResponseModel = {errors: [], data: undefined};
                const authToken: string = genAuthToken();
                const authTokenExpiration: number = remember ? Date.now() + config.token_remember_expiration : Date.now() + config.token_expiration;

                this.insert(
                    "dbo.tokens",
                    ["accountid", "authToken", "createdOn", "expiresOn"],
                    [this.sql.Int, this.sql.VarChar, this.sql.DateTime, this.sql.DateTime],
                    [dbAccountid, authToken, Date.now(), authTokenExpiration])
                    .then((dbResponse: ResponseModel) => {
                        if (dbResponse.errors.length > 0) {
                            return reject(response);
                        } else {
                            response.data = {token: authToken, tokenExpiration: new Date(authTokenExpiration)};
                            return resolve(response);
                        }
                    });

            });

        };

        let accountid: number = undefined;

        return getAccountInfoPromise()
            .then((response: ResponseModel) => {
                accountid = response.data.accountid;

                // inserting token
                console.log("Inserting token");
                return insertTokenPromise(accountid);
            });

    }

    addChatMessage(username: string, date: number, text: string): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: ResponseModel = {errors: [], data: undefined};

            this.insert(
                "dbo.chatroom",
                ["username", "date", "text"],
                [this.sql.VarChar, this.sql.DateTime, this.sql.NVarChar],
                [username, date, text])
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.errors.length > 0) {
                        return reject(response);
                    } else {
                        return resolve(response);
                    }
                });

        });

    }

    getChatHistory(): Promise<ChatHistoryResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.chatroom",
                [],
                [],
                [],
                ["username", "date", "text"],
                undefined,
                config.chatHistoryCount)
                .then((dbResponse: ResponseModel) => {
                    const chatHistoryResponse: ChatHistoryResponse = { name: [], date: [], text: [] };

                    dbResponse.data.recordsets[0].forEach((chat: any) => {
                        chatHistoryResponse.name.push(chat.username);
                        chatHistoryResponse.date.push(`${new Date(chat.date).toLocaleDateString()} ${new Date(chat.date).toLocaleTimeString()}`);
                        chatHistoryResponse.text.push(chat.text);
                    });

                    return resolve(chatHistoryResponse);
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });
    }

    getUserById(accountid: number): Promise<ChatroomUser> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["username", "discord", "steam", "twitch"],
                "accountid=@accountid")
                .then((dbResponse: ResponseModel) => {
                    if (dbResponse.data.recordsets[0].length > 0) {
                        const user: ChatroomUser = {
                            username: dbResponse.data.recordsets[0][0].username,
                            discord_url: dbResponse.data.recordsets[0][0].discord,
                            steam_url: dbResponse.data.recordsets[0][0].steam,
                            twitch_url: dbResponse.data.recordsets[0][0].twitch
                        };
                        return resolve(user);
                    } else {
                        return reject(accountid);
                    }
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject(accountid);
                });

        });
    }

}

export default new DatabaseModel();