import axios from 'axios';
import { GenericResponseModel, AccountImageResponse, EmailVerifyResponse, TwitchIdResponse, SteamIdResponse, DiscordLinkResponse, SteamFriendsResponse, TwitchFollowersResponse } from '../../../../client/client-server-common/common';

/**
 * HTTP request to get account settings.
 */
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

/**
 * HTTP request to verify login credentials.
 */
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

/**
 * HTTP request to create an account.
 */
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

/**
 * HTTP request to change account settings.
 */
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

/**
 * HTTP request to verify email code in URL. 
 */
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

/**
 * HTTP request to send verification email.
 */
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

/**
 * HTTP request to change account's profile picture.
 */
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

/**
 * HTTP request to delete account's profile picture.
 */
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

/**
 * HTTP request to get an account's Twitch id.
 */

export function httpGetAccountTwitchId(): Promise<TwitchIdResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/twitchId`, {})
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const twitchIdResponse: TwitchIdResponse = result.data;
                return resolve(twitchIdResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to get an account's Twitch id.
 */

export function httpGetAccountTwitchFollowers(): Promise<TwitchFollowersResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/twitchFollowers`, {})
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const twitchFollowersResponse: TwitchFollowersResponse = result.data;
                return resolve(twitchFollowersResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to get an account's Steam id.
 */

export function httpGetAccountSteamId(): Promise<SteamIdResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/steamId`, {})
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const steamIdResponse: SteamIdResponse = result.data;
                return resolve(steamIdResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to get an account's Steam id.
 */

export function httpGetAccountSteamFriends(): Promise<SteamFriendsResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/steamFriends`, {})
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const steamFriendsResponse: SteamFriendsResponse = result.data;
                return resolve(steamFriendsResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to get an account's Discord link.
 */

export function httpGetAccountDiscordLink(): Promise<DiscordLinkResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/account/settings/discordLink`, {})
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const discordLinkResponse: DiscordLinkResponse = result.data;
                return resolve(discordLinkResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}