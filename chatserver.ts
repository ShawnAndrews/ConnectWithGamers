import { Express } from "express";
const socketIO: SocketIO.Server = require("socket.io");
const express = require("express");
const app: Express = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
import { UserLog, GenericModelResponse, ChatHistoryResponse, SingleChatHistory, AccountInfo, CHATROOM_EVENTS, AccountsInfo, ChatroomEmote } from "./client/client-server-common/common";
import { securityModel, SecurityCacheEnum } from "./models/db/security/main";
import { chatroomModel } from "./models/db/chatroom/main";
import { accountModel } from "./models/db/account/main";
import { AUTH_TOKEN_NAME } from "./client/client-server-common/common";
import config from "./config";
import { NextFunction } from "connect";

const secureServer = config.useStrictlyHttps ? https.createServer({ key: fs.readFileSync(config.https.key), cert: fs.readFileSync(config.https.cert), ca: fs.readFileSync(config.https.ca) }, app) : undefined;
const chatServer = config.useStrictlyHttps ? https.Server(secureServer) : http.Server(app);


startChatServer();

function startChatServer(): void {
    const chatHandler: SocketIO.Server = socketIO.listen(chatServer, {origins: `*:*`});

    // listen to chatroom port
    chatServer.listen(config.chatPort);

    // update chatroom userlist every minute
    setInterval(() => {
        chatHandler.emit(CHATROOM_EVENTS.UpdateUsers);
    }, 60 * 1000);

    const encodeEmotes = (emotes: ChatroomEmote[], text: string): string => {
        let encodedText: string = text;

         emotes.forEach((chatroomEmote: ChatroomEmote) => {
            const emoteName: string = `${chatroomEmote.prefix}${chatroomEmote.suffix}`;
            const emoteLink: string = `/cache/chatroom/emote/${emoteName}.${chatroomEmote.fileExtension}`;
            encodedText = encodedText.replace(new RegExp(` ${emoteName}`, "g"), ` ${emoteLink}`);
        });

        return encodedText;
    };

    // authentication middleware
    chatHandler.use((socket: SocketIO.Socket, next: NextFunction) => {

        const loggedIn: boolean = socket.handshake.headers.cookie && socket.handshake.headers.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

        if (loggedIn) {

            // authorize
            securityModel.authorize(socket.handshake.headers.cookie)
            .then((accountId: number) => {
                const accountid: number = accountId;
                refreshUserActivity(accountid, socket, chatHandler)
                    .catch((error: string) => {
                        console.log(`Chatroom error refreshing user activity: ${error}`);
                    });
            })
            .catch((error: string) => {
                console.log(`Chat error authorizing: ${error}`);
                socket.disconnect();
            });

        }

        next();

    });

    chatHandler.on("connection", (socket: SocketIO.Socket) => {

        socket.on("disconnect", () => {
            // do nothing
        });

        socket.on(CHATROOM_EVENTS.GetMessageHistory, (data: any) => {

            const chatroomid: number = data.chatroomid;
            chatroomModel.getChatHistory(chatroomid)
                .then((chats: ChatHistoryResponse) => {
                    chatroomModel.getEmotes()
                    .then((emotes: ChatroomEmote[]) => {
                        for (let i = 0; i < chats.text.length; i++) {
                            chats.text[i] = encodeEmotes(emotes, chats.text[i]);
                        }
                        socket.emit(CHATROOM_EVENTS.MessageHistory, chats);
                    });
                })
                .catch((error: string) => {
                    console.log(`Error retrieving chat history: ${error}`);
                });

        });

        socket.on(CHATROOM_EVENTS.GetAllUsers, (data: any) => {

            getAllUserIds()
            .then((userIds: number[]) => {
                if (userIds.length === 0) {
                    socket.emit(CHATROOM_EVENTS.GetAllUsers, []);
                } else {
                    accountModel.getAccountsInfoById(userIds)
                        .then((dbUsers: AccountsInfo) => {
                            getAllUserInfo(dbUsers)
                            .then((allUserInfo: AccountInfo[]) => {
                                socket.emit(CHATROOM_EVENTS.GetAllUsers, allUserInfo);
                            })
                            .catch((error: string) => {
                                console.log(`Chatroom error getting all users info: ${error}`);
                            });
                        })
                        .catch((err: string) => {
                            console.log(`Database error: ${err}`);
                            socket.disconnect();
                        });
                }
            })
            .catch((error: string) => {
                console.log(`Chatroom error getting all user ids: ${error}`);
            });

        });

        socket.on(CHATROOM_EVENTS.SearchUsers, (data: any) => {
            const usernameFilter: string = data.filter;

            accountModel.getAccountsByUsernameFilter(usernameFilter)
                .then((dbUsers: AccountsInfo) => {
                    getAllUserInfo(dbUsers)
                        .then((allUserInfo: AccountInfo[]) => {
                            socket.emit(CHATROOM_EVENTS.Users, allUserInfo);
                        })
                        .catch((error: string) => {
                            console.log(`Chatroom error getting all users info: ${error}`);
                        });
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    socket.disconnect();
                });

        });

        socket.on(CHATROOM_EVENTS.PostMessage, (data: any) => {
            const imageBase64: string = data.attachmentBase64 && data.attachmentBase64.split(",")[1];
            let accountid: number = undefined;
            let username: string = undefined;
            let date: number = undefined;
            let text: string = undefined;
            let profile: boolean = undefined;
            let profile_file_extension: string = undefined;
            let attachment: boolean = undefined;
            let attachmentFileExtension: string = undefined;
            let chatroomId: number = undefined;
            let chatroom_messages_sys_key_id: number = undefined;

            const loggedIn: boolean = socket.handshake.headers.cookie && socket.handshake.headers.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

            const sendMessage = (): void => {
                accountModel.getAccountsInfoById([accountid])
                .then((accountsInfo: AccountsInfo) => {
                    const accountInfo: AccountInfo = accountsInfo.accounts[0];

                    date = Date.now();
                    text = ` ${data.text}`;
                    profile = accountInfo.profile;
                    profile_file_extension = accountInfo.profile_file_extension;
                    attachment = data.attachmentBase64 ? true : false;
                    attachmentFileExtension = data.attachmentFileExtension;
                    chatroomId = data.chatroomId;
                    return chatroomModel.addChatMessage(username, date, text, profile, attachment, attachmentFileExtension, chatroomId);
                })
                .then((insertId: number) => {
                    chatroom_messages_sys_key_id = insertId;
                    return securityModel.uploadImage(imageBase64, SecurityCacheEnum.attachment, attachmentFileExtension, chatroom_messages_sys_key_id.toString());
                })
                .then(() => {
                    return chatroomModel.getEmotes();
                })
                .then((emotes: ChatroomEmote[]) => {
                    const encodedText: string = encodeEmotes(emotes, text);
                    const newChat: SingleChatHistory = { accountId: accountid, name: username, date: new Date(date), text: encodedText, profile: profile, profileFileExtension: profile_file_extension, attachment: attachment, attachmentFileExtension: attachmentFileExtension, chatroomId: chatroomId, chatroomMessageId: chatroom_messages_sys_key_id };
                    socket.emit(CHATROOM_EVENTS.Message, newChat);
                    socket.broadcast.emit(CHATROOM_EVENTS.Message, newChat);
                })
                .catch((error: string) => {
                    console.log(`Chat error trying to post message: ${error}`);
                    socket.disconnect();
                });
            };

            // get accountid and username for posting
            if (loggedIn) {

                // authorize
                securityModel.authorize(socket.handshake.headers.cookie)
                .then((accountId: number) => {
                    accountid = accountId;
                    return refreshUserActivity(accountid, socket, chatHandler);
                })
                .then(() => {
                    return accountModel.getAccountUsername(accountid);
                })
                .then((response: GenericModelResponse) => {
                    username = response.data.username;
                    sendMessage();
                })
                .catch((error: string) => {
                    console.log(`Chat error trying to get username: ${error}`);
                    socket.disconnect();
                });

            } else {
                username = "Anonymous";

                // get accountid of anonymous user
                accountModel.getAccountId(username)
                .then((response: GenericModelResponse) => {
                    accountid = response.data.accountid;
                    return refreshUserActivity(accountid, socket, chatHandler);
                })
                .then(() => {
                    sendMessage();
                })
                .catch((error: string) => {
                    console.log(`Chat error trying to get username: ${error}`);
                    socket.disconnect();
                });

            }

        });
    });
}

