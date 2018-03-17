import axios from 'axios';
import { ResponseModel } from '../../../../client/client-server-common/common';

export function httpLoadChatHistory (): Promise<ResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/chatroom/history')
        .then((result) => {
            if (result.data.errors.length === 0) {
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