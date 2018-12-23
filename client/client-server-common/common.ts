const MIN_USER_LEN = 5, MAX_USER_LEN = 16;
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160;

enum RedisExpirationTime {
    ONE_HOUR = 60 * 60,
    ONE_DAY = 60 * 60 * 24,
    ONE_WEEK = 60 * 60 * 24 * 7,
    INF = -1
}

export const steamAppUrl: string = `https://store.steampowered.com/app`;

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
        apiURL: string,
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

    mysql: {
        host: string,
        user: string,
        password: string,
        database: string,
        insecureAuth: boolean
    };
}

export interface IGDBCacheEntry {
    key: string;
    expiry: number; // seconds
}

export interface PlatformOption {
    id: number;
    name: string;
}

export const platformOptions: PlatformOption[] = [
    { id: 6,   name: "Steam" },
    { id: 48,  name: "Playstation 4" },
    { id: 49,  name: "Xbox One" },
    { id: 130, name: "Nintendo Switch" },
    { id: 9,   name: "Playstation 3" },
    { id: 12,  name: "Xbox 360" },
    { id: 18,  name: "Nintendo 64" },
    { id: 37,  name: "Nintendo 3DS" },
];

export const redisCache: IGDBCacheEntry[] = [
    {key: "upcominggames", expiry: RedisExpirationTime.ONE_HOUR},
    {key: "populargames", expiry: RedisExpirationTime.ONE_DAY},
    {key: "recentgames", expiry: RedisExpirationTime.ONE_HOUR},
    {key: "reviewedgames", expiry: RedisExpirationTime.ONE_HOUR},
    {key: "resultsgames", expiry: RedisExpirationTime.ONE_HOUR},
    {key: "games", expiry: RedisExpirationTime.ONE_WEEK},
    {key: "genrelist", expiry: RedisExpirationTime.ONE_WEEK},
    {key: "chatusers", expiry: RedisExpirationTime.INF},
    {key: "news", expiry: RedisExpirationTime.ONE_HOUR}
];

export enum GamesType {
    Popular,
    Recent,
    Upcoming
}

