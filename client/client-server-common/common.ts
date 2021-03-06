const MIN_USER_LEN = 5, MAX_USER_LEN = 16;
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160;

export const STEAM_RATE_LIMIT_MS = 1000;
export const SALT_RNDS = 10;
export const EMAIL_VERIFICATION_LEN = 15;
export const ACCOUNT_RECOVERYID_LEN = 32;

export const ExcludedGameIds: number[] = [76638, 7789, 55106, 19542, 11393, 1020];

export enum SQLErrorCodes {
    DUPLICATE_ROW = 1062
}

export function getTodayUnixTimestampInSeconds(): number {
    const now: Date = new Date();
    const startOfDay: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const timestamp: number = (startOfDay.getTime() / 1000);
    return timestamp;
}

export enum CurrencyType {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    CAD = "CAD",
    AUD = "AUD"
}

export enum SidenavEnums {
    home,
    search,
    discounted,
    xbox,
    playstation,
    switch,
    ios,
    android,
    news,
    cog,
}

export enum Breakpoints {
    md = 768
}

export const cheerioOptions: any = { decodeEntities: false };
export const steamAppUrl: string = `https://store.steampowered.com/app`;
export const getSteamAppAchievementsUrl = (steamId: number): string => `https://steamcommunity.com/stats/${steamId}/achievements`;

export const getSteamCoverURL = (steamId: number): string => `https://steamcdn-a.akamaihd.net/steam/apps/${steamId}/header.jpg`;

export const getSteamCoverThumbURL = (steamId: number): string => `https://steamcdn-a.akamaihd.net/steam/apps/${steamId}/capsule_sm_120.jpg`;

export const getSteamCoverHugeURL = (steamId: number): string => `https://steamcdn-a.akamaihd.net/steam/apps/${steamId}/capsule_616x353.jpg`;

export function cleanString(input: string): string {
    let output = "";
    // remove non-utf8 characters from string
    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

export interface GameSuggestion {
    name: string;
    steamId: number;
}

export interface RouteCache {
    data: any;
}

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
    steam: {
        dbURL: string,
        apiURL: string,
        nonApiURL: string,
        appURL: string,
        key: string
    };
    twitch: {
        clientId: string;
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
        local: {
            host: string,
            user: string,
            password: string,
            database: string,
            insecureAuth: boolean,
            charset: string
        },
        remote: {
            host: string,
            user: string,
            password: string,
            database: string,
            insecureAuth: boolean,
            charset: string
        }
    };
}

export interface PlatformOption {
    id: number;
    name: string;
}

