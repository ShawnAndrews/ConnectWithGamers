let bcrypt = require('bcrypt');
let express = require('express');
let router = express.Router();
let salt = bcrypt.genSaltSync(10);

const MIN_USER_LEN = 4, MAX_USER_LEN = 16
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160

router.post('/', (req, res) => {
    
    // validate username and password
    validateCredentials(req)
    .then((msg) => {
        res.send(`Success!`);
    })
    .catch((err) => {
        res.status(500).send(err)
    })

})

function validateCredentials(req){
    let username = req.body.username;
    let password = req.body.password;

    return new Promise((resolve, reject) => {

        console.log(`username is '${username}'`);
        console.log(`password is '${password}'`);

        // username validation
        if(username == undefined)
        {
            reject(`Username not found.`);
        }
        elseif(username.length > MAX_USER_LEN)
        {
            reject(`Username too long. Must be at most ${MAX_USER_LEN} characters.`);
        }
        elseif(username.length < MIN_USER_LEN)
        {
            reject(`Username too short. Must be at least ${MAX_USER_LEN} characters.`);
        }

        // password validation
        if(password == undefined)
        {
            console.log('hit');
            reject(`Password not found.`);
        }
        elseif(password.length > MAX_PASS_LEN)
        {
            reject(`Password too long. Must be at most ${MAX_PASS_LEN} characters.`);
        }
        elseif(password.length < MIN_PASS_LEN)
        {
            reject(`Password too short. Must be at least ${MIN_PASS_LEN} characters.`);
        }

        resolve("Success");
    })

    // password validation


}

module.exports = router;