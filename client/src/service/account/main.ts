import axios from 'axios';
import { GenericModelResponse, AccountImageResponse, EmailVerifiedFlagResponse, EmailRecoveryVerifyResponse, AccountInfoResponse, DatalessResponse, GameSuggestion, GameSuggestionsResponse } from '../../../../client/client-server-common/common';
import { AUTH_TOKEN_NAME } from '../../../client-server-common/common';
import { SettingsData } from '../../../src/account/settings/SettingsFormsContainer';

/**
 * HTTP request to recover password.
 */
export function httpGetPublicAccountInfo (): Promise<AccountInfoResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/account/public/info')
        .then((result) => {
            if (result.data.error) {
                return reject(`Failed to get public account info. ${result.data.error}`);
            } else {
                const AccountInfoResponse: AccountInfoResponse = result.data;
                return resolve(AccountInfoResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to recover password.
 */
export function httpRecoverPassword (password: string, uid: string): Promise<DatalessResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/account/recover/password', { password: password, uid: uid })
        .then((result) => {
            if (result.data.error) {
                return reject(`Failed to change password via account recovery. ${result.data.error}`);
            } else {
                return resolve(result.data);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to verify account recovery link.
 */
export function httpVerifyRecoveryLink (uid: string): Promise<EmailRecoveryVerifyResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/account/email/recovery/verify', { uid: uid })
        .then((result) => {
            if (result.data.error) {
                return reject(`Failed to change password via account recovery. ${result.data.error}`);
            } else {
                return resolve(result.data);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to get account settings.
 */
export function httpAccountSettings(): Promise<AccountInfoResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/account/settings')
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

/**
 * HTTP request to verify login credentials.
 */
export function httpLogin (username: string, password: string, remember: boolean): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/account/login', {
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

/**
 * HTTP request to create an account.
 */
export function httpSignup (username: string, password: string, email: string): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/account/signup', {
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

/**
 * HTTP request to change account settings.
 */
export function httpChangeAccountInfo (newSettings: SettingsData): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/api/account/settings/change`, { newSettings })
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

/**
 * HTTP request to verify email code in URL. 
 */
export function httpVerifyEmail (verificationCode: string): Promise<EmailVerifiedFlagResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/account/email/verify', { verificationCode: verificationCode })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const EmailVerifiedFlagResponse: EmailVerifiedFlagResponse = result.data;
                return resolve(EmailVerifiedFlagResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to send verification email.
 */
export function httpResendAccountEmail (): Promise<null> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/api/account/email/resend`)
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

/**
 * HTTP request to change account's profile picture.
 */
export function httpChangeAccountImage (imageBase64: string, fileExtension: string): Promise<GenericModelResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/api/account/settings/image/change`, { imageBase64: imageBase64, fileExtension: fileExtension })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const accountImageResponse: GenericModelResponse = result.data;
                return resolve(accountImageResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to delete account's profile picture.
 */
export function httpDeleteAccountImage (): Promise<AccountImageResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/api/account/settings/image/delete`, {})
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

/**
 * HTTP request to get the full list of game suggestions.
 */
export function httpGetGameSuggestions(): Promise<GameSuggestionsResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/api/steam/gamesuggestions')
        .then((result) => {
            if (result.data.error) {
                return reject(`Failed to retrieve game suggestions. ${result.data.error}`);
            } else {
                const gameSuggesstionsResponse: GameSuggestionsResponse = result.data;
                return resolve(gameSuggesstionsResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * Check if an account is logged in via cookie
 */

export function loggedIn(): boolean {
    const loggedIn: boolean = document.cookie.indexOf(`${AUTH_TOKEN_NAME}=`) !== -1;
    return loggedIn;
}

/**
 * Logout of an account
 */

export function logout(): void {
    document.cookie = `${AUTH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}