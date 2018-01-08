const express = require("express");
const HttpStatus = require("http-status-codes");
const RateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const router = express.Router();
import { validateCredentials, ResponseModel } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";

const LOGIN_COOKIE_NAME = "login_token";
const routes = new routeModel();

/* routes */
routes.addRoute("signup", "/signup");
routes.addRoute("login", "/login");

// limit account creation requests to 5acc/1hr
const createAccountLimiter = new RateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    delayMs: 0
  });

// router.post(routes.getRoute("signup"), createAccountLimiter);
router.post(routes.getRoute("signup"), (req: any, res: any) => {

    const signupData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    // validate
    const response: ResponseModel = validateCredentials(signupData.username, signupData.password, signupData.email);
    if (response.errors.length > 0) {
        return res
        .send(response);
    }

    // create account in db
    db.createAccount(signupData.username, signupData.email, signupData.password)
        .then((response: ResponseModel) => {
            return res
            .send(response);
        })
        .catch((response: ResponseModel) => {
            return res
            .send(response);
        });

});

router.post(routes.getRoute("login"), (req: any, res: any) => {

    // validate credentials
    const response: ResponseModel = validateCredentials(req.body.username, req.body.password, undefined, req.body.remember);
    if (response.errors.length > 0) {
        return res
        .send(response);
    }

    // authenticate
    db.authenticate(req.body.username, req.body.password, req.body.remember)
        .then( (result: ResponseModel) => {
            // authentication success
            console.log("auth then: ", JSON.stringify(result));
            return db.token(result.data.username, result.data.remember);
        })
        .then((result: ResponseModel) => {
            // token success
            console.log("auth2 then: ", JSON.stringify(result));
            return res
            .cookie(LOGIN_COOKIE_NAME, result.data.token, { expires: result.data.tokenExpiration, httpOnly: true })
            .send();
        })
        .catch((response: ResponseModel) => {
            // authentication or token failure
            console.log("auth error, catching: ", JSON.stringify(response));
            return res
            .send(response);
        });

});

export default router;