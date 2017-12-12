const express = require('express');
const app = express();
var path = require('path');

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
});
