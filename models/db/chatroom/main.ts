import config from "../../../config";
import DatabaseBase from "./../base/dbBase";
import {
    GenericModelResponse, ChatHistoryResponse, ChatroomEmote, DbTableChatroomMessagesFields, DbTables, DbTableChatEmotesFields, DbTableAccountsFields, UserLog, DbTableChatroomUserlistFields } from "../../../client/client-server-common/common";
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
                    const chatHistoryResponse: ChatHistoryResponse = { accountId: [], name: [], date: [], text: [], profile: [], profile_file_extension: [], attachment: [], attachment_file_extension: [], chatroomMessageId: [] };

                    if (rawChats.data.length > 0) {

                        const uniqueUsernames: Set<string> = new Set<string>();

                        rawChats.data.forEach((chat: any) => {
                            uniqueUsernames.add(chat.username);
                        });

                        this.select(
                            DbTables.accounts,
                            DbTableAccountsFields,
                            `${DbTableAccountsFields[2]} IN (${Array.from(uniqueUsernames).map(() => "?").join()})`,
                            Array.from(uniqueUsernames))
                            .then((rawAccounts: GenericModelResponse) => {
                                const usernamesWithProfile: string[] = [];
                                const usernamesWithProfileFileExtension: string[] = [];

                                rawAccounts.data.forEach((account: any) => {
                                    if (account.profile) {
                                        usernamesWithProfile.push(account.username);
                                        usernamesWithProfileFileExtension.push(account.profile_file_extension);
                                    }
                                });

                                rawChats.data.forEach((chat: any) => {
                                    const chatAccountId: number = rawAccounts.data.find((x: any) => x.username === chat.username).accounts_sys_key_id;
                                    const chatAccountIndex: number = usernamesWithProfile.findIndex((x: string) => x === chat.username);
                                    const chatAccountHasProfile: boolean = chatAccountIndex !== -1;

                                    chatHistoryResponse.accountId.push(chatAccountId);
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
                                return reject(err);
                            });

                    } else {
                        return resolve(chatHistoryResponse);
                    }

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

    /**
     * Get chatroom userlist.
     */
    getChatroomUserlist(): Promise <UserLog[]> {
        return new Promise( (resolve, reject) => {
            this.select(
                DbTables.chatroom_userlist,
                DbTableChatroomUserlistFields)
                .then((dbResponse: GenericModelResponse) => {
                    const userLog: UserLog[] = [];

                    dbResponse.data.forEach((rawUser: any) => {
                        const user: UserLog = { accountId: rawUser.accounts_sys_key_id, log_dt: rawUser.log_dt };
                        userLog.push(user);
                    });

                    return resolve(userLog);
                })
                .catch((err: string) => {
                    return reject(err);
                });
        });
    }

    /**
     * Insert chatroom userlist.
     */
    insertChatroomUserlist(user: UserLog): Promise <void> {

        return new Promise( (resolve, reject) => {
            this.insert(
                DbTables.chatroom_userlist,
                DbTableChatroomUserlistFields,
                [user.accountId, user.log_dt],
                DbTableChatroomUserlistFields.map(() => "?").join())
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.error) {
                        return reject(dbResponse.error);
                    } else {
                        return resolve();
                    }
                });
        });

    }

    /**
     * Update user in chatroom userlist.
     */
    updateChatroomUserlist(user: UserLog): Promise <void> {

        return new Promise( (resolve, reject) => {

            this.update(
                DbTables.chatroom_userlist,
                `${DbTableChatroomUserlistFields[1]}=?`,
                [user.log_dt],
                `${DbTableChatroomUserlistFields[0]}=?`,
                [user.accountId])
                .then(() => {
                    return resolve();
                })
                .catch((error: string) => {
                    return reject(`Database error. ${error}`);
                });

        });

    }

}

export const chatroomModel: ChatroomModel = new ChatroomModel();