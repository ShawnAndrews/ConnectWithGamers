import axios from 'axios';
import { ChatroomUploadImageResponse, ChatroomEmotesResponse } from '../../../../client/client-server-common/common';

/**
 * HTTP request to get all chatroom emotes.
 */
export function httpGetEmotes (): Promise<ChatroomEmotesResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/chatroom/emotes/get`)
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const chatroomEmotesResponse: ChatroomEmotesResponse = result.data;
                return resolve(chatroomEmotesResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to get upload chat message attachment.
 */
export function httpUploadAttachment (imageBase64: string): Promise<ChatroomUploadImageResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/chatroom/attachment/upload`, encodeURIComponent(imageBase64))
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const chatroomAttachmentResponse: ChatroomUploadImageResponse = result.data;
                return resolve(chatroomAttachmentResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}

/**
 * HTTP request to upload a new emote to the chatroom.
 */
export function httpUploadEmote (imageBase64: string, emotePrefix: string, emoteSuffix: string): Promise<ChatroomUploadImageResponse> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/chatroom/emote/upload`, { emoteBase64: imageBase64, emotePrefix: emotePrefix, emoteSuffix: emoteSuffix })
        .then((result) => {
            if (result.data.error) {
                return reject(result.data.error);
            } else {
                const chatroomAttachmentResponse: ChatroomUploadImageResponse = result.data;
                return resolve(chatroomAttachmentResponse);
            }
        })
        .catch((err: string) => {
            return reject(`HTTP error: ${err}.`);
        });
    }); 
}