/**
 * Get the last activity time by account id.
 */
export function getLastActiveById(accountid: number): Promise<Date> {

    return new Promise((resolve: any, reject: any) => {
        chatroomModel.getChatroomUserlist()
        .then((userLog: UserLog[]) => {
            return getLastActiveByIdSync(userLog, accountid);
        })
        .catch((error: string) => {
            return reject(error);
        });
    });

}

function getLastActiveByIdSync(userLog: UserLog[], accountid: number): Date {
    for (let i = 0; i < userLog.length; i++) {
        if (userLog[i].accountId === accountid ) {
            return userLog[i].log_dt;
        }
    }
    return undefined;
}

/**
 * Refresh chatroom user's activity.
 */
export function refreshUserActivity(accountId: number, socket: any, chatHandler: any): Promise<void> {

    return new Promise((resolve: any, reject: any) => {
        chatroomModel.getChatroomUserlist()
            .then((userLog: UserLog[]) => {
                const currentTime: Date = new Date();
                const user: UserLog = { accountId: accountId, log_dt: currentTime };
                const userAlreadyExists: boolean = userLog.findIndex((x: UserLog) => x.accountId === accountId) !== -1;
                let promiseToDo: Promise<void> = undefined;

                if (!userAlreadyExists) {
                    promiseToDo = chatroomModel.insertChatroomUserlist(user);
                } else {
                    promiseToDo = chatroomModel.updateChatroomUserlist(user);
                }

                promiseToDo
                .then(() => {
                    chatHandler.emit(CHATROOM_EVENTS.UpdateUsers);
                    return resolve();
                })
                .catch((err: string) => {
                    return reject(err);
                });

            })
            .catch((error: string) => {
                return reject(error);
            });
    });

}

