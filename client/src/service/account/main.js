import axios from 'axios';

module.exports.httpLogin = (username, password, remember) => {
    return axios.post('/account/login', {
            username: username,
            password: password,
            remember: remember
        })
}

module.exports.httpSignup = (username, password, email) => {
    return axios.post('/account/signup', {
            username: username,
            password: password,
            email: email
        })
}