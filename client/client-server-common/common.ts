import config from "../../config";
const MIN_USER_LEN = 5, MAX_USER_LEN = 16;
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160;

export enum SQLErrorCodes {
    DUPLICATE_ROW = 1062
}

export const ExcludedGameIds: number[] = [111063, 111908, 114910, 59227, 25260];

export const IGDBImageUploadPath: string = `https://images.igdb.com/igdb/image/upload`;

export function getIGDBImage(uid: string, size: IGDBImageSizeEnums): string {
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${uid}.jpg`;
}

export function getCachedIGDBImage(uid: string, size: IGDBImageSizeEnums): string {
    return `/cache/image-cacheing/${size}/${uid}.jpg`;
}

export function buildIGDBRequestBody(filters: string[], fields: string, limit: number, sort?: string, search?: string): string {
    let body: string = "";

    // process search
    if (search) {
        body = body.concat(`search "${search}";`);
    }

    // process fields
    body = body.concat(`fields ${fields || "*"};`);

    // process filters
    if (filters.length > 0) {
        body = body.concat(`where ${filters.join(" & ")};`);
    }

    // process sort
    if (sort) {
        body = body.concat(`${sort};`);
    }

    // process limit
    body = body.concat(`limit ${limit || config.igdb.pageLimit};`);

    return body;
}

export function getTodayUnixTimestampInSeconds(): number {
    const now: Date = new Date();
    const startOfDay: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const timestamp: number = (startOfDay.getTime() / 1000);
    return timestamp;
}

const CURRENT_UNIX_TIME_S: number = getTodayUnixTimestampInSeconds();
const THREE_MONTH_AGO_UNIX_TIME_S: number = getTodayUnixTimestampInSeconds() - (60 * 60 * 24 * 30 * 3);

export const GamesPresets = {
    highlighted: `?required=cover,screenshots&released_after=${THREE_MONTH_AGO_UNIX_TIME_S}&released_before=${CURRENT_UNIX_TIME_S}&popularity=55&platforms=6&sort=popularity:desc`,
    ioscomingsoon: `?required=cover,screenshots&platforms=39&released_after=${CURRENT_UNIX_TIME_S}&sort=release_date:asc`,
    androidcomingsoon: `?required=cover,screenshots&platforms=34&released_after=${CURRENT_UNIX_TIME_S}&sort=release_date:asc`,
    upcoming: `?required=cover,screenshots&released_after=${CURRENT_UNIX_TIME_S}&sort=release_date:asc`,
    recentlyReleased: `?required=cover,screenshots&popularity=5&released_before=${CURRENT_UNIX_TIME_S}&sort=release_date:desc`,
    popular: `?required=cover,screenshots&popularity=15&released_after=${THREE_MONTH_AGO_UNIX_TIME_S}&released_before=${CURRENT_UNIX_TIME_S}&sort=popularity:desc`,
};

export enum SidenavEnums {
    home,
    search,
    discounted,
    news,
    cog,
}

export enum IGDBGenreEnums {
    action = 14,
    adventure = 31,
    shooter = 5,
    simulation = 13,
    rpg = 12,
    racing = 10,
    puzzle = 9,
    strategy = 15
}

export enum IGDBPlatformEnums {
    pc = 6,
    vr = 162,
    ps4 = 48,
    xboxone = 49,
    switch = 130,
    linux = 3,
    mac = 14
}

export enum IGDBCategoryEnums {
    maingame = 0,
    dlc = 1,
    expansion = 2,
    bundle = 3,
    standaloneexpansion = 4
}

export enum IGDBImageSizeEnums {
    micro = "micro",
    thumb = "thumb",
    cover_small = "cover_small",
    logo_med = "logo_med",
    cover_big = "cover_big",
    screenshot_med = "screenshot_med",
    screenshot_big = "screenshot_big",
    "720p" = "720p",
    "1080p" = "1080p"
}

export enum IconEnums {
    "fab fa-playstation" = 45,
    "fab fa-android" = 34,
    "fab fa-windows" = 6,
    "fab fa-apple" = 14,
    "fab fa-linux" = 3,
    "fab fa-steam" = 92,
    "fab fa-xbox" = 49,
    "fab fa-nintendo-switch" = 130
}

export enum PlatformEnums {
    Linux = 3,
    Windows = 6,
    Mac = 14,
    "Playstation 4" = 48,
    "Xbox One" = 49,
    "Nintendo Switch" = 130,
    "Oculus VR" = 162,
    Browser = 82,
    "Playstation 3" = 9,
    Arcade = 52,
    "Playstation Network" = 45,
    "Nintendo 3DS" = 37,
    SNES = 19,
    GameCube = 21,
    "Xbox 360" = 12,
    Android = 34,
    N64 = 4,
    "Playstation 1" = 131,
    "Virtual Boy" = 87,
    "Steam OS" = 92,
    "Playstation VR" = 165,
    "Nintendo DS" = 20,
    Wii = 5,
    "Game Boy Color" = 22,
    NES = 18,
    "Playstation Vita" = 47,
    "Wii U" = 41,
    "Playstation 5" = 167,
    "Steam VR" = 163,
    "Playstation 2" = 8
}

export enum GenreEnums {
    Shooter = 5,
    Puzzle = 9,
    Racing = 10,
    RPG = 12,
    Simulator = 13,
    Strategy = 15,
    Adventure = 31,
    Fighting = 4,
    "Point and click" = 2,
    Tactical = 24,
    Trivia = 26,
    RTS = 11,
    Platformer = 8,
    Music = 7,
    "Hack and slash" = 25,
    Pinball = 30,
    Arcade = 33,
    Indie = 32,
    "Turn-based Strategy" = 16,
    Sports = 14
}

export enum Breakpoints {
    md = 768
}

export const steamAppUrl: string = `https://store.steampowered.com/app`;

export const androidAppUrl: string = `https://play.google.com/store/apps/details?id=`;

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
        host: string,
        user: string,
        password: string,
        database: string,
        insecureAuth: boolean
    };
}

