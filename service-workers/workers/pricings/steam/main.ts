import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEndumToSysKeyId } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");
const STEAM_RATE_LIMIT_MS: number = 1000;

export function getSteamPricings(igdb_games_sys_key_id: number, steam_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

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
                const externalEnumSysKey: number = convertIGDBExternCateEndumToSysKeyId(IGDBExternalCategoryEnum.steam);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                // main game/bundles/pre orders/free
                $(".game_area_purchase_game").each((i: number, element: CheerioElement) => {
                    const title: string = $(element).find(`h1`).clone().children().remove().end().text().replace(`Buy `, ``).replace(`Pre-Purchase`, ``).replace(`Play`, ``).trim();
                    const discountPercent: number = Number.parseInt($(element).find(`.discount_pct, .bundle_base_discount`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
                    let price: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_purchase_price`).text().replace(`$`, ``).trim();
                    const isFree: boolean = i === 0 && price.includes(`Free`);
                    const isPreorder: boolean = i === 0 && $(element).find(`h1`).text().startsWith(`Pre-Purchase`);
                    const pricingEnum: PricingsEnum = isFree ? PricingsEnum.free : (isPreorder ? PricingsEnum.preorder : (i === 0 ? PricingsEnum.main_game : PricingsEnum.bundles));
                    price = price.includes(`Free`) ? undefined : price;

                    const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                    pricings.push(pricing);
                });

                // dlc
                $(".game_area_dlc_row").each((i: number, element: CheerioElement) => {
                    const pricingEnum: PricingsEnum = PricingsEnum.dlc;
                    const title: string = $(element).find(`.game_area_dlc_name`).text().trim();
                    const discountPercent: number = Number.parseInt($(element).find(`.discount_pct`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
                    let price: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_area_dlc_price`).text().replace(`$`, ``).trim();
                    price = price === `N/A` ? undefined : price;

                    const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
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