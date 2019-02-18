import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEnumToSysKeyId } from "../../../../client/client-server-common/common";
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
                const externalEnumSysKey: number = convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.apple);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                const coming_soon: boolean = undefined;
                const preorder: boolean = undefined;
                const hasInAppPurchases: boolean = $(`.app-header__list__item--in-app-purchase`).length > 0;
                const isFree: boolean = $(`.app-header__list__item--price`).text() === `Free`;
                let title: string = $(`.product-header__title`).clone().children().remove().end().text().trim();
                let price: number = $(`.app-header__list__item--price`).text() === `Free` ? undefined : Number.parseFloat($(`.app-header__list__item--price`).text().replace(`$`, ``));
                let pricingEnum: PricingsEnum = PricingsEnum.main_game;
                const discountPercent: number = undefined;

                // free/main game
                let pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                pricings.push(pricing);

                // in app purchases
                if (hasInAppPurchases) {

                    $(".information-list__item:last-child li").each((i: number, element: CheerioElement) => {

                        title = $(element).find(`.truncate-single-line`).text();
                        pricingEnum = PricingsEnum.dlc;
                        price = Number.parseFloat($(element).find(`.list-with-numbers__item__price`).text().replace(`$`, ``));

                        pricing = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
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