export interface PlatformOption {
    id: number;
    name: string;
}

export enum ResultsEnum {
    SearchResults = 1,
    DiscountedResults = 2
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
    external_games: IGDBExternalGame[];
    similar_games: RawGame[];
    multiplayer_modes: IGDBMultiplayerMode[];
}

export const GameFields: string[] = [`id`, `name`, `genres.*`, `platforms.*`, `first_release_date`, `aggregated_rating`, `cover.*`, `release_dates.*`, `total_rating_count`, `summary`, `screenshots.*`, `videos.*`, `external_games.*`, `similar_games.*`, `similar_games.cover.image_id`, `multiplayer_modes.*`];

export interface Genre {
    name: string;
}

export interface Platform {
    id: number;
    name: string;
}

export interface RawNewsArticle {
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

export interface GameRating {
    igdb_id: number;
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

export const NewsArticleFields: string[] = [`id`, `title`, `author`, `image`, `website.*`, `created_at`, `pulse_source.*`];

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
    id: number;
    name: string;
    aggregated_rating: number;
    total_rating_count: number;
    cover: IGDBImage;
    summary: string;
    linkIcons: string[];
    genres: number[];
    platforms: number[];
    release_dates: number[];
    first_release_date: number;
    screenshots: IGDBImage[];
    video: string;
    video_cached: boolean;
    similar_games: SimilarGame[];
    image_cached: boolean;
    steam_link: string;
    gog_link: string;
    microsoft_link: string;
    apple_link: string;
    android_link: string;
    pricings: PriceInfo[];
    multiplayer_enabled: boolean;
}

export interface PriceInfo {
    external_category_enum: IGDBExternalCategoryEnum;
    pricings_enum: PricingsEnum;
    title: string;
    price: number;
    coming_soon: boolean;
    preorder: boolean;
    discount_percent: number;
}

export interface SimilarGame {
    id: number;
    name: string;
    cover_id: string;
}

export interface MultiGameResponse {
    error: string;
    data?: GameResponse[];
}

export interface SingleGameResponse {
    error: string;
    data?: GameResponse;
}

export interface TwitchFollowersResponse {
    error: string;
    data?: TwitchUser[];
}

export interface TwitchIdResponse {
    error: string;
    data?: number;
}

export interface SteamIdResponse {
    error: string;
    data?: number;
}

export interface SteamFriendsResponse {
    error: string;
    data?: SteamFriend[];
}

export interface DiscordLinkResponse {
    error: string;
    data?: string;
}

export interface MultiNewsResponse {
    error: string;
    data?: NewsArticle[];
}

export interface PriceInfoResponse {
    externalEnum: IGDBExternalCategoryEnum;
    pricingEnum: PricingsEnum;
    igdbGamesSysKeyId: number;
    title: string;
    price: number;
    coming_soon: boolean;
    preorder: boolean;
    discount_percent: number;
    expires_dt: Date;
}

/**
 *  IGDB Types
 */

export interface IGDBPlatform {
    id: number;
    abbreviation: string;
    alternative_name: string;
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
    id: number;
    created_at: number;
    name: string;
    slug: string;
    updated_at: number;
    url: string;
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

export const convertIGDBExternCateEnumToSysKeyId = (externCateEnum: IGDBExternalCategoryEnum): number => {
    if (externCateEnum === IGDBExternalCategoryEnum.steam) {
        return 1;
    } else if (externCateEnum === IGDBExternalCategoryEnum.gog) {
        return 2;
    } else if (externCateEnum === IGDBExternalCategoryEnum.microsoft) {
        return 3;
    } else if (externCateEnum === IGDBExternalCategoryEnum.apple) {
        return 4;
    } else if (externCateEnum === IGDBExternalCategoryEnum.android) {
        return 5;
    } else {
        return -1;
    }
};

export interface IGDBReleaseDate {
    id: number;
    category: number;
    date: number;
    game: number;
    human: string;
    m: number;
    platform: number;
    region: number;
    created_at: number;
    updated_at: number;
    y: number;
}

exort interface IGDBMultiplayerMode {
    id: number;
    campaigncoop: boolean;
    dropin: boolean;
    game: number;
    lancoop: boolean;
    offlinecoop: boolean;
    offlinecoopmax: number;
    offlinemax: number;
    onlinecoop: boolean;
    onlinecoopmax: number;
    onlinemax: number;
    platform: number;
    splitscreen: boolean;
    splitscreenonline: boolean;
}

export interface IGDBImage {
    alpha_channel: boolean;
    animated: boolean;
    image_id: string;
    width: number;
    height: number;
}

export interface IGDBVideo {
    name: string;
    video_id: string;
}

export interface IGDBWebsite {
    id: number;
    trusted: boolean;
    url: string;
}

export interface IGDBExternalGame {
    id: number;
    category: IGDBExternalCategoryEnum;
    created_at: number;
    game: number;
    name: string;
    uid: string;
    updated_at: number;
    url: string;
    year: number;
}

export enum PricingsEnum {
    free_or_discounted_with_xbox_game_pass = 1,
    free_or_discounted_with_xbox_live_gold = 2,
    main_game = 3,
    bundles = 4,
    dlc = 5,
    in_app_purchase = 6,
}

/* Database tables */
export enum DbTables {
    accounts = "accounts",
    accounts_role_enum = "accounts_role_enum",
    accounts_roles = "accounts_roles",
    chat_emotes = "chat_emotes",
    chatroom_messages = "chatroom_messages",
    chatroom_userlist = "chatroom_userlist",
    covers = "covers",
    genres = "genres",
    icons = "icons",
    icons_enum = "icons_enum",
    igdb_external_enum = "igdb_external_enum",
    igdb_games = "igdb_games",
    igdb_genre_enum = "igdb_genre_enum",
    igdb_images = "igdb_images",
    igdb_news = "igdb_news",
    igdb_platform_enum = "igdb_platform_enum",
    platforms = "platforms",
    pricings = "pricings",
    pricings_enum = "pricings_enum",
    ratings = "ratings",
    release_dates = "release_dates",
    results = "results",
    results_enum = "results_enum",
    screenshots = "screenshots",
    similar_games = "similar_games",
    tokens = "tokens",
}

export const DbTableAccountsFields: string[] = [`accounts_sys_key_id`, `username`, `email`, `password_hash`, `salt`, `log_dt`, `discord`, `steam`, `twitch`, `email_verification_code`, `recovery_verification_code`, `profile`, `profile_file_extension`];
export const DbTableAccountsRolesFields: string[] = [`accounts_roles_sys_key_id`, `accounts_role_enum_sys_key_id`, `accounts_sys_key_id`];
export const DbTableChatEmotesFields: string[] = [`chat_emotes_sys_key_id`, `prefix`, `suffix`, `file_extension`, `log_dt`];
export const DbTableChatroomMessagesFields: string[] = [`chatroom_messages_sys_key_id`, `username`, `text`, `attachment`, `attachment_file_extension`, `chatroom_id`, `log_dt`];
export const DbTableChatroomUserlistFields: string[] = [`accounts_sys_key_id`, `log_dt`];
export const DbTableCoversFields: string[] = [`covers_sys_key_id`, `igdb_images_sys_key_id`, `igdb_games_sys_key_id`];
export const DbTableGenresFields: string[] = [`genres_sys_key_id`, `igdb_genre_enum_sys_key_id`, `igdb_games_sys_key_id`];
export const DbTableIconsFields: string[] = [`icons_sys_key_id`, `icons_enum_sys_key_id`, `igdb_games_sys_key_id`];
export const DbTableIconsEnumFields: string[] = [`icons_enum_sys_key_id`, `id`, `name`];
export const DbTableIGDBExternalEnumFields: string[] = [`igdb_external_enum_sys_key_id`, `id`, `name`];
export const DbTableIGDBGamesFields: string[] = [`igdb_games_sys_key_id`, `id`, `name`, `aggregated_rating`, `total_rating_count`, `summary`, `first_release_date`, `video`, `video_cached`, `image_cached`, `steam_link`, `gog_link`, `microsoft_link`, `apple_link`, `android_link`];
export const DbTableIGDBGenreEnumFields: string[] = [`igdb_genre_enum_sys_key_id`, `id`, `name`];
export const DbTableIGDBImagesFields: string[] = [`igdb_images_sys_key_id`, `id`, `alpha_channel`, `animated`, `width`, `height`];
export const DbTableIGDBPlatformEnumFields: string[] = [`igdb_platform_enum_sys_key_id`, `id`, `name`];
export const DbTablePlatformsFields: string[] = [`platforms_sys_key_id`, `igdb_platform_enum_sys_key_id`, `igdb_games_sys_key_id`];
export const DbTablePricingsFields: string[] = [`pricings_sys_key_id`, `igdb_external_enum_sys_key_id`, `pricings_enum_sys_key_id`, `igdb_games_sys_key_id`, `title`, `price`, `discount_percent`, `coming_soon`, `preorder`, `expires_dt`];
export const DbTablePricingsEnumFields: string[] = [`pricings_enum_sys_key_id`, `name`];
export const DbTableRatingsFields: string[] = [`ratings_sys_key_id`, `igdb_games_sys_key_id`, `accounts_sys_key_id`, `rating`, `log_dt`];
export const DbTableReleaseDatesFields: string[] = [`release_dates_sys_key_id`, `release_date_ts`, `igdb_games_sys_key_id`];
export const DbTableResultsFields: string[] = [`results_sys_key_id`, `results_enum_sys_key_id`, `igdb_games_sys_key_id`, `param`, `expires_dt`];
export const DbTableResultsEnumFields: string[] = [`results_enum_sys_key_id`, `name`];
export const DbTableScreenshotsFields: string[] = [`screenshots_sys_key_id`, `igdb_images_sys_key_id`, `igdb_games_sys_key_id`];
export const DbTableSimilarGamesFields: string[] = [`similar_games_sys_key_id`, `igdb_games_sys_key_id`, `similar_id`, `similar_name`, `similar_cover_id`];
export const DbTableTokensFields: string[] = [`tokens_sys_key_id`, `accounts_sys_key_id`, `auth_token_code`, `created_dt`, `expires_dt`];
export const DbTableIGDBNewsFields: string[] = [`igdb_news_sys_key_id`, `title`, `author`, `image`, `url`, `created_dt`, `org`, `expires_dt`];

/* Service Worker */

export enum ServiceWorkerEnums {
    video_previews,
    image_cacheing,
    pricing_update
}