export interface UserLog {
    accountid: number;
    lastActive: Date;
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
    { name: "Home", abbrevName: "", imagePath: "https://i.imgur.com/oll7zIX.png", redirect: "/chat" },
    { name: "Hearthstone", abbrevName: "hearthstone", imagePath: "https://i.imgur.com/myONDFo.png", redirect: "/chat/hearthstone" },
    { name: "League Of Legends", abbrevName: "lol", imagePath: "https://i.imgur.com/AuOsUek.png", redirect: "/chat/lol" },
    { name: "Overwatch", abbrevName: "overwatch", imagePath: "https://i.imgur.com/3Bz1ihC.png", redirect: "/chat/overwatch" },
    { name: "World Of Warcraft", abbrevName: "wow", imagePath: "https://i.imgur.com/MAZIWSq.png", redirect: "/chat/wow" },
    { name: "Grand Theft Auto", abbrevName: "gta", imagePath: "https://i.imgur.com/VC8O3S4.png", redirect: "/chat/gta" },
    { name: "Fortnite", abbrevName: "fortnite", imagePath: "https://i.imgur.com/LPIXnRA.png", redirect: "/chat/fortnite" },
    { name: "Dont Notice Me", abbrevName: "dnm", imagePath: "https://i.ibb.co/sC84Wdr/dnm-sized.png", redirect: "/chat/dnm" },
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
    accountid: number;
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

export interface DbRecoveryEmailResponse {
    email: string;
    uid: string;
}

export interface DbAccountRecoveryResponse {
    accountid: number;
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

export interface DbChatroomUploadEmoteResponse {
    link: string;
}

export interface DbChatroomEmotesResponse {
    emotes: ChatroomEmote[];
}

export interface DbChatroomUploadImageResponse {
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

export interface EmailRecoveryResponse {
    error: string;
}

export interface EmailRecoveryVerifyResponse {
    error: string;
    verifiedLink?: boolean;
}

export interface AccountImageResponse {
    error: string;
    link?: string;
}

export interface RecoverPasswordResponse {
    error: string;
}

export interface ChatroomEmote {
    link: string;
    prefix: string;
    suffix: string;
}

export interface ChatroomEmotesResponse {
    error: string;
    emotes?: ChatroomEmote[];
}

export interface ChatroomUploadImageResponse {
    error: string;
    link?: string;
}

export interface ChatUploadEmoteResponse {
    error?: string;
}

export interface ChatHistoryResponse {
    name: string[];
    date: string[];
    text: string[];
    image: string[];
    attachment: string[];
}

export interface SteamAPIReview {
    text: string;
    hours_played: number;
    up_votes: number;
}

export interface IGDBPlatform {
    id: number;
    abbreviation: string;
    category: number;
    created_at: number;
    generation: number;
    name: string;
    platform_logo: number;
    product_family: number;
    slug: string;
    summary: string;
    updated_at: number;
    url: string;
    versions: number[];
    websites: number[];
}

export interface IGDBGenre {
    created_at: number;
    name: string;
    slug: string;
    updated_at: number;
    url: string;
}

export interface IGDBReleaseDate {
    id: number;
    category: number;
    date: number;
    game: number;
    human: string;
    m: number;
    platform: number;
    region: number;
    updated_at: number;
    y: number;
}

export interface IdNamePair {
    id: number;
    name: string;
}

export interface GameResponse {
    id: number;
    name: string;
    aggregated_rating: number;
    total_rating_count: number;
    price: string;
    discount_percent: number;
    steamid: number;
    cover: string;
    summary: string;
    linkIcons: string[];
    genres: IdNamePair[];
    platforms: IdNamePair[];
    release_dates: number[];
    first_release_date: number;
    screenshots: string[];
    video: string;
}

export interface RawGameResponse {
    id: number;
    name: string;
    first_release_date: number;
    release_dates: IGDBReleaseDate[];
    cover: IGDBImage;
    aggregated_rating: number;
    total_rating_count: number;
    summary: string;
    genres: IGDBGenre[];
    platforms: IGDBPlatform[];
    screenshots: IGDBImage[];
    videos: IGDBVideo[];
    external_games: ExternalGame[];
}

export const GameResponseFields: string[] = [`id`, `name`, `genres.*`, `platforms.*`, `first_release_date`, `aggregated_rating`, `cover.*`, `release_dates.*`, `total_rating_count`, `summary`, `screenshots.*`, `videos.*`, `external_games.*`];

export interface MultiGameResponse {
    error: string;
    data?: GameResponse[];
}

export interface SingleGameResponse {
    error: string;
    data?: GameResponse;
}

export interface IGDBImage {
    alpha_channel: boolean;
    animated: boolean;
    url: string;
    image_id: string;
    width: number;
    height: number;
}

export interface IGDBVideo {
    name: string;
    video_id: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Platform {
    id: number;
    name: string;
}

export enum IGDBExternalCategoryEnum {
    "steam" = 1,
    "gog" = 5,
    "youtube" = 10,
    "microsoft" = 11,
    "apple" = 13,
    "twitch" = 14,
    "android" = 15
}

export interface ExternalGame {
    category: IGDBExternalCategoryEnum;
    created_at: number;
    game: number;
    name: string;
    uid: string;
    updated_at: number;
    url: string;
    year: number;
}

export interface IGDBWebsite {
    id: number;
    trusted: boolean;
    url: string;
}

export interface RawSingleNewsResponse {
    id: number;
    title: string;
    author: string;
    image: string;
    website: IGDBWebsite;
    created_at: number;
    pulse_source: {
        name: string
    };
}

export interface SingleNewsResponse {
    id: number;
    title: string;
    author: string;
    image: string;
    url: string;
    created_at: number;
    newsOrg: string;
}

export const SingleNewsResponseFields: string[] = [`id`, `title`, `author`, `image`, `website.*`, `created_at`, `pulse_source.*`];

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

export interface GenericErrorResponse {
    error: string;
    data?: any;
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

export interface MultiNewsResponse {
    error: string;
    data?: SingleNewsResponse[];
}

export interface GenrePair {
    id: number;
    name: string;
}

export interface GenreListResponse {
    error: string;
    data?: GenrePair[];
}

export interface SteamAPIGetPriceInfoResponse {
    steamgameid: number;
    price: string;
    discount_percent: number;
    steam_url: string;
}

export interface SteamAPIGetReviewsResponse {
    reviews?: SteamAPIReview[];
}