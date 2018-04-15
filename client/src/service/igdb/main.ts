import axios from 'axios';
import { SingleGameResponse, PlatformGamesResponse, RecentGamesResponse, UpcomingGamesResponse, SearchGamesResponse, GenreListResponse, GenreGamesResponse } from '../../../client-server-common/common';

/**
 * HTTP request to get search games.
 */
export function httpGetSearchGames(query: string): Promise<SearchGamesResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/search/${query}`)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const searchGamesResponse: SearchGamesResponse = result.data;
            return resolve(searchGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

/**
 * HTTP request to get upcoming games.
 */
export function httpGetUpcomingGamesList(): Promise<UpcomingGamesResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/igdb/games/upcoming')
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const upcomingGamesResponse: UpcomingGamesResponse = result.data;
            return resolve(upcomingGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

/**
 * HTTP request to get recent games.
 */
export function httpGetRecentlyReleasedGamesList(): Promise<RecentGamesResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/igdb/games/recent')
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const recentGamesResponse: RecentGamesResponse = result.data;
            return resolve(recentGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

/**
 * HTTP request to get platform games.
 */
export function httpGetPlatformGamesList(platformId: number): Promise<PlatformGamesResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/platform/${platformId}`)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const platformGamesResponse: PlatformGamesResponse = result.data;
            return resolve(platformGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

/**
 * HTTP request to get genre games.
 */
export function httpGetGenreGamesList(genreId: number): Promise<GenreGamesResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/genre/${genreId}`)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const genreGamesResponse: GenreGamesResponse = result.data;
            return resolve(genreGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

/**
 * HTTP request to get genre list.
 */
export function httpGetGenreList(): Promise<GenreListResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/genrelist`)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const platformGamesResponse: GenreListResponse = result.data;
            return resolve(platformGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

/**
 * HTTP request to get a specific game.
 */
export function httpGetGame(id: string): Promise<SingleGameResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/game/${id}`)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const singleGameReponse: SingleGameResponse = result.data;
            return resolve(singleGameReponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}