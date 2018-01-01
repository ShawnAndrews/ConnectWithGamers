const routeModel = require('../../models/routemodel');
const express = require('express');
const HttpStatus = require('http-status-codes');
const RateLimit = require('express-rate-limit');
const db = require('../../models/db');
const bcrypt = require('bcrypt');
const common = require('../../client/client-server-common/common');
const router = express.Router();
const routes = new routeModel();
const LOGIN_COOKIE_NAME = 'login_token';

/* routes */
routes.addRoute('signup', '/signup');
routes.addRoute('login', '/login');

// limit account creation requests to 5acc/1hr
var createAccountLimiter = new RateLimit({
    windowMs: 60*60*1000,
    max: 5,
    delayMs: 0
  });

//router.post(routes.getRoute('signup'), createAccountLimiter);
router.post(routes.getRoute('signup'), (req, res) => {

    let user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    // validate
    const result = common.validateCredentials(user.username, user.password, user.email);
    if(result.error)
    {
        return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
            error: result.errorMessage
        });
    }

    // create account in db
    db.createAccount(user.username, user.email, user.password)
        .then((result) => {
            return res
            .status(HttpStatus.OK)
            .send(result);
            return;
        })
        .catch((err) => {
            return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({
                error: err
            });
        });

})

router.post(routes.getRoute('login'), (req, res) => {

    // validate credentials
    const result = common.validateCredentials(req.body.username, req.body.password, null, req.body.remember);
    if(result.error)
    {
        return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
            error: result.errorMessage
        });
    }
    
    // authenticate
    db.authenticate(req.body.username, req.body.password, req.body.remember)
        .then( (result) => {
            console.log('auth then: ', JSON.stringify(result));
            return db.token(result.username, result.remember);
        })
        .then((result) => {
            console.log('auth2 then: ', JSON.stringify(result));
            return res
            .cookie(LOGIN_COOKIE_NAME, result.token, { expires: result.tokenExpiration, httpOnly: true })
            .status(HttpStatus.OK)
            .send();
        })
        .catch((result) => {
            console.log('auth catch: ', JSON.stringify(result));
            if(result.error){
                return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    error: result.message
                });
            }
            else
            {
                return res
                .status(HttpStatus.OK)
                .send(result.message);
            }
        });

})

module.exports = router;