export interface UserLog {
    accountId: number;
    log_dt: Date;
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
    { name: "Home", abbrevName: "", imagePath: "https://i.imgur.com/pJbJnyh.png", redirect: "/chat" },
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
export const BREAKING_NEWS_TOKEN_NAME = `breakingNewsClosed`;
export const CURRENCY_TOKEN_NAME = `currency`;

export const CHAT_SERVER_PORT = 81;

export function validateUsername(username: string): string {
    if (username === undefined) {
        return `Username not found.`;
    } else if (username.length > MAX_USER_LEN) {
        return `Username too long. Must be at most ${MAX_USER_LEN} characters.`;
    } else if (username.length < MIN_USER_LEN) {
        return `Username too short. Must be at least ${MIN_USER_LEN} characters.`;
    } else if (username.startsWith(`Anonymous`)) {
        return `Username starts with a prohibited word 'Anonymous'.`;
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

export interface AccountInfo {
    accountid?: number;
    last_active?: number;
    username: string;
    email?: string;
    steam: string;
    twitch: string;
    discord: string;
    emailVerified?: boolean;
    profile?: boolean;
    profile_file_extension?: string;
}

export interface AccountsInfo {
    accounts: AccountInfo[];
}

export interface AuthenticationInfo {
    accountid: number;
    username: string;
    remember: boolean;
}

export interface TokenInfo {
    token: string;
    tokenExpiration: Date;
}

export interface RecoveryEmailInfo {
    email: string;
    uid: string;
}

export interface SingleChatHistory {
    accountId: number;
    name: string;
    date: Date;
    text: string;
    profile: boolean;
    profileFileExtension: string;
    attachment: boolean;
    attachmentFileExtension: string;
    chatroomId: number;
    chatroomMessageId: number;
}

export interface ChatroomEmote {
    fileExtension: string;
    prefix: string;
    suffix: string;
}

export interface IdNamePair {
    id: number;
    name: string;
}

export interface RawGame {
    id: number;
    name: string;
    first_release_date: Date;
    cover: string;
    aggregated_rating: number;
    total_rating_count: number;
    summary: string;
    genres: number[];
    platforms: number[];
    screenshots: string[];
    videos: string[];
    similar_games: number[];
    game_modes: number[];
}

export interface RawNewsArticle {
    id: number;
    title: string;
    author: string;
    image: string;
    website: string;
    created_at: number;
    pulse_source: {
        name: string
    };
}

export interface GameRating {
    account_id: number;
    rating: number;
    date: number;
}

export interface NewsArticle {
    title: string;
    author: string;
    image: string;
    url: string;
    created_dt: Date;
    org: string;
    expires_dt: Date;
}

/**
 * Response Models
 */
export interface GenericModelResponse {
    error: string;
    data?: any;
}

export interface DatalessResponse {
    error: string;
}

export interface AccountInfoResponse {
    error: string;
    data?: AccountInfo;
}

export interface GameSuggestionsResponse {
    error: string;
    data?: GameSuggestion[];
}

export interface EmailVerifiedFlagResponse {
    error: string;
    data?: boolean;
}

export interface EmailRecoveryVerifyResponse {
    error: string;
    verifiedLink?: boolean;
}

export interface AccountImageResponse {
    error: string;
    link?: string;
}

export interface ChatroomEmotesResponse {
    error: string;
    emotes?: ChatroomEmote[];
}

export interface ChatroomUploadImageResponse {
    error: string;
    link?: string;
}

export interface ChatHistoryResponse {
    accountId: number[];
    name: string[];
    date: string[];
    text: string[];
    profile: boolean[];
    profile_file_extension: string[];
    attachment: boolean[];
    attachment_file_extension: string[];
    chatroomMessageId: number[];
}

export interface GameResponse {
    steamId: number;
    name: string;
    review: IdNamePair;
    total_review_count: number;
    summary: string;
    first_release_date: Date;
    video: string;
    state: IdNamePair;
    developer: string;
    publisher: string;
    pricings: PriceInfoResponse[];
    cover: string;
    cover_thumb: string;
    cover_huge: string;
    screenshots: string[];
    game_modes: IdNamePair[];
    genres: IdNamePair[];
    platforms: IdNamePair[];
    log_dt: Date;
}

export interface MultiGameResponse {
    error: string;
    data?: GameResponse[];
}

export interface SingleGameResponse {
    error: string;
    data?: GameResponse;
}

export interface GameReviewsResponse {
    error: string;
    data?: Review[];
}

export interface MultiNewsResponse {
    error: string;
    data?: NewsArticle[];
}

export interface Review {
    review: string;
    voted_up: boolean;
    timestamp_created: number;
    author: {
        playtime_forever: number;
    };
}

export interface PricingStatus {
    title: string;
    price: number;
    discount_percent: number;
    discount_end_dt: Date;
    state: StateEnum;
}

export interface PriceInfoResponse {
    steamGamesSysKeyId: number;
    pricingEnumSysKeyId: PricingsEnum;
    title: string;
    price: number;
    discount_percent: number;
    discount_end_dt: Date;
    log_dt: Date;
}

export enum ImagesEnum {
    cover = 1,
    cover_thumb = 2,
    screenshot = 3,
    cover_huge = 4,
}

export enum PricingsEnum {
    main_game = 1,
    bundles = 2,
    dlc = 3,
    demo = 4,
}

export interface BusMessage {
    bus_messages_enum_sys_key_id: number;
    value: string;
    log_dt: Date;
}

export enum GameModesEnum {
    "Single Player" = 1,
    "Multiplayer" = 2,
    "Co-op" = 3,
    "Split Screen" = 4,
    "MMO" = 5
}

export enum ReviewEnum {
    "No User Reviews" = 1,
    "Overwhelmingly Positive" = 2,
    "Very Positive" = 3,
    "Positive" = 4,
    "Mostly Positive" = 5,
    "Mixed" = 6,
    "Mostly Negative" = 7,
    "Negative" = 8,
    "Very Negative" = 9,
    "Overwhelmingly Negative" = 10
}

export enum StateEnum {
    "To Be Announced" = 5,
    "Upcoming" = 4,
    "Preorder" = 3,
    "Early Access" = 2,
    "Released" = 1
}

export enum PlatformEnum {
    windows = 1,
    mac = 2,
    linux = 3
}

export enum BusMessagesEnum {
    game = 0
}

export enum BusMessagesPriorityEnum {
    low = 1,
    medium = 2,
    high = 3
}

export interface Achievement {
    name: string;
    description: string;
    percent: number;
    link: string;
    log_dt: Date;
}

/* Database tables */
export enum DbTables {
    accounts = "accounts",
    accounts_role_enum = "accounts_role_enum",
    accounts_roles = "accounts_roles",
    bus_messages = "bus_messages",
    bus_messages_enum = "bus_messages_enum",
    chat_emotes = "chat_emotes",
    achievements = "achievements",
    chatroom_messages = "chatroom_messages",
    chatroom_userlist = "chatroom_userlist",
    genres = "genres",
    modes = "modes",
    pricings = "pricings",
    pricings_enum = "pricings_enum",
    ratings = "ratings",
    route_cache = "route_cache",
    similar_games = "similar_games",
    steam_games = "steam_games",
    steam_genre_enum = "steam_genre_enum",
    images = "images",
    steam_images_enum = "steam_images_enum",
    steam_modes_enum = "steam_modes_enum",
    steam_news = "steam_news",
    steam_review_enum = "steam_review_enum",
    steam_state_enum = "steam_state_enum",
    steam_platform_enum = "steam_platform_enum",
    platforms = "platforms",
    developers = "developers",
    publishers = "publishers",
    steam_developer_enum = "steam_developer_enum",
    steam_publisher_enum = "steam_publisher_enum",
    tokens = "tokens",
    bus_messages_priority_enum = "bus_messages_priority_enum"
}

export const DbTableAccountsFields: string[] = [`accounts_sys_key_id`, `username`, `email`, `password_hash`, `salt`, `log_dt`, `discord`, `steam`, `twitch`, `email_verification_code`, `recovery_verification_code`, `profile`, `profile_file_extension`];
export const DbTableAccountsRoleEnumFields: string[] = [`accounts_roles_enum_sys_key_id`, `name`];
export const DbTableAccountsRolesFields: string[] = [`accounts_roles_sys_key_id`, `accounts_role_enum_sys_key_id`, `accounts_sys_key_id`];
export const DbTableBusMessagesFields: string[] = [`bus_messages_enum_sys_key_id`, `bus_messages_priority_enum_sys_key_id`, `value`, `log_dt`];
export const DbTableBusMessagesEnumRolesFields: string[] = [`bus_messages_enum_sys_key_id`, `name`];
export const DbTableChatEmotesFields: string[] = [`chat_emotes_sys_key_id`, `prefix`, `suffix`, `file_extension`, `log_dt`];
export const DbTableChatroomMessagesFields: string[] = [`chatroom_messages_sys_key_id`, `username`, `text`, `attachment`, `attachment_file_extension`, `chatroom_id`, `log_dt`];
export const DbTableChatroomUserlistFields: string[] = [`accounts_sys_key_id`, `log_dt`];
export const DbTableGenresFields: string[] = [`genres_sys_key_id`, `steam_genre_enum_sys_key_id`, `steam_games_sys_key_id`];
export const DbTablePlatformsFields: string[] = [`platforms_sys_key_id`, `steam_platform_enum_sys_key_id`, `steam_games_sys_key_id`];
export const DbTableModesFields: string[] = [`modes_sys_key_id`, `steam_modes_enum_sys_key_id`, `steam_games_sys_key_id`];
export const DbTableDevelopersFields: string[] = [`developers_sys_key_id`, `steam_developer_enum_sys_key_id`, `steam_games_sys_key_id`];
export const DbTablePublishersFields: string[] = [`publishers_sys_key_id`, `steam_publisher_enum_sys_key_id`, `steam_games_sys_key_id`];
export const DbTablePricingsFields: string[] = [`pricings_sys_key_id`, `pricings_enum_sys_key_id`, `steam_games_sys_key_id`, `title`, `price`, `discount_percent`, `discount_end_dt`, `log_dt`];
export const DbTablePricingsEnumFields: string[] = [`pricings_enum_sys_key_id`, `name`];
export const DbTableRatingsFields: string[] = [`ratings_sys_key_id`, `steam_games_sys_key_id`, `accounts_sys_key_id`, `rating`, `log_dt`];
export const DbTableRouteCacheFields: string[] = [`route`, `response`, `log_dt`];
export const DbTableSimilarGamesFields: string[] = [`similar_games_sys_key_id`, `steam_games_sys_key_id`, `similar_to_steam_games_sys_key_id`];
export const DbTableSteamGamesFields: string[] = [`steam_games_sys_key_id`, `name`, `steam_review_enum_sys_key_id`, `total_review_count`, `summary`, `first_release_date`, `video`, `steam_state_enum_sys_key_id`, `log_dt`];
export const DbTableSteamGenreEnumFields: string[] = [`steam_genre_enum_sys_key_id`, `name`];
export const DbTableSteamDeveloperEnumFields: string[] = [`steam_developer_enum_sys_key_id`, `name`];
export const DbTableSteamPublisherEnumFields: string[] = [`steam_publisher_enum_sys_key_id`, `name`];
export const DbTableImagesFields: string[] = [`images_sys_key_id`, `steam_games_sys_key_id`, `steam_images_enum_sys_key_id`, `link`];
export const DbTableSteamImagesEnumFields: string[] = [`steam_images_enum_sys_key_id`, `name`];
export const DbTableSteamModesEnumFields: string[] = [`steam_modes_enum_sys_key_id`, `name`];
export const DbTableSteamPlatformEnumFields: string[] = [`steam_platform_enum_sys_key_id`, `name`];
export const DbTableSteamNewsFields: string[] = [`steam_news_sys_key_id`, `title`, `author`, `image`, `url`, `created_dt`, `org`, `expires_dt`];
export const DbTableSteamReviewEnumFields: string[] = [`steam_review_enum_sys_key_id`, `name`];
export const DbTableSteamStateEnumFields: string[] = [`steam_state_enum_sys_key_id`, `name`];
export const DbTableBusMessagesPriorityEnumFields: string[] = [`bus_messages_priority_enum_sys_key_id`, `name`];
export const DbTableAchievementsFields: string[] = [`achievements_sys_key_id`, `steam_games_sys_key_id`, `name`, `description`, `link`, `percent`, `log_dt`];
export const DbTableTokensFields: string[] = [`tokens_sys_key_id`, `accounts_sys_key_id`, `auth_token_code`, `created_dt`, `expires_dt`];