/**
 * Get the account ids of all users in chatroom.
 */
export function getAllUserIds(): Promise<number[]> {

    return new Promise((resolve: any, reject: any) => {
        chatroomModel.getChatroomUserlist()
        .then((userLog: UserLog[]) => {
            let userLogIds: number[] = [];
            if (userLog.length !== 0) {
                userLogIds = userLog.map((user: UserLog) => { return user.accountId; });
            }
            return resolve(userLogIds);
        })
        .catch((error: string) => {
            return reject(error);
        });
    });

}

/**
 * Get info about all users in chatroom.
 */
export function getAllUserInfo(dbUsers: AccountsInfo): Promise<AccountInfo[]> {

    return new Promise((resolve: any, reject: any) => {
        chatroomModel.getChatroomUserlist()
        .then((userLog: UserLog[]) => {
            const AccountInfos: AccountInfo[] = [];

            dbUsers.accounts.forEach((element: AccountInfo) => {
                const now: any = new Date();
                const lastActive: Date = getLastActiveByIdSync(userLog, element.accountid);
                const lastActiveMinsAgo: number = lastActive ? Math.abs(Math.round(((new Date(lastActive).getTime() - now.getTime()) / 1000 / 60))) : -1;
                const AccountInfo: AccountInfo = { ...element, last_active: lastActiveMinsAgo };
                AccountInfos.push(AccountInfo);
            });

            return resolve(AccountInfos);
        })
        .catch((error: string) => {
            return reject(error);
        });
    });

}