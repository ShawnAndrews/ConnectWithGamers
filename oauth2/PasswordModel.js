
/**
 * Login authentication flow: getClient -> getUser -> generateAccessToken -> saveToken
 * 
 */
const PasswordModel = {

    getClient: (clientId, clientSecret) => {
        console.log(`Called getClient with clientId=${clientId} and clientSecret=${clientSecret}`);
        return {id: '123', name: 'Shawn', grants: ['password']};
    },

    getUser: (username, password) => {
        console.log(`Called getUser with username=${username} and password=${password}`);
        return {name: 'John'};
    },

    saveToken: (token, client, user) => {
        console.log('Called saveToken');
        return {accessToken: token, client: client, user: user};
    },

}

module.exports = PasswordModel;