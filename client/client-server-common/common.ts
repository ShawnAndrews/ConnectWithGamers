const MIN_USER_LEN = 5, MAX_USER_LEN = 16;
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160;

export interface Config {
    useStrictlyHttps: boolean;
    httpPort: number;
    httpsPort: number;
    chatPort: number;
    chatHistoryCount: number;
    connectionStrings: {
        local: string,
        remote: string
    };
    token_expiration: number; // 15m
    token_remember_expiration: number; // 1day
    token_length: number; // 32characters
    igdb: {
        key: string,
        pageLimit: number
    };
    steam: {
        apiURL: string,
        nonApiURL: string,
        appURL: string
    };
    imgur: {
        clientId: string
    };
    smtp: {
        host: string,
        secure: boolean,
        username: string,
        password: string
    };
    https?: {
        key: string,
        cert: string,
        ca: string;
    };
}

export const enum CHATROOM_EVENTS {
    Usercount = "usercount",
    Message = "message",
    MessageHistory = "message-history",
    PostMessage = "post-message",
    User = "user",
}

export const AUTH_TOKEN_NAME = `authToken`;

export const CHAT_SERVER_PORT = 81;

export function validateUsername(username: string): string {
    if (username === undefined) {
        return `Username not found.`;
    } else if (username.length > MAX_USER_LEN) {
        return `Username too long. Must be at most ${MAX_USER_LEN} characters.`;
    } else if (username.length < MIN_USER_LEN) {
        return `Username too short. Must be at least ${MIN_USER_LEN} characters.`;
    } else {
        return undefined;
    }
}

export function validatePassword(password: string): string {
    if (password === undefined) {
        return `Password not found.`;
    } else if (password.length > MAX_PASS_LEN) {
        return `Password too long. Must be at most ${MAX_PASS_LEN} characters.`;
    } else if (password.length < MIN_PASS_LEN) {
        return `Password too short. Must be at least ${MIN_PASS_LEN} characters.`;
    } else {
        return undefined;
    }
}

export function validateEmail(email: string): string {
    if (email !== undefined) {
        if (email !== ``) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(email.toLowerCase())) {
                return `Email is not in a valid format.`;
            }
        } else {
            return `No email address provided.`;
        }
    }
    return undefined;
}

export function validateURL(url: string): string {
    const pattern = new RegExp(`^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$`);
    if (!pattern.test(url)) {
        return `Invalid URL link entered.`;
    } else {
        return undefined;
    }
}

export function validateCredentials(username: string, password: string, email?: string, remember?: boolean): string {
    let error;

    // username validation
    error = validateUsername(username);
    if (error) {
        return error;
    }

    // password validation
    error = validatePassword(password);
    if (error) {
        return error;
    }

    // email validation
    error = validateEmail(email);
    if (error) {
        return error;
    }

    // remember me validation
    if (remember) {
        if (!Boolean(remember)) {
            return `Remember me is not a boolean.`;
        }
    }

    return undefined;

}

export interface ChatroomUser {
    username: string;
    last_active: number;
    steam_url?: string;
    twitch_url?: string;
    discord_url?: string;
    image?: string;
}

export interface DbAccountInfoResponse {
    username: string;
    steam_url?: string;
    twitch_url?: string;
    discord_url?: string;
    image?: string;
}

export interface DatalessResponse {
    error: string;
}

export interface DbAuthenticateResponse {
    username: string;
    remember: boolean;
}

export interface DbTokenResponse {
    token: string;
    tokenExpiration: Date;
}

export interface DbAuthorizeResponse {
    accountid: number;
}

export interface DbVerifyEmailResponse {
    verificationSuccessful: boolean;
}

export interface DbAccountSettingsResponse {
    username: string;
    email: string;
    discord: string;
    steam: string;
    twitch: string;
    image: string;
    emailVerified: boolean;
}

export interface DbAccountImageResponse {
    link: string;
}

export interface GenericResponseModel {
    error: string;
    data: any;
}

