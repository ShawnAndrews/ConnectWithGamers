import config from "../../../../config";
import {
    SingleNewsResponse, RawSingleNewsResponse, SingleNewsResponseFields,
    redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios from "axios";
const redis = require("redis");
const redisClient = redis.createClient();
const igdb = require("igdb-api-node").default;
const igdbClient = igdb(config.igdb.key);

/**
 * Check if redis key exists.
 */
export function newsKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[10];

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
export function getCachedNews(): Promise<SingleNewsResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[10];

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
export function cacheNews(): Promise<SingleNewsResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[10];
    const CURRENT_UNIX_TIME_MS: number = new Date().getTime();

    return new Promise((resolve: any, reject: any) => {
        axios.get(
            `https://api-endpoint.igdb.com/pulses/?fields=${SingleNewsResponseFields.join()}&filter[created_at][lte]=${CURRENT_UNIX_TIME_MS}&order=created_at:desc&expand=pulse_source&limit=${config.igdb.pageLimit}&filter[image][exists]=1`,
            {
                headers: {
                    "user-key": config.igdb.key,
                    "Accept": "application/json"
                }
            })
        .then( (response: any) => {
            const rawResponse: RawSingleNewsResponse[] = response.data;
            const newsResponse: SingleNewsResponse[] = [];

            rawResponse.forEach((x: RawSingleNewsResponse) => {
                const id: number = x.id;
                const title: string =  x.title;
                const author: string = x.author;
                const image: string = x.image;
                const url: string = x.url;
                const created_at: number = x.created_at;
                const newsOrg: string = x.pulse_source.name;
                let video: string = undefined;
                if (x.videos && x.videos[0].video_id.length < 15) {
                    video = `https://www.youtube.com/embed/${x.videos[0].video_id}`;
                }

                const singleNewsResponse: SingleNewsResponse = { id: id, title: title, author: author, image: image, video: video, url: url, created_at: created_at, newsOrg: newsOrg };
                newsResponse.push(singleNewsResponse);
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