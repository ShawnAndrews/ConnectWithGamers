const config = require('../config')
const bcrypt = require('bcrypt');
const DatabaseBase = require('./dbBase');

const TOKEN_LEN = 40;
const SALT_RNDS = 10;

class DatabaseModel extends DatabaseBase {

    constructor() {
        super();
    }

    createAccount(username, email, password){

        const salt = bcrypt.genSaltSync(SALT_RNDS);
        const hash = bcrypt.hashSync(password, salt);

        // return promise
        return new Promise( (resolve, reject) => {
            
            this.insert("dbo.accounts",
                ['username', 'email', 'passwordHash', 'salt', 'createdOn'],
                [this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.DateTime], 
                [username, email, hash, salt, Date.now()])
                .then(() => {
                    return resolve({error: false});
                })
                .catch(() => {
                    return resolve({error: true, message: 'Username is taken.'});
                });

        });
    }

    authenticate(username, password, remember){

        return new Promise( (resolve, reject) => {
            
            // execute username lookup
            const sql = 'SELECT passwordHash from dbo.accounts WHERE username=@username';
            const ps = new this.sql.PreparedStatement();
            ps.input('username', this.sql.VarChar);
            ps.prepare(sql, (err) => {
                if (err) return reject({ error: true, message: err});
                ps.execute({username: username}, (err, result) => {
                    if (err) return reject({ error: true, message: err});
                    ps.unprepare((err) => {
                        if (err)
                        {
                            return reject({ error: true, message: err});
                        }
                        else
                        {
                            if(result.recordsets[0].length > 0)
                            {
                                const dbPasswordHash = result.recordsets[0][0].passwordHash;
                                if(bcrypt.compareSync(password, dbPasswordHash)) {
                                    return resolve({username: username, remember: remember});
                                }
                                else
                                {
                                    return reject({ error: false, message: 'Incorrect username or password.'});
                                }    
                            }
                            else
                            {
                                return reject({ error: false, message: 'Incorrect username or password.'});
                            }

                        }
                    })
                });
            })

        });

    }

    token(username, remember){

        console.log("token...");

        let generate_token = (length) => {
            var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
            var b = [];  
            for (var i=0; i<length; i++) {
                var j = (Math.random() * (a.length-1)).toFixed(0);
                b[i] = a[j];
            }
            return b.join("");
        }

        let getAccountIdPromise = () => {

            return new Promise((resolve, reject) => {

                this.select(
                    "dbo.accounts",
                    ['username'],
                    [this.sql.VarChar], 
                    [username],
                    ['accountid'],
                    'username=@username')
                    .then((result) => {
                        if(result.recordsets[0].length > 0)
                        {
                            let dbAccountid = Number(result.recordsets[0][0].accountid);
                            return resolve(dbAccountid);
                        }
                        else
                        {
                            return reject({error: false, message: 'Incorrect username or password.'});
                        }
                    })
                    .catch((err) => {
                        return reject({error: true, message: err});
                    });

            });
        } 
        
        let getAccountTokenPromise = (dbAccountid) => { 

            return new Promise((resolve, reject) => {

                this.select(
                    "dbo.tokens",
                    ['accountid'],
                    [this.sql.Int], 
                    [dbAccountid],
                    ['tokenHash'],
                    'accountid=@accountid')
                    .then((result) => {
                        if(result.recordsets[0].length > 0)
                        {
                            return resolve({tokenFound: true, dbAccountid: dbAccountid});
                        }
                        else
                        {
                            return resolve({tokenFound: false, dbAccountid: dbAccountid});
                        }
                    })
                    .catch((err) => {
                        return reject({error: true, message: err});
                    });

            });

        }

        let insertTokenPromise = (dbAccountid) => {

            // return promise
            return new Promise( (resolve, reject) => {
                        
                const token = generate_token(TOKEN_LEN);
                const tokenSalt = bcrypt.genSaltSync(10);

                this.insert(
                    "dbo.tokens",
                    ['accountid', 'tokenHash', 'salt', 'createdOn'],
                    [this.sql.Int, this.sql.VarChar, this.sql.VarChar, this.sql.DateTime], 
                    [dbAccountid, bcrypt.hashSync(token, tokenSalt), tokenSalt, Date.now()])
                    .then(() => {
                        console.log('inserted token!');
                        let tokenExpiration = null;
                        if(remember == true)
                        {
                            tokenExpiration = new Date(Date.now() + config.token_remember_expiration);
                        }
                        else
                        {
                            tokenExpiration = new Date(Date.now() + config.token_expiration);
                        }
                        return resolve({token: token, tokenExpiration: tokenExpiration});
                    })
                    .catch((err) => {
                        return reject({error: true, message: err});
                    });

            });

        }

        let updateTokenPromise = (dbAccountid) => {

            // return promise
            return new Promise( (resolve, reject) => {
                                    
                const token = generate_token(TOKEN_LEN);
                const tokenSalt = bcrypt.genSaltSync(10);

                this.update(
                    "dbo.tokens",
                    ['accountid', 'tokenHash', 'salt'],
                    [this.sql.Int, this.sql.VarChar, this.sql.VarChar], 
                    [dbAccountid, bcrypt.hashSync(token, tokenSalt), tokenSalt],
                    'accountid=@accountid')
                    .then(() => {
                        console.log('updated token!');
                        let tokenExpiration = null;
                        if(remember == true)
                        {
                            tokenExpiration = new Date(Date.now() + config.token_remember_expiration);
                        }
                        else
                        {
                            tokenExpiration = new Date(Date.now() + config.token_expiration);
                        }
                        return resolve({token: token, tokenExpiration: tokenExpiration});
                    })
                    .catch((err) => {
                        return reject({error: true, message: err});
                    });

            });

        }

        return getAccountIdPromise()
               .then( (dbAccountid) => {
                    console.log('looking for existing token');
                    return getAccountTokenPromise(dbAccountid);
               })
               .then( (result) => {
                   if(result.tokenFound){
                    console.log('token found. updating token');
                    return updateTokenPromise(result.dbAccountid);
                   }
                   else
                   {
                    console.log('token not found. inserting token');
                    return insertTokenPromise(result.dbAccountid);
                   }
                })

    }
    
};

var db = new DatabaseModel();

module.exports = db;