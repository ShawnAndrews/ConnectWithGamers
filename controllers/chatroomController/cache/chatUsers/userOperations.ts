import { UserLog, ChatroomUser, AccountInfo, CHATROOM_EVENTS, DbAccountsInfoResponse } from "../../../../client/client-server-common/common";
import { getCachedChatUsers, cacheChatUsers } from "../chatUsers/main";

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
export function getAllUserInfo(dbUsers: DbAccountsInfoResponse): Promise<ChatroomUser[]> {

    return new Promise((resolve: any, reject: any) => {
        getCachedChatUsers()
        .then((userLog: UserLog[]) => {
            const chatroomUsers: ChatroomUser[] = [];
            dbUsers.accounts.forEach((element: AccountInfo) => {
                const now: any = new Date();
                const lastActive: Date = getLastActiveByIdSync(userLog, element.accountid);
                const lastActiveMinsAgo: number = lastActive ? Math.abs(Math.round(((new Date(lastActive).getTime() - now.getTime()) / 1000 / 60))) : -1;
                const chatroomUser: ChatroomUser = { username: element.username, steam_url: element.steam_url, discord_url: element.discord_url, twitch_url: element.twitch_url, image: element.image, last_active: lastActiveMinsAgo };
                chatroomUsers.push(chatroomUser);
            });
            return resolve(chatroomUsers);
        })
        .catch((error: string) => {
            return reject(error);
        });
    });

}