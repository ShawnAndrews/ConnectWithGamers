import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEndumToSysKeyId } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");
const APPLE_RATE_LIMIT_MS: number = 1000;

export function getApplePricings(igdb_games_sys_key_id: number, apple_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

            axios({
                method: "get",
                url: apple_link,
                headers: {
                    "birthtime": 28801
                },
                maxRedirects: 5
            })
            .then((response: AxiosResponse) => {
                const $: CheerioStatic = cheerio.load(response.data);
                const externalEnumSysKey: number = convertIGDBExternCateEndumToSysKeyId(IGDBExternalCategoryEnum.apple);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                const hasInAppPurchases: boolean = $(`.app-header__list__item--in-app-purchase`).length > 0;
                const isFree: boolean = $(`.app-header__list__item--price`).text() === `Free`;
                let title: string = undefined;
                let price: string = undefined;
                let pricingEnum: PricingsEnum = undefined;
                const discountPercent: number = undefined;

                // free/main game
                if (isFree) {
                    title = $(`.product-header__title`).clone().children().remove().end().text().trim();
                    pricingEnum = PricingsEnum.free;

                    // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                    const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                    pricings.push(pricing);
                } else {
                    title = $(`.product-header__title`).clone().children().remove().end().text().trim();
                    price = $(`.app-header__list__item--price`).text().replace(`$`, ``);
                    pricingEnum = PricingsEnum.main_game;

                    // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                    const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                    pricings.push(pricing);
                }

                // in app purchases
                if (hasInAppPurchases) {

                    $(".information-list__item:last-child li").each((i: number, element: CheerioElement) => {

                        const title: string = $(element).find(`.truncate-single-line`).text();
                        const pricingEnum: PricingsEnum = PricingsEnum.dlc;
                        const price: string = $(element).find(`.list-with-numbers__item__price`).text().replace(`$`, ``);
                        const discountPercent: number = undefined;

                        // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                        const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                        pricings.push(pricing);
                    });

                }

                return resolve(pricings);
            })
            .catch((error: string) => {
                return reject(error);
            });

        }, APPLE_RATE_LIMIT_MS);

    });

}