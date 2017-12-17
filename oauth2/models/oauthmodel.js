
/**
 * Get token flow: getClient -> getUserFromClient -> generateAccessToken(default) -> saveToken
 * 
 */
const oAuthModel = {

    getClient: (clientId, clientSecret) => {
        console.log(`Called getClient with clientId=${clientId}`);
        return {id: '123', name: 'Shawn', grants: ['client_credentials']};
    },

    getUserFromClient: (client) => {
        console.log(`Called getUserFromClient with client=${JSON.stringify(client)}`);
        return {username: 'John'};
    },

    saveToken: (token, client, user) => {
        console.log(`Called saveToken with token=${JSON.stringify(token)}, client=${JSON.stringify(client)}, user=${JSON.stringify(user)}`);
        return {accessToken: token, client: client, user: user};
    },

}

module.exports = oAuthModel;