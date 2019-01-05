import config from "../../../../config";
import {
    NewsArticle, RawNewsArticle, NewsArticleFields,
    redisCache, IGDBCacheEntry, getTodayUnixTimestampInSeconds } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { buildIGDBRequestBody } from "../../../../util/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function newsKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.exists(cacheEntry.key, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

/**
 * Get redis-cached news.
 */
export function getCachedNews(): Promise<NewsArticle[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedNews: string) => {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(stringifiedNews));
        });
    });

}

/**
 * Cache news.
 */
export function cacheNews(): Promise<NewsArticle[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[4];
    const CURRENT_UNIX_TIME_S: number = getTodayUnixTimestampInSeconds();

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/pulses`;
        const body: string = buildIGDBRequestBody(
            [
                `image != null`,
                `created_at <= ${CURRENT_UNIX_TIME_S}`
            ],
            NewsArticleFields.join(),
            undefined,
            `sort created_at desc`
        );

        axios({
            method: "post",
            url: URL,
            headers: {
                "user-key": config.igdb.key,
                "Accept": "application/json"
            },
            data: body
        })
        .then( (response: AxiosResponse) => {
            const rawResponse: RawNewsArticle[] = response.data;
            const newsResponse: NewsArticle[] = [];

            rawResponse.forEach((x: RawNewsArticle) => {
                const id: number = x.id;
                const title: string =  x.title;
                const author: string = x.author;
                const image: string = x.image;
                const url: string = x.website && x.website.url;
                const created_at: number = x.created_at;
                const newsOrg: string = x.pulse_source.name;

                const NewsArticle: NewsArticle = { id: id, title: title, author: author, image: image, url: url, created_at: created_at, newsOrg: newsOrg };
                newsResponse.push(NewsArticle);
            });

            redisClient.set(cacheEntry.key, JSON.stringify(newsResponse));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            return resolve(newsResponse);
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}