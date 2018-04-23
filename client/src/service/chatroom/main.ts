import axios from 'axios';
import { GenericResponseModel, ChatroomAttachmentResponse } from '../../../../client/client-server-common/common';

/**
 * HTTP request to get upload chat message attachment.
 */
export function httpUploadAttachment (imageBase64: string): Promise<ChatroomAttachmentResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/chatroom/attachment/upload`, encodeURIComponent(imageBase64))
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const chatroomAttachmentResponse: ChatroomAttachmentResponse = result.data;
                return resolve(chatroomAttachmentResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}