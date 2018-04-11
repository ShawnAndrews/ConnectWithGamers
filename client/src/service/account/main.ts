import axios from 'axios';
import { GenericResponseModel, AccountImageResponse, EmailVerifyResponse } from '../../../../client/client-server-common/common';

export function httpAccountSettings (): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/settings')
        .then((result) => {
            if (result.data.error) {
                return reject(`Failed to retrieve account settings. ${result.data.error}`);
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

export function httpChangeAccountSettings (newSettings: any): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/change`, { newSettings })
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

export function httpVerifyEmail (verificationCode: string): Promise<EmailVerifyResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/email/verify', { verificationCode: verificationCode })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const emailVerifyResponse: EmailVerifyResponse = result.data;
                return resolve(emailVerifyResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpResendAccountEmail (): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/email/resend`)
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

export function httpChangeAccountImage (imageBase64: string): Promise<AccountImageResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/image/change`, encodeURIComponent(imageBase64))
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const accountImageResponse: AccountImageResponse = result.data;
                return resolve(accountImageResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

export function httpDeleteAccountImage (): Promise<AccountImageResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/image/delete`, {})
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const accountImageResponse: AccountImageResponse = result.data;
                return resolve(accountImageResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}