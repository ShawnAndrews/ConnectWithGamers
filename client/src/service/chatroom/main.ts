import axios from 'axios';
import { GenericResponseModel } from '../../../../client/client-server-common/common';

export function httpLoadChatHistory (): Promise<GenericResponseModel> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/chatroom/history')
        .then((result) => {
            if (result.data.error) {
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