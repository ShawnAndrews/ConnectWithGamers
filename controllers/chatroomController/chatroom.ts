const socketIO = require("socket.io");
import { GenericResponseModel, ChatHistoryResponse, SingleChatHistory, ChatroomUser, CHATROOM_EVENTS, DbAuthorizeResponse } from "../../client/client-server-common/common";
import db from "../../models/db";

export default function registerChatHandlers(chatServer: any): void {
    const chatHandler = socketIO(chatServer);
    const usersActivityRefreshMins: number = 15;
    const usersInChat: any[] = [];

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
        db.authorize(socket.handshake.headers.cookie)
        .then((response: DbAuthorizeResponse) => {
            const accountid: number = response.accountid;
            refreshUserActivity(accountid);
            const usercount: number = getUserCount();
            socket.emit(CHATROOM_EVENTS.Usercount, usercount);
            socket.broadcast.emit(CHATROOM_EVENTS.Usercount, usercount);
            db.getChatHistory()
            .then((chats: ChatHistoryResponse) => {
                for (let i = 0; i < chats.name.length; i++) {
                    const chat: SingleChatHistory = { name: chats.name[i], date: chats.date[i], text: chats.text[i] };
                    socket.emit(CHATROOM_EVENTS.Message, chat);
                }
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
            db.authorize(socket.handshake.headers.cookie)
            .then((response: DbAuthorizeResponse) => {
                const accountid: number = response.accountid;
                refreshUserActivity(accountid);
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
            db.authorize(socket.handshake.headers.cookie)
            .then((response: DbAuthorizeResponse) => {
                const userAccountIds: number[] = usersInChat.map((x: any) => { return x.accountid; });
                userAccountIds.forEach((accountId: number) => {
                    db.getUserById(accountId)
                    .then((user: ChatroomUser) => {
                        socket.emit(CHATROOM_EVENTS.User, user);
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
            let username: string = undefined;
            let date: number = undefined;
            let text: string = undefined;

            // authorize
            db.authorize(socket.handshake.headers.cookie)
            .then((response: DbAuthorizeResponse) => {
                refreshUserActivity(response.accountid);
                return db.getAccountUsername(response.accountid);
            })
            .then((response: GenericResponseModel) => {
                username = response.data.username;
                date = Date.now();
                text = data.text;

                return db.addChatMessage(username, date, text);
            })
            .then(() => {
                const formattedDate: string = `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`;
                const newChat: SingleChatHistory = { name: username, date: formattedDate, text: text };
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