const socketIO = require("socket.io");
import { GenericResponseModel, ChatHistoryResponse, SingleChatHistory, ChatroomUser, CHATROOM_EVENTS, DbAuthorizeResponse, DbAccountInfoResponse, DbAccountImageResponse } from "../../client/client-server-common/common";
import { securityModel } from "../../models/db/security/main";
import { chatroomModel } from "../../models/db/chatroom/main";
import { accountModel } from "../../models/db/account/main";

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

        // authorize
        securityModel.authorize(socket.handshake.headers.cookie)
        .then((response: DbAuthorizeResponse) => {
            const accountid: number = response.accountid;
            refreshUserActivity(accountid);
            const usercount: number = getUserCount();
            socket.emit(CHATROOM_EVENTS.Usercount, usercount);
            socket.broadcast.emit(CHATROOM_EVENTS.Usercount, usercount);
            chatroomModel.getChatHistory()
            .then((chats: ChatHistoryResponse) => {
                socket.emit(CHATROOM_EVENTS.MessageHistory, chats);
            })
            .catch((error: string) => {
                console.log(`Error retrieving chat history: ${error}`);
            });

            next();
        })
        .catch((error: string) => {
            console.log(`Chat error authorizing: ${error}`);
            socket.disconnect();
        });

    });

    chatHandler.on("connection", (socket: any) => {

        socket.on("disconnect", () => {
            // authorize
            securityModel.authorize(socket.handshake.headers.cookie)
            .then((response: DbAuthorizeResponse) => {
                const usercount: number = getUserCount();
                socket.emit(CHATROOM_EVENTS.Usercount, usercount);
                socket.broadcast.emit(CHATROOM_EVENTS.Usercount, usercount);
            })
            .catch((error: string) => {
                console.log(`Chat error authorizing disconnection: ${error}`);
                socket.disconnect();
            });
        });

        socket.on(CHATROOM_EVENTS.Usercount, (data: any) => {
            // authorize
            securityModel.authorize(socket.handshake.headers.cookie)
            .then((response: DbAuthorizeResponse) => {
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
            })
            .catch((error: string) => {
                console.log(`Chat error authorizing for usercount: ${error}`);
                socket.disconnect();
            });
        });

        socket.on(CHATROOM_EVENTS.PostMessage, (data: any) => {
            let accountid: number = undefined;
            let username: string = undefined;
            let date: number = undefined;
            let text: string = undefined;
            let image: string = undefined;

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

                return chatroomModel.addChatMessage(username, date, text, image);
            })
            .then(() => {
                const newChat: SingleChatHistory = { name: username, date: new Date(date), text: text, image: image };
                socket.emit(CHATROOM_EVENTS.Message, newChat);
                socket.broadcast.emit(CHATROOM_EVENTS.Message, newChat);
            })
            .catch((error: string) => {
                console.log(`Chat error trying to post message: ${error}`);
                socket.disconnect();
            });
        });
    });
}