import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEnumToSysKeyId } from "../../../../../client/client-server-common/common";
import axios, { AxiosResponse, AxiosError } from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");
const ANDROID_RATE_LIMIT_MS: number = 1000;

export function getAndroidPricings(igdb_games_sys_key_id: number, android_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

            axios({
                method: "get",
                url: android_link,
                headers: {
                    "birthtime": 28801
                },
                maxRedirects: 5
            })
            .then((response: AxiosResponse) => {
                const $: CheerioStatic = cheerio.load(response.data);
                const externalEnumSysKey: number = convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.android);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                const coming_soon: boolean = undefined;
                const preorder: boolean = undefined;
                const isFree: boolean = $(`.oocvOe button`).clone().children().remove().end().text() === `Install`;
                const title: string = $(`h1 span`).text();
                let price: number = undefined;
                const pricingEnum: PricingsEnum = PricingsEnum.main_game;
                let discountPercent: number = undefined;

                // free/main game
                price = $(`.oocvOe button`).clone().children().remove().end().text() === `Install` ? undefined : Number.parseFloat($(`.oocvOe button`).clone().children().remove().end().text().replace(`$`, ``).replace(`Buy`, ``).trim());
                discountPercent = Math.round((1 - (price / Number.parseFloat($(`.LV0gI`).text().replace(`$`, ``)))) * 100) || undefined;

                const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                pricings.push(pricing);

                return resolve(pricings);
            })
            .catch((error: AxiosError) => {
                if (error.response.status === 404) {
                    return resolve([]);
                }
                return reject(error);
            });

        }, ANDROID_RATE_LIMIT_MS);

    });

}