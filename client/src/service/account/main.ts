import axios from 'axios';
import { ResponseModel } from '../../../../client/client-server-common/common';

export function httpAccountSettings (): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/settings')
        .then((result) => {
            console.log(`LEN: ${result.data.errors.length}`);
            if (result.data.errors.length === 0) {
                return resolve(result.data);
            } else {
                return reject(result.data);
            }
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}. Exiting program now.`);
            process.exit(1);
        });
    }); 
}

export function httpLogin (username: string, password: string, remember: boolean): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/login', {
            username: username,
            password: password,
            remember: remember
        })
        .then((result) => {
            if (result.data === ``) {
                return resolve(result.data);
            } else {
                return reject(result.data);
            }
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}. Exiting program now.`);
            process.exit(1);
        });
    }); 
}

export function httpSignup (username: string, password: string, email: string): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/signup', {
            username: username,
            password: password,
            email: email
        })
        .then((result) => {
            if (result.data.errors.length > 0) {
                return reject(result.data);
            } else {
                return resolve(result.data);
            }
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}. Exiting program now.`);
            process.exit(1);
        });
    }); 
}

export function httpChangeAccountUsername (newUsername: string): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/username`, { newUsername })
        .then((result) => {
            if (result.data.errors !== []) {
                return reject(result.data);
            } else {
                return resolve();
            }
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}. Exiting program now.`);
            process.exit(1);
        });
    }); 
}

export function httpChangeAccountEmail (newEmail: string): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/email`, { newEmail })
        .then((result) => {
            if (result.data.errors !== []) {
                return reject(result.data);
            } else {
                return resolve();
            }
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}. Exiting program now.`);
            process.exit(1);
        });
    }); 
}

export function httpChangeAccountDiscord (newDiscord: string): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/discord`, { newDiscord })
        .then((result) => {
            return resolve();
        })
        .catch((err) => {
            return resolve(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpChangeAccountSteam (newSteam: string): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/steam`, { newSteam })
        .then((result) => {
            return resolve();
        })
        .catch((err) => {
            return resolve(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpChangeAccountTwitch (newTwitch: string): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/twitch`, { newTwitch })
        .then((result) => {
            return resolve();
        })
        .catch((err) => {
            return resolve(`HTTP error: ${err}.`);
        });
    }); 
}