export interface SingleChatHistory {
    name: string;
    date: Date;
    text: string;
    image: string;
}

export interface AccountSettingsResponse {
    error: string;
    data?: {
        username: string;
        email: string;
        discord: string;
        steam: string;
        twitch: string;
        image: string;
        emailVerified: boolean;
    };
}

export interface EmailVerifyResponse {
    error: string;
    data?: {
        verificationSuccessful: boolean;
    };
}

export interface AccountImageResponse {
    error: string;
    link?: string;
}

export interface ChatHistoryResponse {
    name: string[];
    date: string[];
    text: string[];
    image: string[];
}

export interface GameListEntryResponse {
    name: string;
    id: number;
}

export interface SearchGamesResponse {
    error: string;
    data?: GameListEntryResponse[];
}

export const GameListEntryResponseFields: string[] = [`id`, `name`];

export interface SteamAPIReview {
    text: string;
    hours_played: number;
    up_votes: number;
}

export interface GameResponse {
    name: string;
    rating?: number;
    rating_count?: number;
    price?: string;
    discount_percent?: number;
    steam_url?: string;
    cover?: string;
    summary?: string;
    genre_ids?: number;
    genres?: string[];
    platform_ids?: number[];
    platforms?: string[];
    platforms_release_dates?: string[];
    next_release_date?: string;
    screenshots?: string[];
    video?: {
        name: string;
        youtube_link: string;
    };
    reviews?: SteamAPIReview[];
}

export const GameResponseFields: string[] = [`name`, `release_dates`, `cover`, `total_rating`, `total_rating_count`, `summary`, `genres`, `platforms`, `screenshots`, `videos`, `external`];

export interface SingleGameResponse {
    error: string;
    data?: GameResponse;
}

export interface UpcomingGameResponse {

    id: number;
    name: string;
    next_release_date: string;
    genres: string;
    linkIcons: string[];
    steam_url?: string;
    cover?: string;
}

export const UpcomingGameResponseFields: string[] = [`id`, `name`, `release_dates.date`, `cover`, `genres`, `platforms`, `external`];

export interface UpcomingGamesResponse {
    error: string;
    data?: UpcomingGameResponse[];
}

export interface RecentGameResponse {

    id: number;
    name: string;
    last_release_date: string;
    genres: string;
    linkIcons: string[];
    steam_url?: string;
    cover?: string;
}

export const RecentGameResponseFields: string[] = [`id`, `name`, `release_dates.date`, `cover`, `genres`, `platforms`, `external`];

export interface RecentGamesResponse {
    error: string;
    data?: RecentGameResponse[];
}

export interface GenrePair {
    id: number;
    name: string;
}

export interface GenreListResponse {
    error: string;
    data?: GenrePair[];
}

export interface PlatformGamesResponse {
    error: string;
    data?: DbPlatformGamesResponse;
}

export interface DbPlatformGamesResponse {
    platformName: string;
    platformGames: PlatformGame[];
}

export interface PlatformGame {

    id: number;
    name: string;
    rating: string;
    genres: string;
    linkIcons: string[];
    steam_url?: string;
    cover?: string;
}

export const PlatformGameResponseFields: string[] = [`id`, `name`, `rating`, `cover`, `genres`, `platforms`, `external`];

export interface GenreGamesResponse {
    error: string;
    data?: DbGenreGamesResponse;
}

export interface DbGenreGamesResponse {
    genreName: string;
    genreGames: GenreGame[];
}

export interface GenreGame {

    id: number;
    name: string;
    rating: string;
    genres: string;
    linkIcons: string[];
    steam_url?: string;
    cover?: string;
}

export const GenreGameResponseFields: string[] = [`id`, `name`, `rating`, `cover`, `genres`, `platforms`, `external`];

export interface SteamAPIGetPriceInfoResponse {
    price: string;
    discount_percent: number;
    steam_url: string;
}

export interface SteamAPIGetReviewsResponse {
    reviews?: SteamAPIReview[];
}