import DatabaseBase from "../base/dbBase";
import {
    GenericResponseModel, DbVerifyEmailResponse } from "../../../client/client-server-common/common";
import { sendVerificationEmail } from "../../../util/nodemailer";

class VerificationModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Send verification email to confirm account's email address.
     */
    resendAccountEmail(accountid: number): Promise<null> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["email", "emailVerification"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    const dbEmailVerification: string = dbResponse.data.recordsets[0][0].emailVerification;
                    const dbEmail: string = dbResponse.data.recordsets[0][0].email;
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
    verifyAccountEmail(accountid: number, verificationCode: string): Promise<DbVerifyEmailResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.accounts",
                ["accountid"],
                [this.sql.Int],
                [accountid],
                ["emailVerification"],
                "accountid=@accountid")
                .then((dbResponse: GenericResponseModel) => {
                    const dbEmailVerification: string = dbResponse.data.recordsets[0][0].emailVerification;

                    if (dbEmailVerification !== verificationCode) {
                        const dbVerifyEmailResponse: DbVerifyEmailResponse = { verificationSuccessful: false };
                        return resolve(dbVerifyEmailResponse);
                    }

                    return this.update(
                        "dbo.accounts",
                        ["accountid", "emailVerification"],
                        [this.sql.Int, this.sql.VarChar],
                        [accountid, undefined],
                        ["emailVerification"],
                        "accountid=@accountid")
                        .then((dbResponse: GenericResponseModel) => {
                            if (dbResponse.data.rowsAffected[0] == 1) {
                                const dbVerifyEmailResponse: DbVerifyEmailResponse = { verificationSuccessful: true };
                                return resolve(dbVerifyEmailResponse);
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

}

export const verificationModel: VerificationModel = new VerificationModel();