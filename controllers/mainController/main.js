const express = require('express');
const registerController = require('../registerController/register')
const tokenController = require('../tokenController/token')
const routeModel = require('../../models/routemodel')

let router = express.Router();
let routes = new routeModel();

/* routes */
routes.addRoute('register', '/register');
routes.addRoute('token', '/getToken');

/* TODO: authorized route access middleware */

/* registration controller */
router.use(routes.getRoute('register'), registerController);

/* token controller */
router.use(routes.getRoute('token'), tokenController);

module.exports = router;