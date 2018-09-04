const socketIO = require("socket.io");
const express = require("express");
const router = express.Router();
import { GenericResponseModel, ChatHistoryResponse, SingleChatHistory, ChatroomUser, CHATROOM_EVENTS, DbChatroomEmotesResponse, DbChatroomUploadEmoteResponse, DbAuthorizeResponse, DbAccountsInfoResponse, DbAccountImageResponse, DbChatroomUploadImageResponse, ChatroomUploadImageResponse, AccountInfo, ChatroomEmotesResponse, ChatroomEmote } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { securityModel } from "../../models/db/security/main";
import { chatroomModel } from "../../models/db/chatroom/main";
import { accountModel } from "../../models/db/account/main";
import { AUTH_TOKEN_NAME } from "../../client/client-server-common/common";

const routes = new routeModel();

interface UserLog {
    accountid: number;
    lastActive: Date;
}

/* routes */
routes.addRoute("emote/upload", "/emote/upload");
routes.addRoute("attachment/upload", "/attachment/upload");
routes.addRoute("emotes/get", "/emotes/get");

router.post(routes.getRoute("emotes/get"), (req: any, res: any) => {
    const chatroomEmotesResponse: ChatroomEmotesResponse = { error: undefined };
    chatroomModel.getEmotes()
    .then((response: DbChatroomEmotesResponse) => {
        chatroomEmotesResponse.emotes = response.emotes;
        return res
        .send(chatroomEmotesResponse);
    })
    .catch((error: string) => {
        chatroomEmotesResponse.error = error;
        return res
        .send(chatroomEmotesResponse);
    });

});

router.post(routes.getRoute("emote/upload"), (req: any, res: any) => {
    const chatroomEmoteUploadResponse: GenericResponseModel = { error: undefined, data: undefined };
    const imageBase64: string = req.body.emoteBase64.split(",")[1];
    const emotePrefix: string = req.body.emotePrefix;
    const emoteSuffix: string = req.body.emoteSuffix;

    chatroomModel.uploadImage(imageBase64)
    .then((response: DbChatroomUploadEmoteResponse) => {
        const emoteURL: string = response.link;
        return chatroomModel.uploadChatEmote(emoteURL, emotePrefix, emoteSuffix);
    })
    .then(() => {
        return res
        .send(chatroomEmoteUploadResponse);
    })
    .catch((error: string) => {
        chatroomEmoteUploadResponse.error = error;
        return res
        .send(chatroomEmoteUploadResponse);
    });

});

router.post(routes.getRoute("attachment/upload"), (req: any, res: any) => {
    const chatroomAttachmentResponse: ChatroomUploadImageResponse = { error: undefined };
    const imageBase64: string = Object.keys(req.body)[0].split(",")[1];

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return chatroomModel.uploadImage(imageBase64);
    })
    .then((response: DbChatroomUploadImageResponse) => {
        chatroomAttachmentResponse.link = response.link;
        return res
        .send(chatroomAttachmentResponse);
    })
    .catch((error: string) => {
        chatroomAttachmentResponse.error = error;
        return res
        .send(chatroomAttachmentResponse);
    });

});

