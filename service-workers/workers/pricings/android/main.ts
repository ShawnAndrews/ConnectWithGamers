import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEndumToSysKeyId } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse, AxiosError } from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");
const ANDROID_RATE_LIMIT_MS: number = 1000;

export function getAndroidPricings(igdb_games_sys_key_id: number, android_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

            console.log(android_link);
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
                const externalEnumSysKey: number = convertIGDBExternCateEndumToSysKeyId(IGDBExternalCategoryEnum.android);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                const isFree: boolean = $(`.oocvOe button`).clone().children().remove().end().text() === `Install`;
                const title: string = $(`h1 span`).text();
                let price: string = undefined;
                let pricingEnum: PricingsEnum = undefined;
                let discountPercent: number = undefined;

                // free/main game
                if (isFree) {
                    pricingEnum = PricingsEnum.free;
                } else {
                    price = $(`.oocvOe button`).clone().children().remove().end().text().replace(`$`, ``).replace(`Buy`, ``).trim();
                    discountPercent = Math.round((1 - (Number.parseFloat(price) / Number.parseFloat($(`.LV0gI`).text().replace(`$`, ``)))) * 100) || undefined;
                    pricingEnum = PricingsEnum.main_game;
                }

                // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
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