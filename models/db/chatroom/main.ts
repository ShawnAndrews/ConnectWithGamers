import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import {
    GenericModelResponse, ChatHistoryResponse, ChatroomEmote, DbTableChatroomMessagesFields, DbTables, DbTableChatEmotesFields, DbTableAccountsFields } from "../../../client/client-server-common/common";
import { SecurityCacheEnum } from "../security/main";
const fs = require("fs");

Object.keys(SecurityCacheEnum).forEach((SecurityCacheEnum: string) => {
    const outputFolderPath: string = `cache/chatroom/${SecurityCacheEnum}`;

    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
    }
});

class ChatroomModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Add a chat message to the database.
     */
    addChatMessage(username: string, date: number, text: string, profile: boolean, attachment: boolean, attachmentFileExtension: string, chatroomid: number): Promise<number> {

        return new Promise( (resolve, reject) => {
            const response: GenericModelResponse = {error: undefined, data: undefined};

            this.insert(
                DbTables.chatroom_messages,
                DbTableChatroomMessagesFields.slice(1),
                [username, text, attachment, attachmentFileExtension, chatroomid, date / 1000],
                "?, ?, ?, ?, ?, FROM_UNIXTIME(?)")
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.error) {
                        return reject(dbResponse.error);
                    } else {
                        return resolve(dbResponse.data.insertId);
                    }
                });

        });

    }

    /**
     * Delete a chat message from the database.
     */
    deleteChatMessage(messageid: number): Promise<GenericModelResponse> {

        return new Promise( (resolve, reject) => {
            const response: GenericModelResponse = {error: undefined, data: undefined};

            this.delete(
                DbTables.chatroom_messages,
                [`${DbTableChatroomMessagesFields[0]}=?`],
                [messageid])
                .then((dbResponse: GenericModelResponse) => {
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
                DbTables.chatroom_messages,
                DbTableChatroomMessagesFields,
                `${DbTableChatroomMessagesFields[5]}=?`,
                [chatroomid],
                config.chatHistoryCount)
                .then((rawChats: GenericModelResponse) => {
                    const uniqueUsernames: Set<string> = new Set<string>();

                    rawChats.data.forEach((chat: any) => {
                        uniqueUsernames.add(chat.name);
                    });

                    this.select(
                        DbTables.accounts,
                        DbTableAccountsFields,
                        `${DbTableAccountsFields[5]} IN (?)`,
                        [Array.from(uniqueUsernames).join()])
                        .then((rawAccounts: GenericModelResponse) => {
                            const usernamesWithProfile: string[] = [];
                            const usernamesWithProfileFileExtension: string[] = [];

                            rawAccounts.data.forEach((account: any) => {
                                if (account.profile) {
                                    usernamesWithProfile.push(account.username);
                                    usernamesWithProfileFileExtension.push(account.profile_file_extension);
                                }
                            });

                            const chatHistoryResponse: ChatHistoryResponse = { name: [], date: [], text: [], profile: [], profile_file_extension: [], attachment: [], attachment_file_extension: [], chatroomMessageId: [] };

                            rawChats.data.forEach((chat: any) => {
                                const chatAccountIndex: number = usernamesWithProfile.findIndex((x: string) => x === chat.username);
                                const chatAccountHasProfile: boolean = chatAccountIndex !== -1;

                                chatHistoryResponse.name.push(chat.username);
                                chatHistoryResponse.date.push(`${new Date(chat.log_dt).toLocaleDateString()} ${new Date(chat.log_dt).toLocaleTimeString()}`);
                                chatHistoryResponse.text.push(chat.text);
                                chatHistoryResponse.profile.push(chatAccountHasProfile ? true : false);
                                chatHistoryResponse.profile_file_extension.push(chatAccountHasProfile ? usernamesWithProfileFileExtension[chatAccountIndex] : "");
                                chatHistoryResponse.attachment.push(chat.attachment);
                                chatHistoryResponse.attachment_file_extension.push(chat.attachment_file_extension || "");
                                chatHistoryResponse.chatroomMessageId.push(chat.chatroom_messages_sys_key_id);
                            });

                            return resolve(chatHistoryResponse);
                        })
                        .catch((err: string) => {
                            console.log(`Failed to get accounts!! ${err}`);
                            return reject(err);
                        });

                })
                .catch((err: string) => {
                    return reject(err);
                });

        });
    }

    /**
     * Upload a new chat emote.
     */
    uploadChatEmote(emotePrefix: string, emoteSuffix: string, fileExtension: string): Promise < number > {

        return new Promise( (resolve, reject) => {

            this.insert(
                DbTables.chat_emotes,
                DbTableChatEmotesFields.slice(1),
                [emotePrefix, emoteSuffix, fileExtension, Date.now() / 1000],
                "?, ?, ?, FROM_UNIXTIME(?)")
                .then((dbResponse: GenericModelResponse) => {
                    const insertid: number = dbResponse.data.insertId;
                    return resolve(insertid);
                })
                .catch((err: string) => {
                    return reject("Emote name taken.");
                });

        });
    }

    /**
     * Delete a chat emote.
     */
    deleteChatEmote(emotePrefix: string, emoteSuffix: string): Promise < GenericModelResponse > {
        return new Promise( (resolve, reject) => {
            this.delete(
                DbTables.chat_emotes,
                [`${DbTableChatEmotesFields[1]}=?`, `${DbTableChatEmotesFields[2]}=?`],
                [emotePrefix, emoteSuffix])
                .then((dbResponse: GenericModelResponse) => {
                    return resolve(dbResponse);
                })
                .catch((err: string) => {
                    return reject("Emote does not exist for deletion.");
                });
        });
    }

    /**
     * Get chatroom emotes.
     */
    getEmotes(): Promise < ChatroomEmote[] > {
        return new Promise( (resolve, reject) => {
            this.select(
                DbTables.chat_emotes,
                DbTableChatEmotesFields)
                .then((dbResponse: GenericModelResponse) => {
                    const chatroomEmotes: ChatroomEmote[] = [];

                    dbResponse.data.forEach((rawEmote: any) => {
                        const chatroomEmote: ChatroomEmote = { fileExtension: rawEmote.file_extension, prefix: rawEmote.prefix, suffix: rawEmote.suffix };
                        chatroomEmotes.push(chatroomEmote);
                    });

                    return resolve(chatroomEmotes);
                })
                .catch((err: string) => {
                    return reject(err);
                });
        });
    }

}

export const chatroomModel: ChatroomModel = new ChatroomModel();