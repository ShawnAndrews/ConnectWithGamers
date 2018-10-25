import axios from 'axios';
import { SingleGameResponse, PlatformGamesResponse, PredefinedGamesResponse, SearchGamesResponse, GenreListResponse, GenreGamesResponse, MultiNewsResponse, ThumbnailGamesResponse, PredefinedGamesType } from '../../../client-server-common/common';

/**
 * Generic HTTP request to get templated response data.
 */
export function httpGenericGetData<T>(query: string): Promise<T> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(query)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const dataResponse: T = result.data;
            return resolve(dataResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

/**
 * HTTP request to get predefined games list.
 */
export function httpGetPredefinedGamesResults(type: PredefinedGamesType): Promise<ThumbnailGamesResponse> {
    return new Promise((resolve: any, reject: any) => {
        let url: string;

        if (type === PredefinedGamesType.Popular) {
            url = '/igdb/games/predefined/popular';
        } else if (type === PredefinedGamesType.Recent) {
            url = '/igdb/games/predefined/recent';
        } else if (type === PredefinedGamesType.Upcoming) {
            url = '/igdb/games/predefined/upcoming';
        }

        axios.post(url)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const recentGamesResponse: PredefinedGamesResponse = result.data;
            return resolve(recentGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}