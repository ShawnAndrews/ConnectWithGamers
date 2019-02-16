import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");
const STEAM_RATE_LIMIT_MS: number = 1000;

export function getSteamPricings(igdb_games_sys_key_id: number, steam_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

            // console.log(steam_link);
            axios({
                method: "get",
                url: steam_link,
                headers: {
                    "birthtime": 28801
                },
                maxRedirects: 5
            })
            .then((response: AxiosResponse) => {
                const $: CheerioStatic = cheerio.load(response.data);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                // main game or bundles
                $(".game_area_purchase_game").each((i: number, element: CheerioElement) => {
                    const pricingEnum: PricingsEnum = i === 0 ? PricingsEnum.main_game : PricingsEnum.bundles;
                    const title: string = $(element).find(`h1`).clone().children().remove().end().text().replace(`Buy `, ``).trim();
                    const discountPercent: number = Number.parseInt($(element).find(`.discount_pct`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
                    const price: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_purchase_price`).text().replace(`$`, ``).trim();

                    // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                    const pricing: PriceInfoResponse = { externalEnum: IGDBExternalCategoryEnum.steam, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                    pricings.push(pricing);
                });

                // dlc
                $(".game_area_dlc_row").each((i: number, element: CheerioElement) => {
                    const pricingEnum: PricingsEnum = PricingsEnum.dlc;
                    const title: string = $(element).find(`.game_area_dlc_name`).text().trim();
                    const discountPercent: number = Number.parseInt($(element).find(`.discount_pct`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
                    const price: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_area_dlc_price`).text().replace(`$`, ``).trim();

                    // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                    const pricing: PriceInfoResponse = { externalEnum: IGDBExternalCategoryEnum.steam, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                    pricings.push(pricing);
                });

                return resolve(pricings);
            })
            .catch((error: string) => {
                return reject(error);
            });

        }, STEAM_RATE_LIMIT_MS);

    });

}