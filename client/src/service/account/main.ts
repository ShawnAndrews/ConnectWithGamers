import axios from 'axios';
import { ResponseModel } from '../../../../client/client-server-common/common';

export function httpLogin (username: string, password: string, remember: boolean): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/login', {
            username: username,
            password: password,
            remember: remember
        })
        .then((result) => {
            if (result.data === ``) {
                return resolve(result.data);
            } else {
                return reject(result.data);
            }
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}. Exiting program now.`);
            process.exit(1);
        });
    }); 
}

export function httpSignup (username: string, password: string, email: string): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/account/signup', {
            username: username,
            password: password,
            email: email
        })
        .then((result) => {
            if (result.data.errors.length > 0) {
                return reject(result.data);
            } else {
                return resolve(result.data);
            }
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}. Exiting program now.`);
            process.exit(1);
        });
    }); 
}