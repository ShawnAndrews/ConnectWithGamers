import axios from 'axios';

/**
 * Generic HTTP request to get templated Steam response data.
 */
export function httpGenericGetData<T>(query: string, getRequest: boolean = false): Promise<T> {
    return new Promise((resolve: any, reject: any) => {
        const axiosCall: any = getRequest ? axios.get : axios.post;

        axiosCall(query)
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