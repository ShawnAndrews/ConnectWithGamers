const config = require('./config')
const express = require('express');
const app = express();
const db = require('./models/db');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mainController = require('./controllers/mainController/main')
const accountController = require('./controllers/accountController/account')

/* parse post body */ 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* enable cookies  */
app.use(cookieParser());

/* account authentication controller */
app.use('/account', accountController);

/* oauth rest api controller */
app.use('/v1', mainController);

/* client */
app.get('/bundle.js', function(req, res) {res.sendFile(path.join(__dirname, 'client/dist/bundle.js'))});
app.get('/bundle.css', function(req, res) {res.sendFile(path.join(__dirname, 'client/dist/bundle.css'))});
app.use('*', express.static(path.join(__dirname, 'client/dist')));

/* listen */
app.listen(config.serverPort, function () {
  console.log('Example app listening on port 9003!');
  console.log('Directory: ' + path.join(__dirname, 'client/dist'));

  // connect to db
  db.connect(config.connectionStrings['local'])
    .then((res) => {
      console.log(`Successfully connected to database.`);
    })
    .catch((err) => {
      console.log(`Error connecting to db: ${err}. Shutting down now.`);
      process.exit();
    });

  // const the_interval = 1 * 30 * 1000;
  // setInterval(function() {
  //    console.log("Checking time: ", JSON.stringify(db));
  // }, the_interval);

});