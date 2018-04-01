const bcrypt = require("bcrypt");
const imgur = require("imgur");
import config from "../config";
import DatabaseBase from "./dbBase";
import { AUTH_TOKEN_NAME, GenericResponseModel, validateUsername, validateEmail, validateURL, ChatHistoryResponse, DbAccountSettingsResponse, DbAccountImageResponse, DbAuthorizeResponse, DbTokenResponse, DbAuthenticateResponse, DbUserResponse, validatePassword } from "../client/client-server-common/common";

const SALT_RNDS = 10;

imgur.setClientId(config.imgur.clientId);

class DatabaseModel extends DatabaseBase {

    constructor() {
        super();
    }

    createAccount(username: string, email: string, password: string): Promise<null> {

        const salt = bcrypt.genSaltSync(SALT_RNDS);
        const hash = bcrypt.hashSync(password, salt);

        return new Promise( (resolve, reject) => {

            this.insert("dbo.accounts",
                ["username", "email", "passwordHash", "salt", "createdOn"],
                [this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.DateTime],
                [username, email, hash, salt, Date.now()])
                .then(() => {
                    return resolve();
                })
                .catch(() => {
                    return reject("Username is taken.");
                });

        });
    }

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

    getAccountSettings(accountid: number): Promise<DbAccountSettingsResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["username", "email", "discord", "steam", "twitch", "image"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    const username = dbResponse.data.recordsets[0][0].username;
                    const email = dbResponse.data.recordsets[0][0].email;
                    const discord = dbResponse.data.recordsets[0][0].discord || "";
                    const steam = dbResponse.data.recordsets[0][0].steam || "";
                    const twitch = dbResponse.data.recordsets[0][0].twitch || "";
                    const image = dbResponse.data.recordsets[0][0].image;
                    const dbAccountSettingsResponse: DbAccountSettingsResponse = {
                        username: username,
                        email: email,
                        discord: discord,
                        steam: steam,
                        twitch: twitch,
                        image: image};
                    return resolve(dbAccountSettingsResponse);
                })
                .catch((error: string) => {
                    return reject(error);
                });

        });
    }

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

    changeAccountEmail(accountid: number, newEmail: string): Promise<null> {

        return new Promise( (resolve, reject) => {

            const emailValidationError: string = validateEmail(newEmail);
            if (emailValidationError) {
                return reject(emailValidationError);
            }

            this.update(
                "dbo.accounts",
                ["accountid", "email"],
                [this.sql.Int, this.sql.VarChar],
                [accountid, newEmail],
                ["email"],
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

    getAccountUsername(accountid: number): Promise<GenericResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: GenericResponseModel = {error: undefined, data: undefined};

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["username"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    const username = dbResponse.data.recordsets[0][0].username;
                    response.data = { username: username };
                    return resolve(response);
                })
                .catch((error: string) => {
                    response.error = error;
                    return reject(response);
                });

        });
    }

    getAccountImage(accountid: number): Promise<DbAccountImageResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["image"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    const dbAccountImageResponse: DbAccountImageResponse = { link: dbResponse.data.recordsets[0][0].image };
                    return resolve(dbAccountImageResponse);
                })
                .catch((error: string) => {
                    return reject(`Database error. ${error}`);
                });

        });
    }


    token(username: string, remember: boolean): Promise<DbTokenResponse> {

        const genAuthToken = (): string => {
            let text: string = "";
            const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (let i = 0; i < config.token_length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

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

        const insertTokenPromise = (dbAccountid: number): Promise<GenericResponseModel> => {

            return new Promise( (resolve, reject) => {

                const response: GenericResponseModel = {error: undefined, data: undefined};
                const authToken: string = genAuthToken();
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

    addChatMessage(username: string, date: number, text: string, image: string): Promise<GenericResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: GenericResponseModel = {error: undefined, data: undefined};

            this.insert(
                "dbo.chatroom",
                ["username", "date", "text", "image"],
                [this.sql.VarChar, this.sql.DateTime, this.sql.NVarChar, this.sql.VarChar],
                [username, date, text, image])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.error) {
                        return reject(dbResponse.error);
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
                ["username", "date", "text", "image"],
                undefined,
                config.chatHistoryCount)
                .then((dbResponse: GenericResponseModel) => {
                    const chatHistoryResponse: ChatHistoryResponse = { name: [], date: [], text: [], image: [] };

                    dbResponse.data.recordsets[0].forEach((chat: any) => {
                        chatHistoryResponse.name.push(chat.username);
                        chatHistoryResponse.date.push(`${new Date(chat.date).toLocaleDateString()} ${new Date(chat.date).toLocaleTimeString()}`);
                        chatHistoryResponse.text.push(chat.text);
                        chatHistoryResponse.image.push(chat.image);
                    });

                    return resolve(chatHistoryResponse);
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });
    }

    getUserById(accountid: number): Promise<DbUserResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["username", "discord", "steam", "twitch", "image"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.data.recordsets[0].length > 0) {
                        const dbUser: DbUserResponse = {
                            username: dbResponse.data.recordsets[0][0].username,
                            discord_url: dbResponse.data.recordsets[0][0].discord,
                            steam_url: dbResponse.data.recordsets[0][0].steam,
                            twitch_url: dbResponse.data.recordsets[0][0].twitch,
                            image: dbResponse.data.recordsets[0][0].image
                        };
                        return resolve(dbUser);
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