const passwordModel = require('../../oauth2/models/oauthmodel');
const OAuth2Server = require('oauth2-server');
const express = require('express');

let router = express.Router();
let oauth = new OAuth2Server({ model: require('../../oauth2/models/oauthmodel')});

router.post('/', function (req, res) {
    res.cookie(('token', '3435GFDGDF4534', {expires: new Date(Date.now() + 3600000), httpOnly: true}))
    let request = new OAuth2Server.Request(req);
    var response = new OAuth2Server.Response(res);
    console.log(request);
    console.log("Got token request!");
  
    oauth.token(request, response)
      .then(function(token) {
        res.send(`Token is ${token}`);
      })
      .catch(function(err) {
        console.log("Failed authentication with error", err);
        res.send(`Failed authentication with error ${err}.`);
      });
})

module.exports = router;