const socketIO = require("socket.io");
const express = require("express");
const router = express.Router();
import { GenericResponseModel, ChatHistoryResponse, SingleChatHistory, ChatroomUser, CHATROOM_EVENTS, DbAuthorizeResponse, DbAccountInfoResponse, DbAccountImageResponse, DbChatroomAttachmentResponse, ChatroomAttachmentResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { securityModel } from "../../models/db/security/main";
import { chatroomModel } from "../../models/db/chatroom/main";
import { accountModel } from "../../models/db/account/main";
import { AUTH_TOKEN_NAME } from "../../client/client-server-common/common";

const routes = new routeModel();

/* routes */
routes.addRoute("attachment/upload", "/attachment/upload");

router.post(routes.getRoute("attachment/upload"), (req: any, res: any) => {
    const chatroomAttachmentResponse: ChatroomAttachmentResponse = { error: undefined };
    const imageBase64: string = Object.keys(req.body)[0].split(",")[1];

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return chatroomModel.uploadAttachment(imageBase64);
    })
    .then((response: DbChatroomAttachmentResponse) => {
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
    const usersActivityRefreshMins: number = 30;
    const usersInChat: any[] = [];

    const getExpiresOnFromId = (accountId: number): Date => {
        for (let i = 0; i < usersInChat.length; i++) {
            if (usersInChat[i].accountid === accountId ) {
                return usersInChat[i].expiresOn;
            }
        }
        return new Date();
    };

    const getUserCount = (): number => {
        // delete inactive users
        for (let i = 0; i < usersInChat.length; i++) {
            const isUserInactive: boolean = new Date() > usersInChat[i].expiresOn;
            if (isUserInactive) {
                usersInChat.splice(i, 1);
                break;
            }
        }
        return usersInChat.length;
    };

    const refreshUserActivity = (userAccountId: number): void => {
        const refreshedActivityDate: Date = new Date((new Date()).getTime() + usersActivityRefreshMins * 60000);
        if (usersInChat.length === 0) {
            usersInChat.push({ accountid: userAccountId, expiresOn: refreshedActivityDate });
            return;
        }
        for (let i = 0; i < usersInChat.length; i++) {
            if (usersInChat[i].accountid === userAccountId ) {
                // update
                usersInChat[i].expiresOn = refreshedActivityDate;
                break;
            }
            if (i === usersInChat.length - 1) {
                // insert
                usersInChat.push({ accountid: userAccountId, expiresOn: refreshedActivityDate });
                break;
            }
        }
        return;
    };

    // authentication middleware
    chatHandler.use((socket: any, next: any) => {

        const loggedIn: boolean = socket.handshake.headers.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));

        if (loggedIn) {

            // authorize
            securityModel.authorize(socket.handshake.headers.cookie)
            .then((response: DbAuthorizeResponse) => {
                const accountid: number = response.accountid;
                refreshUserActivity(accountid);
                const usercount: number = getUserCount();
                socket.emit(CHATROOM_EVENTS.Usercount, usercount);
                socket.broadcast.emit(CHATROOM_EVENTS.Usercount, usercount);
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

            const usercount: number = getUserCount();
            socket.emit(CHATROOM_EVENTS.Usercount, usercount);
            socket.broadcast.emit(CHATROOM_EVENTS.Usercount, usercount);

        });

        socket.on(CHATROOM_EVENTS.GetMessageHistory, (data: any) => {

            const chatroomid: number = data.chatroomid;
            chatroomModel.getChatHistory(chatroomid)
                .then((chats: ChatHistoryResponse) => {
                    socket.emit(CHATROOM_EVENTS.MessageHistory, chats);
                })
                .catch((error: string) => {
                    console.log(`Error retrieving chat history: ${error}`);
                });

        });

        socket.on(CHATROOM_EVENTS.Usercount, (data: any) => {

            const userAccountIds: number[] = usersInChat.map((x: any) => { return x.accountid; });
            userAccountIds.forEach((accountId: number) => {
                accountModel.getAccountInfo(accountId)
                .then((dbUser: DbAccountInfoResponse) => {
                    const now: any = new Date();
                    const userExpiresOn: any = getExpiresOnFromId(accountId);
                    const minutesDiff: number = Math.round((((userExpiresOn - now) % 86400000) % 3600000) / 60000);
                    const lastActiveMinutesAgo: number = usersActivityRefreshMins - minutesDiff;
                    const chatroomUser: ChatroomUser = {...dbUser, last_active: lastActiveMinutesAgo};
                    socket.emit(CHATROOM_EVENTS.User, chatroomUser);
                })
                .catch((id: number) => {
                    console.log(`Account id #${id} not found in database.`);
                    socket.disconnect();
                });
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

            // get accountid and username for posting
            if (loggedIn) {

                // authorize
                securityModel.authorize(socket.handshake.headers.cookie)
                .then((response: DbAuthorizeResponse) => {
                    accountid = response.accountid;
                    refreshUserActivity(accountid);
                    return accountModel.getAccountUsername(accountid);
                })
                .then((response: GenericResponseModel) => {
                    username = response.data.username;
                    return accountModel.getAccountImage(accountid);
                })
                .then((response: DbAccountImageResponse) => {
                    date = Date.now();
                    text = data.text;
                    image = response.link;
                    attachment = data.attachment;
                    chatroomid = data.chatroomid;
                    return chatroomModel.addChatMessage(username, date, text, image, attachment, chatroomid);
                })
                .then(() => {
                    const newChat: SingleChatHistory = { name: username, date: new Date(date), text: text, image: image, attachment: attachment, chatroomid: chatroomid };
                    socket.emit(CHATROOM_EVENTS.Message, newChat);
                    socket.broadcast.emit(CHATROOM_EVENTS.Message, newChat);
                })
                .catch((error: string) => {
                    console.log(`Chat error trying to post message: ${error}`);
                    socket.disconnect();
                });

            } else {
                username = "Anonymous";

                // get accountid of anonymous user
                accountModel.getAccountId(username)
                    .then((response: GenericResponseModel) => {
                        accountid = response.data.accountid;
                        refreshUserActivity(accountid);
                        return accountModel.getAccountImage(accountid);
                    })
                    .then((response: DbAccountImageResponse) => {
                        date = Date.now();
                        text = data.text;
                        image = response.link;
                        attachment = data.attachment;
                        chatroomid = data.chatroomid;
                        return chatroomModel.addChatMessage(username, date, text, image, attachment, chatroomid);
                    })
                    .then(() => {
                        const newChat: SingleChatHistory = { name: username, date: new Date(date), text: text, image: image, attachment: attachment, chatroomid: chatroomid };
                        socket.emit(CHATROOM_EVENTS.Message, newChat);
                        socket.broadcast.emit(CHATROOM_EVENTS.Message, newChat);
                    })
                    .catch((error: string) => {
                        console.log(`Chat error trying to post message: ${error}`);
                        socket.disconnect();
                    });
            }

        });
    });
}

export { router };