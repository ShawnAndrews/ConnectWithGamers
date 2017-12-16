const express = require('express');
const app = express();
const OAuth2Server = require('oauth2-server');
const oauth = new OAuth2Server({ model: require('./oauth2/PasswordModel')});
const path = require('path');
const bodyParser = require('body-parser')

// parse POST body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// const model = {
//   // We support returning promises.
//   getAccessToken: (accessToken) => {
//     console.log("Called getAccessToken()");
//     return {
//       accessToken: accessToken,
//       accessTokenExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//       scope: 1,
//       client: {client_id: 5}, // with 'id' property
//       user: {}
//     };
//   },

//   // Or, calling a Node-style callback.
//   getAuthorizationCode: function(done) {
//     console.log("Called getAuthorizationCode()");
//     return "53454343";
//   },

//   getUserFromClient: (client) => {
//     // imaginary DB query
//     console.log("Called getUserFromClient()");
//   },

//   getClient: (clientId, clientSecret) => {
//     console.log("Called getClient()");
//     // imaginary DB query
//     let params = {client_id: clientId};
//     if (clientSecret) {
//       params.client_secret = clientSecret;
//     }
//   },

//   saveAuthorizationCode: function(code, client, user) {
//     console.log("Called saveAuthorizationCode()");
//     // imaginary DB queries
//     let authCode = {
//       authorization_code: code.authorizationCode,
//       expires_at: code.expiresAt,
//       redirect_uri: code.redirectUri,
//       scope: code.scope,
//       client_id: client.id,
//       user_id: user.id
//     };
//     console.log("Auth code: ", authCode);
//   }
  
// };

// const oauth = new OAuth2Server({
//   model: model
// });

// let request = new OAuth2Server.Request({
//   method: 'GET',
//   query: {client_id: 3},
//   headers: {Authorization: 'Bearer foobar'}
// });

// let response = new OAuth2Server.Response({
//   headers: {}
// });

// oauth.authenticate(request, response)
//   .then((token) => {
//     console.log("Successful authentication, returning access token: ", token);
//   })
//   .catch((err) => {
//     console.log("Failed authentication with error", err);
//   });


//   app.post('/getToken', function (req, res) {
//     res.cookie(('token', '3435GFDGDF4534', {expires: new Date(Date.now() + 3600000), httpOnly: true}))
//     // req.method = 'POST',
//     // req.query = {client_id: 3},
//     // req.headers = {Authorization: 'Bearer foobar'}
//     let request = new OAuth2Server.Request(req);
//     var response = new OAuth2Server.Response(res);
//     console.log(request);
//     console.log("Got token request!");
  
//     oauth.token(request, response)
//       .then(function(token) {
//         res.send(`Token is ${token}`);
//       })
//       .catch(function(err) {
//         console.log("Failed authentication with error", err);
//         res.send(`Failed authentication with error ${err}.`);
//       });
//   })
  
// app.post('/restricted', function (req, res) {
//   res.cookie(('token', '3435GFDGDF4534', {expires: new Date(Date.now() + 3600000), httpOnly: true}))
//   // req.method = 'POST',
//   // req.query = {client_id: 3},
//   // req.headers = {Authorization: 'Bearer foobar'}
//   let request = new OAuth2Server.Request(req);
//   var response = new OAuth2Server.Response(res);
//   console.log(req);
//   console.log("Got token request!");

//   oauth.authenticate(request, response)
//     .then(function(token) {
//       res.send(`Token is ${token}`);
//     })
//     .catch(function(err) {
//       console.log("Failed authentication with error", err);
//       res.send(`Failed authentication with error ${err}.`);
//     });
// })

app.post('/getToken', (req, res) => {
  console.log('Received token request!');

  res.cookie(('token', '3435GFDGDF4534', {expires: new Date(Date.now() + 3600000), httpOnly: true}));

  let request = new OAuth2Server.Request(req);
  let response = new OAuth2Server.Response(res);
  const options = {requireClientAuthentication: {password: false}};
  oauth.token(request, response, options)
    .then(function(token) {
      console.log(`Response to token request ${token}`);
      res.send(`Token is ${JSON.stringify(token)}`);
    })
    .catch(function(err) {
      console.log("Failed authentication with error", err);
      res.send(`Failed authentication with error # ${err}.`);
    }
  );

});

// controllers
var apiV1Controller = require('./controllers/apiV1Controller.js');

// routes
app.get('/bundle.js', function(req, res) {res.sendFile(path.join(__dirname, 'client/dist/bundle.js'))});
app.get('/bundle.css', function(req, res) {res.sendFile(path.join(__dirname, 'client/dist/bundle.css'))});
app.use('/api/v1', apiV1Controller);
app.use('*', express.static(path.join(__dirname, 'client/dist')));

// listen
app.listen(9003, function () {
  console.log('Example app listening on port 9003!');
  console.log('Directory: ' + path.join(__dirname, 'client/dist'));

  const the_interval = 1 * 60 * 1000;
  setInterval(function() {
    // console.log("Checking time: ", (new Date()).toLocaleString());
  }, the_interval);

});
