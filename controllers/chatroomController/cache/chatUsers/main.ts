import { UserLog, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import config from "../../../../config";

const redis = require("redis");
const redisClient = redis.createClient();


/**
 * Get redis-cached users in chatroom.
 */
export function getCachedChatUsers(): Promise<UserLog[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[7];

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
    const cacheEntry: IGDBCacheEntry = redisCache[7];

    return new Promise((resolve: any, reject: any) => {

        redisClient.set(cacheEntry.key, JSON.stringify(userLog));

        if (cacheEntry.expiry !== -1) {
            redisClient.expire(cacheEntry.key, cacheEntry.expiry);
        }

        return resolve();
    });

}