import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import {
    GenericResponseModel, ChatHistoryResponse, DbChatroomUploadImageResponse, DbChatroomEmotesResponse, ChatroomEmote } from "../../../client/client-server-common/common";
const imgur = require("imgur");

imgur.setClientId(config.imgur.clientId);

class ChatroomModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Add a chat message to the database.
     */
    addChatMessage(username: string, date: number, text: string, image: string, attachment: string, chatroomid: number): Promise<GenericResponseModel> {

        return new Promise( (resolve, reject) => {
            const response: GenericResponseModel = {error: undefined, data: undefined};
            this.insert(
                "dbo.chatroom",
                ["username", "date", "text", "image", "attachment", "chatroomid"],
                [this.sql.VarChar, this.sql.DateTime, this.sql.NVarChar, this.sql.VarChar, this.sql.VarChar, this.sql.VarChar],
                [username, date, text, image, attachment, chatroomid])
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
    getChatHistory(chatroomid: number): Promise<ChatHistoryResponse> {

        return new Promise( (resolve, reject) => {

            this.select(
                "dbo.chatroom",
                ["chatroomid"],
                [this.sql.Int],
                [chatroomid],
                ["username", "date", "text", "image", "attachment"],
                "chatroomid=@chatroomid",
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
     * Get the complete log of all past chatroom messages.
     */
    uploadChatEmote(emoteURL: string, emotePrefix: string, emoteSuffix: string): Promise<void> {

        return new Promise( (resolve, reject) => {

            this.insert("dbo.chatemotes",
                ["prefix", "suffix", "emoteurl", "createdOn"],
                [this.sql.VarChar, this.sql.VarChar, this.sql.VarChar, this.sql.DateTime],
                [emotePrefix, emoteSuffix, emoteURL, Date.now()])
                .then((dbResponse: GenericResponseModel) => {
                    return resolve();
                })
                .catch((err: string) => {
                    console.log(`Error inserting chat emote into database: ${err}`);
                    return reject("Emote name taken.");
                });

        });
    }

    /**
     * Upload base64 string to Imgur and return URL to image.
     */
    uploadImage(imageBase64: string): Promise <DbChatroomUploadImageResponse> {
        return new Promise( (resolve, reject) => {
            imgur.uploadBase64(imageBase64)
                .then((response: any) => {
                    const link: string = response.data.link;
                    const DbChatroomUploadImageResponse: DbChatroomUploadImageResponse = { link: link };
                    return resolve(DbChatroomUploadImageResponse);
                })
                .catch((error: string) => {
                    return reject(`Error uploading chatroom message attachment. ${error}`);
                });

        });
    }

    /**
     * Get chatroom emotes.
     */
    getEmotes(): Promise <DbChatroomEmotesResponse> {
        return new Promise( (resolve, reject) => {
            this.select(
                "dbo.chatemotes",
                [],
                [],
                [],
                ["prefix", "suffix", "emoteurl"])
                .then((dbResponse: GenericResponseModel) => {
                    const dbChatroomEmotesResponse: DbChatroomEmotesResponse = { emotes: undefined };
                    const chatroomEmotes: ChatroomEmote[] = [];

                    dbResponse.data.recordsets[0].forEach((rawEmote: any) => {
                        const chatroomEmote: ChatroomEmote = { link: rawEmote.emoteurl, prefix: rawEmote.prefix, suffix: rawEmote.suffix };
                        chatroomEmotes.push(chatroomEmote);
                    });

                    dbChatroomEmotesResponse.emotes = chatroomEmotes;

                    return resolve(dbChatroomEmotesResponse);
                })
                .catch((err: string) => {
                    return reject(err);
                });
        });
    }

}

export const chatroomModel: ChatroomModel = new ChatroomModel();