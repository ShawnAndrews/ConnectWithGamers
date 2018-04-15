import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import {
    GenericResponseModel, ChatHistoryResponse } from "../../../client/client-server-common/common";

class ChatroomModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Add a chat message to the database.
     */
    addChatMessage(username: string, date: number, text: string, image: string): Promise<GenericResponseModel> {

        return new Promise( (resolve, reject) => {

            const response: GenericResponseModel = {error: undefined, data: undefined};

            this.insert(
                "dbo.chatroom",
                ["username", "date", "text", "image"],
                [this.sql.VarChar, this.sql.DateTime, this.sql.NVarChar, this.sql.VarChar],
                [username, date, text, image])
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
                ["username", "date", "text", "image"],
                undefined,
                config.chatHistoryCount)
                .then((dbResponse: GenericResponseModel) => {
                    const chatHistoryResponse: ChatHistoryResponse = { name: [], date: [], text: [], image: [] };

                    dbResponse.data.recordsets[0].forEach((chat: any) => {
                        chatHistoryResponse.name.push(chat.username);
                        chatHistoryResponse.date.push(`${new Date(chat.date).toLocaleDateString()} ${new Date(chat.date).toLocaleTimeString()}`);
                        chatHistoryResponse.text.push(chat.text);
                        chatHistoryResponse.image.push(chat.image);
                    });

                    return resolve(chatHistoryResponse);
                })
                .catch((err: string) => {
                    return reject(err);
                });

        });
    }

}

export const chatroomModel: ChatroomModel = new ChatroomModel();