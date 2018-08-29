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
        appURL: string,
        key: string
    };
    twitch: {
        clientId: string;
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
    UpdateUsers = "update-users",
    SearchUsers = "search-users",
    GetAllUsers = "get-all-users",
    Message = "message",
    MessageHistory = "message-history",
    GetMessageHistory = "get-message-history",
    PostMessage = "post-message",
    User = "user",
    Users = "users",
}

export interface ChatroomInfo {
    name: string;
    abbrevName: string;
    imagePath: string;
    redirect: string;
}

export const CHATROOMS: ChatroomInfo[] = [
    { name: "Hearthstone", abbrevName: "hearthstone", imagePath: "https://i.imgur.com/myONDFo.png", redirect: "/chat/hearthstone" },
    { name: "League Of Legends", abbrevName: "lol", imagePath: "https://i.imgur.com/AuOsUek.png", redirect: "/chat/lol" },
    { name: "Overwatch", abbrevName: "overwatch", imagePath: "https://i.imgur.com/3Bz1ihC.png", redirect: "/chat/overwatch" },
    { name: "World Of Warcraft", abbrevName: "wow", imagePath: "https://i.imgur.com/MAZIWSq.png", redirect: "/chat/wow" },
    { name: "Fortnite", abbrevName: "fortnite", imagePath: "https://i.imgur.com/LPIXnRA.png", redirect: "/chat/fortnite" },
    { name: "CS:GO", abbrevName: "csgo", imagePath: "https://i.imgur.com/nb1WjIZ.png", redirect: "/chat/csgo" },
    { name: "Dota 2", abbrevName: "dota", imagePath: "https://i.imgur.com/X36goZb.png", redirect: "/chat/dota" },
    { name: "Rocket League", abbrevName: "rocketleague", imagePath: "https://i.imgur.com/PhSJVeI.png", redirect: "/chat/rocketleague" },
    { name: "Path Of Exile", abbrevName: "poe", imagePath: "https://i.imgur.com/9PMfWDs.png", redirect: "/chat/poe" },
    { name: "Ark", abbrevName: "ark", imagePath: "https://i.imgur.com/h5GLvq8.png", redirect: "/chat/ark" },
    { name: "Runescape", abbrevName: "rs", imagePath: "https://i.imgur.com/ceu0g6q.png", redirect: "/chat/rs" },
    { name: "PlayerUnknown's Battlegrounds", abbrevName: "pubg", imagePath: "https://i.imgur.com/YzhdJ6V.png", redirect: "/chat/pubg" },
    { name: "Magic: The Gathering", abbrevName: "mtg", imagePath: "https://i.imgur.com/47MxMpu.png", redirect: "/chat/mtg" }
];

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

export interface AccountInfo {
    accountid: number;
    username: string;
    steam_url?: string;
    twitch_url?: string;
    discord_url?: string;
    image?: string;
}

export interface DbAccountsInfoResponse {
    accounts: AccountInfo[];
}

export interface DbAccountInfoResponse {
    account: AccountInfo;
}

export interface DbTwitchIdResponse {
    twitchId: number;
}

export interface DbSteamIdResponse {
    steamId: number;
}

export interface DbDiscordLinkResponse {
    discordLink: string;
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

export interface DbChatroomAttachmentResponse {
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
    attachment: string;
    chatroomid: number;
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

export interface ChatroomAttachmentResponse {
    error: string;
    link?: string;
}

export interface ChatHistoryResponse {
    name: string[];
    date: string[];
    text: string[];
    image: string[];
    attachment: string[];
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

export interface TwitchFollowersResponse {
    error: string;
    data?: TwitchUser[];
}

export interface TwitchIdResponse {

    error: string;
    data?: TwitchId;
}

export interface TwitchId {

    twitchId: number;
}

export interface SteamIdResponse {

    error: string;
    data?: SteamId;
}

export interface SteamId {

    steamId: number;
}

export interface DbSteamFriendsResponse {

    friends: SteamFriend[];
}

export interface SteamFriendsResponse {

    error: string;
    data?: SteamFriend[];
}

export interface SteamFriend {

    id: number;
    name: string;
    online: boolean;
    lastOnline?: string;
    profilePicture: string;
    profileLink: string;
    recentlyPlayedName?: string;
    recentlyPlayedImageLink?: string;
    countryFlagLink?: string;
}

export interface TwitchUser {
    id: string;
    name: string;
    viewerCount: number;
    gameName: string;
    profilePicLink: string;
    profileLink: string;
    streamPreviewLink: string;
    cheerEmotes: TwitchEmote[];
    subEmotes: TwitchEmote[];
    badgeEmotes: TwitchEmote[];
    partnered: boolean;
    streamTitle: string;
}

export interface TwitchPair {
    id: number;
    name: string;
}

export interface TwitchEmote {
    name: string;
    link: string;
}

export interface DbTwitchFollowsResponse {
    follows: TwitchUser[];
}

export interface DiscordLinkResponse {
    error: string;
    data?: DiscordLink;
}

export interface DiscordLink {
    link: string;
}

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