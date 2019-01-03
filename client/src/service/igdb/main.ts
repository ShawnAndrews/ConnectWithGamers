import axios from 'axios';
import { ResultsType, MultiGameResponse } from '../../../client-server-common/common';

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
 * HTTP request to get games list.
 */
export function httpGetGamesResults(type: ResultsType): Promise<MultiGameResponse> {
    return new Promise((resolve: any, reject: any) => {
        let url: string;

        if (type === ResultsType.PopularResults) {
            url = '/igdb/games/popular';
        } else if (type === ResultsType.RecentResults) {
            url = '/igdb/games/recent';
        } else if (type === ResultsType.UpcomingResults) {
            url = '/igdb/games/upcoming';
        }

        axios.post(url)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            }
            const recentGamesResponse: MultiGameResponse = result.data;
            return resolve(recentGamesResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}