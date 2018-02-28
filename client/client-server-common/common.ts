const MIN_USER_LEN = 5, MAX_USER_LEN = 16;
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160;

export function validateCredentials(username: string, password: string, email?: string, remember?: boolean): ResponseModel {
    const response: ResponseModel = {errors: [], data: undefined};

    // username validation
    if (username === undefined) {
        response.errors.push(`Username not found.`);
    } else if (username.length > MAX_USER_LEN) {
        response.errors.push(`Username too long. Must be at most ${MAX_USER_LEN} characters.`);
    } else if (username.length < MIN_USER_LEN) {
        response.errors.push(`Username too short. Must be at least ${MIN_USER_LEN} characters.`);
    }

    // password validation
    if (password === undefined) {
        response.errors.push(`Password not found.`);
    } else if (password.length > MAX_PASS_LEN) {
        response.errors.push(`Password too long. Must be at most ${MAX_PASS_LEN} characters.`);
    } else if (password.length < MIN_PASS_LEN) {
        response.errors.push(`Password too short. Must be at least ${MIN_PASS_LEN} characters.`);
    }

    // email validation
    if (email !== undefined) {
        if (email !== ``) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(email.toLowerCase())) {
                response.errors.push(`Email is not in a valid format.`);
            }
        } else {
            response.errors.push(`No email address provided.`);
        }
    }

    // remember me validation
    if (remember) {
        if (!Boolean(remember)) {
            response.errors.push(`Remember me is not a boolean.`);
        }
    }

    return response;

}

export interface ResponseModel {
    errors: string[];
    data: any;
}

export interface GameListEntryResponse {
    name: string;
    id: number;
}

export const GameListEntryResponseFields: string[] = [`id`, `name`];

export interface GameResponse {

    name: string;
    rating?: number;
    rating_count?: number;
    price?: string;
    discount_percent?: number;
    steam_url?: string;
    cover?: string;
    summary?: string;
    genres?: string[];
    platforms?: string[];
    platforms_release_dates?: string[];
    next_release_date?: string;
    screenshots?: string[];
}

export const GameResponseFields: string[] = [`name`, `release_dates`, `cover`, `total_rating`, `total_rating_count`, `summary`, `genres`, `platforms`, `screenshots`, `external`];

export interface UpcomingGameResponse {

    id: number;
    name: string;
    next_release_date: string;
    genres: string;
    platformIcons: string[];
    steam_url?: string;
    cover?: string;
}

export const UpcomingGameResponseFields: string[] = [`id`, `name`, `release_dates.date`, `cover`, `genres`, `platforms`, `external`];

export interface RecentGameResponse {

    id: number;
    name: string;
    last_release_date: string;
    genres: string;
    platformIcons: string[];
    steam_url?: string;
    cover?: string;
}

export const RecentGameResponseFields: string[] = [`id`, `name`, `release_dates.date`, `cover`, `genres`, `platforms`, `external`];

export interface PlatformGameResponse {

    id: number;
    name: string;
    rating: string;
    genres: string;
    platformIcons: string[];
    steam_url?: string;
    cover?: string;
}

export const PlatformGameResponseFields: string[] = [`id`, `name`, `rating`, `cover`, `genres`, `platforms`, `external`];