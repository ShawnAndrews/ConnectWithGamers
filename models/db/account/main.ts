const bcrypt = require("bcrypt");
import DatabaseBase from "../base/dbBase";
import { genRandStr } from "../../../util/main";
import { sendVerificationEmail } from "../../../util/nodemailer";
import {
    GenericResponseModel, DbAccountImageResponse, DbAccountInfoResponse } from "../../../client/client-server-common/common";

export const SALT_RNDS = 10;
export const EMAIL_VERIFICATION_LEN = 15;

class AccountModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Create an account.
     */
    createAccount(username: string, email: string, password: string): Promise<null> {

        const salt = bcrypt.genSaltSync(SALT_RNDS);
        const hash = bcrypt.hashSync(password, salt);
        const emailVerification = genRandStr(EMAIL_VERIFICATION_LEN);

        return new Promise( (resolve, reject) => {

            this.insert("dbo.accounts",
                ["username", "email", "passwordHash", "salt", "createdOn", "emailVerification"],
                [this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.DateTime, this.sql.VarChar],
                [username, email, hash, salt, Date.now(), emailVerification])
                .then(() => {
                    sendVerificationEmail(email, `http://www.connectwithgamers.com/account/verify/${emailVerification}`)
                    .then(() => {
                        return resolve();
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
     * Get account username.
     */
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

    /**
     * Get link to account's profile picture.
     */
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

    /**
     * Get public account information.
     */
    getAccountInfo(accountid: number): Promise<DbAccountInfoResponse> {

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
                        const dbUser: DbAccountInfoResponse = {
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

export const accountModel: AccountModel = new AccountModel();