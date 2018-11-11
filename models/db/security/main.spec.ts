import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { securityModel } from "./main";
import { DbAuthenticateResponse, DbAuthorizeResponse, DbTokenResponse } from "../../../client/client-server-common/common";

describe("Security model", function() {

    it("authenticates an account", function() {
        const accountName: string = "Anonymous";
        const accountPassword: string = "123456";
        const accountRememberMe: boolean = false;
        const accountAuthenticationPromise: Promise<DbAuthenticateResponse> = securityModel.authenticate(accountName, accountPassword, accountRememberMe);

        return expect(accountAuthenticationPromise).to.eventually.be.fulfilled;
    });

    it("authorizes an account", function() {
        const accountCookie: string = "authToken=geQUp8CfnRYP5FagUqTKlGd2DRRRL4qo";
        const accountAuthorizePromise: Promise<DbAuthorizeResponse> = securityModel.authorize(accountCookie);

        return expect(accountAuthorizePromise).to.eventually.be.rejectedWith("Valid auth token not found in database");
    });

    it("issues new account token", function() {
        const accountName: string = "Anonymous";
        const accountRememberMe: boolean = false;
        const accountAuthorizePromise: Promise<DbTokenResponse> = securityModel.token(accountName, accountRememberMe);

        return expect(accountAuthorizePromise).to.eventually.be.fulfilled;
    });

});