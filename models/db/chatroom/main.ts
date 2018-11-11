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
                "chatroom",
                ["username", "date", "text", "image", "attachment", "chatroomid"],
                [username, date / 1000, text, image, attachment, chatroomid],
                "?, FROM_UNIXTIME(?), ?, ?, ?, ?")
                .then((dbResponse: GenericResponseModel) => {
                    if (dbResponse.error) {
                        return reject(dbResponse.error);
                    } else {
                        response.data = { insertid: dbResponse.data.insertId };
                        return resolve(response);
                    }
                });

        });

    }

    /**
     * Delete a chat message from the database.
     */
    deleteChatMessage(messageid: number): Promise<GenericResponseModel> {

        return new Promise( (resolve, reject) => {
            const response: GenericResponseModel = {error: undefined, data: undefined};

            this.delete(
                "chatroom",
                ["id=?"],
                [messageid])
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
                "chatroom",
                ["username", "date", "text", "image", "attachment"],
                "chatroomid=?",
                [chatroomid],
                config.chatHistoryCount)
                .then((dbResponse: GenericResponseModel) => {
                    const chatHistoryResponse: ChatHistoryResponse = { name: [], date: [], text: [], image: [], attachment: [] };

                    dbResponse.data.forEach((chat: any) => {
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
     * Upload a new chat emote.
     */
    uploadChatEmote(emoteURL: string, emotePrefix: string, emoteSuffix: string): Promise<number> {

        return new Promise( (resolve, reject) => {

            this.insert("chatemotes",
                ["prefix", "suffix", "emoteurl", "createdOn"],
                [emotePrefix, emoteSuffix, emoteURL, Date.now() / 1000],
                "?, ?, ?, FROM_UNIXTIME(?)")
                .then((dbResponse: GenericResponseModel) => {
                    const insertid: number = dbResponse.data.insertId;
                    return resolve(insertid);
                })
                .catch((err: string) => {
                    console.log(`Error inserting chat emote into database: ${err}`);
                    return reject("Emote name taken.");
                });

        });
    }

    /**
     * Delete a chat emote.
     */
    deleteChatEmote(emotePrefix: string, emoteSuffix: string): Promise<GenericResponseModel> {
        return new Promise( (resolve, reject) => {
            this.delete("chatemotes",
                ["prefix=?", "suffix=?"],
                [emotePrefix, emoteSuffix])
                .then((dbResponse: GenericResponseModel) => {
                    return resolve(dbResponse);
                })
                .catch((err: string) => {
                    console.log(`Error deleting chat emote from database: ${err}`);
                    return reject("Emote does not exist for deletion.");
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
                "chatemotes",
                ["prefix", "suffix", "emoteurl"])
                .then((dbResponse: GenericResponseModel) => {
                    const dbChatroomEmotesResponse: DbChatroomEmotesResponse = { emotes: undefined };
                    const chatroomEmotes: ChatroomEmote[] = [];

                    dbResponse.data.forEach((rawEmote: any) => {
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