export default function registerChatHandlers(chatServer: any): void {
    const chatHandler = socketIO.listen(chatServer);
    const usersInChat: UserLog[] = [];

    setInterval((): void => {
        chatHandler.emit(CHATROOM_EVENTS.UpdateUsers);
    }, 60 * 1000);

    const getLastActiveById = (accountid: number): Date => {
        for (let i = 0; i < usersInChat.length; i++) {
            if (usersInChat[i].accountid === accountid ) {
                return usersInChat[i].lastActive;
            }
        }
        return new Date();
    };

    const refreshUserActivity = (userAccountId: number, socket: any): void => {
        const currentTime: Date = new Date();
        if (usersInChat.length === 0) {
            // insert (if empty)
            usersInChat.push({ accountid: userAccountId, lastActive: currentTime });
            return;
        }
        for (let i = 0; i < usersInChat.length; i++) {
            if (usersInChat[i].accountid === userAccountId ) {
                // update
                usersInChat[i].lastActive = currentTime;
                break;
            }
            if (i === usersInChat.length - 1) {
                // insert (if not empty)
                usersInChat.push({ accountid: userAccountId, lastActive: currentTime });
                break;
            }
        }
        chatHandler.emit(CHATROOM_EVENTS.UpdateUsers);
        return;
    };

    const encodeEmotes = (emotes: ChatroomEmote[], text: string): string => {
        let encodedText: string = text;

         emotes.forEach((chatroomEmote: ChatroomEmote) => {
            const emoteLink: string = chatroomEmote.link;
            const emoteName: string = `${chatroomEmote.prefix}${chatroomEmote.suffix}`;
            let foundPos: number = encodedText.indexOf(emoteName);
            while (foundPos !== -1) {
                const replacementEncoding: string = `:::${emoteLink}:::`;
                encodedText = encodedText.substring(0, foundPos) + replacementEncoding + encodedText.substring(foundPos + emoteName.length);
                foundPos = encodedText.indexOf(emoteName);
            }
        });

        return encodedText;
    };

    // authentication middleware
    chatHandler.use((socket: any, next: any) => {

        const loggedIn: boolean = socket.handshake.headers.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

        if (loggedIn) {

            // authorize
            securityModel.authorize(socket.handshake.headers.cookie)
            .then((response: DbAuthorizeResponse) => {
                const accountid: number = response.accountid;
                refreshUserActivity(accountid, socket);
            })
            .catch((error: string) => {
                console.log(`Chat error authorizing: ${error}`);
                socket.disconnect();
            });

        }

        next();

    });

    chatHandler.on("connection", (socket: any) => {

        socket.on("disconnect", () => {
            // do nothing
        });

        socket.on(CHATROOM_EVENTS.GetMessageHistory, (data: any) => {

            const chatroomid: number = data.chatroomid;
            chatroomModel.getChatHistory(chatroomid)
                .then((chats: ChatHistoryResponse) => {
                    chatroomModel.getEmotes()
                    .then((response: DbChatroomEmotesResponse) => {
                        const emotes: ChatroomEmote[] = response.emotes;
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

            const activeUserIds: number[] = [];

            usersInChat.forEach((element: any) => {
                activeUserIds.push(element.accountid);
            });
            if (activeUserIds.length === 0) {
                socket.emit(CHATROOM_EVENTS.GetAllUsers, []);
            } else {
                accountModel.getAccountsInfoById(activeUserIds)
                    .then((dbUsers: DbAccountsInfoResponse) => {
                        const chatroomUsers: ChatroomUser[] = [];
                        dbUsers.accounts.forEach((element: AccountInfo) => {
                            const now: any = new Date();
                            const lastActive: Date = getLastActiveById(element.accountid);
                            const lastActiveMinsAgo: number = Math.abs(Math.round(((lastActive.getTime() - now.getTime()) / 1000 / 60)));
                            const chatroomUser: ChatroomUser = { username: element.username, steam_url: element.steam_url, discord_url: element.discord_url, twitch_url: element.twitch_url, image: element.image, last_active: lastActiveMinsAgo };
                            chatroomUsers.push(chatroomUser);
                        });
                        socket.emit(CHATROOM_EVENTS.GetAllUsers, chatroomUsers);
                    })
                    .catch((err: string) => {
                        console.log(`Database error: ${err}`);
                        socket.disconnect();
                    });
            }

        });

        socket.on(CHATROOM_EVENTS.SearchUsers, (data: any) => {
            const usernameFilter: string = data.filter;

            accountModel.getAccountsByUsernameFilter(usernameFilter)
                .then((dbUsers: DbAccountsInfoResponse) => {
                    const chatroomUsers: ChatroomUser[] = [];
                    dbUsers.accounts.forEach((element: AccountInfo) => {
                        const now: any = new Date();
                        const lastActive: Date = getLastActiveById(element.accountid);
                        const lastActiveMinsAgo: number = Math.abs(Math.round(((lastActive.getTime() - now.getTime()) / 1000 / 60)));
                        const chatroomUser: ChatroomUser = { username: element.username, steam_url: element.steam_url, discord_url: element.discord_url, twitch_url: element.twitch_url, image: element.image, last_active: lastActiveMinsAgo };
                        chatroomUsers.push(chatroomUser);
                    });
                    socket.emit(CHATROOM_EVENTS.Users, chatroomUsers);
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

            const loggedIn: boolean = socket.handshake.headers.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

            const sendMessage = (): void => {
                accountModel.getAccountImage(accountid)
                .then((response: DbAccountImageResponse) => {
                    date = Date.now();
                    text = data.text;
                    image = response.link;
                    attachment = data.attachment;
                    chatroomid = data.chatroomid;
                    return chatroomModel.addChatMessage(username, date, text, image, attachment, chatroomid);
                })
                .then(() => {
                    return chatroomModel.getEmotes();
                })
                .then((response: DbChatroomEmotesResponse) => {
                    const emotes: ChatroomEmote[] = response.emotes;
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
                .then((response: DbAuthorizeResponse) => {
                    accountid = response.accountid;
                    refreshUserActivity(accountid, socket);
                    return accountModel.getAccountUsername(accountid);
                })
                .then((response: GenericResponseModel) => {
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
                .then((response: GenericResponseModel) => {
                    accountid = response.data.accountid;
                    refreshUserActivity(accountid, socket);
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

export { router };