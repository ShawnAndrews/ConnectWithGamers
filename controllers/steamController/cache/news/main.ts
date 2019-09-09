import config from "../../../../config";
import { NewsArticle, RawNewsArticle, getTodayUnixTimestampInSeconds } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { steamModel } from "../../../../models/db/steam/main";

/**
 * Check if news exists.
 */
export function newsKeyExists(path: string): Promise<boolean> {

    return new Promise((resolve: any, reject: any) => {
        steamModel.newsExists(path)
        .then((exists: boolean) => {
            return resolve(exists);
        })
        .catch((err: string) => {
            return reject(err);
        });
    });

}

/**
 * Get news.
 */
export function getCachedNews(path: string): Promise<NewsArticle[]> {

    return new Promise((resolve: any, reject: any) => {

        steamModel.getNews(path)
        .then((newsArticles: NewsArticle[]) => {
            return resolve(newsArticles);
        })
        .catch((err: string) => {
            return reject(err);
        });

    });

}

/**
 * Cache news.
 */
export function cacheNews(path: string): Promise<NewsArticle[]> {
    const CURRENT_UNIX_TIME_S: number = getTodayUnixTimestampInSeconds();

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "post",
            url: "",
            data: ""
        })
        .then( (response: AxiosResponse) => {
            const rawResponse: RawNewsArticle[] = response.data;
            const newsArticles: NewsArticle[] = [];
            const datePlus7Days: Date = new Date();
            datePlus7Days.setDate(datePlus7Days.getDate() + 7);

            rawResponse.forEach((x: RawNewsArticle) => {
                const title: string =  x.title;
                const author: string = x.author ? x.author.slice(0, 100) : "";
                const image: string = x.image;
                const url: string = x.website;
                const created_dt: Date = new Date(x.created_at * 1000);
                const org: string = x.pulse_source.name;
                const expires_dt: Date = datePlus7Days;

                const NewsArticle: NewsArticle = { title: title, author: author, image: image, url: url, created_dt: created_dt, org: org, expires_dt: expires_dt };
                newsArticles.push(NewsArticle);
            });

            steamModel.setNews(newsArticles, path)
            .then(() => {
                return resolve(newsArticles);
            })
            .catch((err: string) => {
                return reject(err);
            });

        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}