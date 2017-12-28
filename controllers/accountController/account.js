const routeModel = require('../../models/routemodel')
const bcrypt = require('bcrypt');
const express = require('express');
const HttpStatus = require('http-status-codes');
const router = express.Router();
const salt = bcrypt.genSaltSync(10);
const routes = new routeModel();

const MIN_USER_LEN = 4, MAX_USER_LEN = 16
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160

/* routes */
routes.addRoute('register', '/register');
routes.addRoute('login', '/login');



router.post(routes.getRoute('register'), (req, res) => {
    
    res.send(`Registration successful!`);

})

router.post(routes.getRoute('login'), (req, res) => {
    
    // validate username and password
    let result = validateCredentials(req.body.username, req.body.password);
    if(!result.error)
    {
        res
        .status(HttpStatus.OK)
        .send('ok');
    }
    else
    {
        res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
            error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

})

function validateCredentials(username, password){
    let response = {error: false, errorMessage: ''}

    console.log('Login attempt:');
    console.log(`username is '${username}'`);
    console.log(`password is '${password}'`);

    // username validation
    if(username == undefined)
    {
        response.error = true;
        response.errorMessage = `Username not found.`;
    }
    else if(username.length > MAX_USER_LEN)
    {
        response.error = true;
        response.errorMessage = `Username too long. Must be at most ${MAX_USER_LEN} characters.`;
    }
    else if(username.length < MIN_USER_LEN)
    {
        response.error = true;
        response.errorMessage = `Username too short. Must be at least ${MIN_USER_LEN} characters.`;
    }

    // password validation
    if(password == undefined)
    {
        response.error = true;
        response.errorMessage = `Password not found.`;
    }
    else if(password.length > MAX_PASS_LEN)
    {
        response.error = true;
        response.errorMessage = `Password too long. Must be at most ${MAX_PASS_LEN} characters.`;
    }
    else if(password.length < MIN_PASS_LEN)
    {
        response.error = true;
        response.errorMessage = `Password too short. Must be at least ${MIN_PASS_LEN} characters.`;
    }

    return response;

}

module.exports = router;