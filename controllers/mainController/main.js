const express = require('express');
const tokenController = require('../tokenController/token')
const routeModel = require('../../models/routemodel')

let router = express.Router();
let routes = new routeModel();

/* routes */
routes.addRoute('token', '/getToken');

/* TODO: authorized route access middleware */

/* token controller */
router.use(routes.getRoute('token'), tokenController);

module.exports = router;