import { Express } from "express";
const socketIO: SocketIO.Server = require("socket.io");
const express = require("express");
const app: Express = express();
const http = require("http");
const https = require("https");
const redis = require("redis");
const fs = require("fs");
const redisClient = redis.createClient();
import { redisCache, IGDBCacheEntry, UserLog, GenericModelResponse, ChatHistoryResponse, SingleChatHistory, AccountInfo, CHATROOM_EVENTS, AccountsInfo, ChatroomEmote } from "./client/client-server-common/common";
import { securityModel } from "./models/db/security/main";
import { chatroomModel } from "./models/db/chatroom/main";
import { accountModel } from "./models/db/account/main";
import { AUTH_TOKEN_NAME } from "./client/client-server-common/common";
import config from "./config";
import { NextFunction } from "connect";

const secureServer = config.useStrictlyHttps ? https.createServer({ key: fs.readFileSync(config.https.key), cert: fs.readFileSync(config.https.cert), ca: fs.readFileSync(config.https.ca) }, app) : undefined;
const chatServer = config.useStrictlyHttps ? https.Server(secureServer) : http.Server(app);


startChatServer();

function startChatServer(): void {
    const chatHandler: SocketIO.Server = socketIO.listen(chatServer);

    // listen to chatroom port
    chatServer.listen(config.chatPort);

    // update chatroom userlist every minute
    setInterval(() => {
        chatHandler.emit(CHATROOM_EVENTS.UpdateUsers);
    }, 60 * 1000);

    const encodeEmotes = (emotes: ChatroomEmote[], text: string): string => {
        let encodedText: string = text;

         emotes.forEach((chatroomEmote: ChatroomEmote) => {
            const emoteLink: string = chatroomEmote.link;
            const emoteName: string = `${chatroomEmote.prefix}${chatroomEmote.suffix}`;
            let foundPos: number = encodedText.indexOf(emoteName);
            while (foundPos !== -1) {
                encodedText = encodedText.substring(0, foundPos) + emoteLink + encodedText.substring(foundPos + emoteName.length);
                foundPos = encodedText.indexOf(emoteName);
            }
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
            let accountid: number = undefined;
            let username: string = undefined;
            let date: number = undefined;
            let text: string = undefined;
            let image: string = undefined;
            let attachment: string = undefined;
            let chatroomid: number = undefined;

            const loggedIn: boolean = socket.handshake.headers.cookie && socket.handshake.headers.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

            const sendMessage = (): void => {
                accountModel.getAccountImage(accountid)
                .then((link: string) => {
                    date = Date.now();
                    text = data.text;
                    image = link;
                    attachment = data.attachment;
                    chatroomid = data.chatroomid;
                    return chatroomModel.addChatMessage(username, date, text, image, attachment, chatroomid);
                })
                .then(() => {
                    return chatroomModel.getEmotes();
                })
                .then((emotes: ChatroomEmote[]) => {
                    const encodedText: string = encodeEmotes(emotes, text);
                    const newChat: SingleChatHistory = { name: username, date: new Date(date), text: encodedText, image: image, attachment: attachment, chatroomid: chatroomid };
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
        getCachedChatUsers()
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
        if (userLog[i].accountid === accountid ) {
            return userLog[i].lastActive;
        }
    }
    return undefined;
}

/**
 * Refresh chatroom user's activity.
 */
export function refreshUserActivity(userAccountId: number, socket: any, chatHandler: any): Promise<void> {

    return new Promise((resolve: any, reject: any) => {
        getCachedChatUsers()
        .then((userLog: UserLog[]) => {
            const currentTime: Date = new Date();
            if (userLog.length === 0) {
                // insert (if empty)
                userLog.push({ accountid: userAccountId, lastActive: currentTime });
            } else {
                for (let i = 0; i < userLog.length; i++) {
                    if (userLog[i].accountid === userAccountId ) {
                        // update
                        userLog[i].lastActive = currentTime;
                        break;
                    }
                    if (i === userLog.length - 1) {
                        // insert (if not empty)
                        userLog.push({ accountid: userAccountId, lastActive: currentTime });
                        break;
                    }
                }
            }
            cacheChatUsers(userLog)
            .then(() => {
                chatHandler.emit(CHATROOM_EVENTS.UpdateUsers);
                return resolve();
            })
            .catch((error: string) => {
                return reject(error);
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
        getCachedChatUsers()
        .then((userLog: UserLog[]) => {
            let userLogIds: number[] = [];
            if (userLog.length !== 0) {
                userLogIds = userLog.map((user: UserLog) => { return user.accountid; });
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
        getCachedChatUsers()
        .then((userLog: UserLog[]) => {
            const AccountInfos: AccountInfo[] = [];
            dbUsers.accounts.forEach((element: AccountInfo) => {
                const now: any = new Date();
                const lastActive: Date = getLastActiveByIdSync(userLog, element.accountid);
                const lastActiveMinsAgo: number = lastActive ? Math.abs(Math.round(((new Date(lastActive).getTime() - now.getTime()) / 1000 / 60))) : -1;
                const AccountInfo: AccountInfo = { username: element.username, steam: element.steam, discord: element.discord, twitch: element.twitch, image: element.image, last_active: lastActiveMinsAgo };
                AccountInfos.push(AccountInfo);
            });
            return resolve(AccountInfos);
        })
        .catch((error: string) => {
            return reject(error);
        });
    });

}


/**
 * Get redis-cached users in chatroom.
 */
export function getCachedChatUsers(): Promise<UserLog[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedChatUsers: string) => {
            if (error) {
                return reject(error);
            }
            if (!stringifiedChatUsers) {
                return resolve([]);
            }
            return resolve(JSON.parse(stringifiedChatUsers));
        });
    });

}

/**
 * Cache users in chatroom.
 */
export function cacheChatUsers(userLog: UserLog[]): Promise<void> {
    const cacheEntry: IGDBCacheEntry = redisCache[0];

    return new Promise((resolve: any, reject: any) => {

        redisClient.set(cacheEntry.key, JSON.stringify(userLog));

        if (cacheEntry.expiry !== -1) {
            redisClient.expire(cacheEntry.key, cacheEntry.expiry);
        }

        return resolve();
    });

}