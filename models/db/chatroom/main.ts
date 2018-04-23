import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import {
    GenericResponseModel, ChatHistoryResponse, DbChatroomAttachmentResponse } from "../../../client/client-server-common/common";
const imgur = require("imgur");

imgur.setClientId(config.imgur.clientId);

class ChatroomModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Add a chat message to the database.
     */
    addChatMessage(username: string, date: number, text: string, image: string, attachment: string): Promise<GenericResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: GenericResponseModel = {error: undefined, data: undefined};
            this.insert(
                "dbo.chatroom",
                ["username", "date", "text", "image", "attachment"],
                [this.sql.VarChar, this.sql.DateTime, this.sql.NVarChar, this.sql.VarChar, this.sql.VarChar],
                [username, date, text, image, attachment])
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.error) {
                        return reject(dbResponse.error);
                    } else {
                        return resolve(response);
                    }
                });

        });

    }

    /**
     * Get the complete log of all past chatroom messages.
     */
    getChatHistory(): Promise<ChatHistoryResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.chatroom",
                [],
                [],
                [],
                ["username", "date", "text", "image", "attachment"],
                undefined,
                config.chatHistoryCount)
                .then((dbResponse: GenericResponseModel) => {
                    const chatHistoryResponse: ChatHistoryResponse = { name: [], date: [], text: [], image: [], attachment: [] };

                    dbResponse.data.recordsets[0].forEach((chat: any) => {
                        chatHistoryResponse.name.push(chat.username);
                        chatHistoryResponse.date.push(`${new Date(chat.date).toLocaleDateString()} ${new Date(chat.date).toLocaleTimeString()}`);
                        chatHistoryResponse.text.push(chat.text);
                        chatHistoryResponse.image.push(chat.image);
                        chatHistoryResponse.attachment.push(chat.attachment);
                    });

                    return resolve(chatHistoryResponse);
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });
    }

    /**
     * Upload chatroom message attachment.
     */
    uploadAttachment(imageBase64: string): Promise<DbChatroomAttachmentResponse> {
        return new Promise( (resolve, reject) => {
            imgur.uploadBase64(imageBase64)
                .then((response: any) => {
                    const link: string = response.data.link;
                    const dbChatroomAttachmentResponse: DbChatroomAttachmentResponse = { link: link };
                    return resolve(dbChatroomAttachmentResponse);
                })
                .catch((error: string) => {
                    return reject(`Error uploading chatroom message attachment. ${error}`);
                });

        });
    }

}

export const chatroomModel: ChatroomModel = new ChatroomModel();