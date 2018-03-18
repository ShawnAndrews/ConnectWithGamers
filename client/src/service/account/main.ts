import axios from 'axios';
import { GenericResponseModel } from '../../../../client/client-server-common/common';

export function httpAccountSettings (): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/settings')
        .then((result) => {
            if (result.data.error) {
                return reject(`Failed to retrieve account settings.`);
            } else {
                return resolve(result.data);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpLogin (username: string, password: string, remember: boolean): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/login', {
            username: username,
            password: password,
            remember: remember
        })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                return resolve();
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpSignup (username: string, password: string, email: string): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/signup', {
            username: username,
            password: password,
            email: email
        })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                return resolve();
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpChangeAccountUsername (newUsername: string): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/username`, { newUsername })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                return resolve();
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpChangeAccountEmail (newEmail: string): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/email`, { newEmail })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                return resolve();
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpChangeAccountDiscord (newDiscord: string): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/discord`, { newDiscord })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                return resolve();
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpChangeAccountSteam (newSteam: string): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/steam`, { newSteam })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                return resolve();
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpChangeAccountTwitch (newTwitch: string): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/change/twitch`, { newTwitch })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                return resolve();
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}