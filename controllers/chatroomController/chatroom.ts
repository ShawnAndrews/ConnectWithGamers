const socketIO = require("socket.io");
const express = require("express");
const router = express.Router();
import { ResponseModel, ChatHistoryResponse, SingleChatHistory, ChatroomUser } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import db from "../../models/db";
import { DateTime } from "aws-sdk/clients/ssm";

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
        .then((response: ResponseModel) => {
            const accountid: number = response.data.accountid;
            refreshUserActivity(accountid);
            const usercount: number = getUserCount();
            socket.emit("new-usercount", usercount);
            socket.broadcast.emit("new-usercount", usercount);
            db.getChatHistory()
            .then((chats: ChatHistoryResponse) => {
                for (let i = 0; i < chats.name.length; i++) {
                    const chat: SingleChatHistory = { name: chats.name[i], date: chats.date[i], text: chats.text[i] };
                    socket.emit("new-message", chat);
                }
            })
            .catch((response: ResponseModel) => {
                console.log(`Error retrieving chat history.`);
            });

            next();
        })
        .catch((response: ResponseModel) => {
            socket.disconnect();
        });

    });

    chatHandler.on("connection", (socket: any) => {

        socket.on("disconnect", function() {
            // authorize
            db.authorize(socket.handshake.headers.cookie)
            .then((response: ResponseModel) => {
                const accountid: number = response.data.accountid;
                refreshUserActivity(accountid);
                const usercount: number = getUserCount();
                socket.emit("new-usercount", usercount);
                socket.broadcast.emit("new-usercount", usercount);
            })
            .catch((response: ResponseModel) => {
                socket.disconnect();
            });
        });

        socket.on("request-userlist", (data: any) => {
            // authorize
            db.authorize(socket.handshake.headers.cookie)
            .then((response: ResponseModel) => {
                const userAccountIds: number[] = usersInChat.map((x: any) => { return x.accountid; });
                userAccountIds.forEach((accountId: number) => {
                    db.getUserById(accountId)
                    .then((user: ChatroomUser) => {
                        socket.emit("new-user", user);
                    })
                    .catch((id: number) => {
                        console.log(`Account id #${id} not found in database.`);
                        socket.disconnect();
                    });
                });
            })
            .catch((response: ResponseModel) => {
                socket.disconnect();
            });
        });

        socket.on("post-message", (data: any) => {
            let username: string = undefined;
            let date: number = undefined;
            let text: string = undefined;

            // authorize
            db.authorize(socket.handshake.headers.cookie)
            .then((response: ResponseModel) => {
                refreshUserActivity(response.data.accountid);
                return db.getAccountUsername(response.data.accountid);
            })
            .then((response: ResponseModel) => {
                username = response.data.username;
                date = Date.now();
                text = data.text;

                return db.addChatMessage(username, date, text);
            })
            .then(() => {
                const formattedDate: string = `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`;
                const newChat: SingleChatHistory = { name: username, date: formattedDate, text: text };
                socket.emit("new-message", newChat);
                socket.broadcast.emit("new-message", newChat);
            })
            .catch((response: ResponseModel) => {
                socket.disconnect();
            });
        });
    });
}