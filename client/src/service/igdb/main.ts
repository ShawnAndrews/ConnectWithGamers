import axios from 'axios';

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