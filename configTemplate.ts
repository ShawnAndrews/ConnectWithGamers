import { Config } from "./client/client-server-common/common";

const config: Config = {
    useStrictlyHttps: false,
    httpPort: 80,
    httpsPort: 443,
    chatPort: 81,
    chatHistoryCount: 100,
    connectionStrings: {
        local: "",
        remote: "",
    },
    token_expiration: 900000, // 15m
    token_remember_expiration: 86400000, // 1day
    token_length: 32, // 32characters
    igdb: {
        apiURL: "https://api-v3.igdb.com",
        key: "",
        pageLimit: 50
    },
    steam: {
        apiURL: "http://store.steampowered.com/api",
        nonApiURL: "http://store.steampowered.com",
        appURL: "http://store.steampowered.com/app",
        key: ""
    },
    twitch: {
        clientId: ""
    },
    imgur: {
        clientId: ""
    },
    smtp: {
        host: "",
        secure: false,
        username: "",
        password: ""
    },
    https: {
        key: `./key.pem`,
        cert: `./certificate.crt`,
        ca: `./bundle.ca-bundle`
    },
    mysql: {
        host: "",
        user: "",
        password: "",
        database: "",
        insecureAuth: true
    }
};

export default config;