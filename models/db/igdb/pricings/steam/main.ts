import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEnumToSysKeyId } from "../../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
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
                const externalEnumSysKey: number = convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.steam);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                // main game/bundles
                $(".game_area_purchase_game").each((i: number, element: CheerioElement) => {
                    const title: string = $(element).find(`h1`).clone().children().remove().end().text().replace(`Buy `, ``).replace(`Pre-Purchase`, ``).replace(`Play`, ``).trim();
                    const discountPercent: number = Number.parseInt($(element).find(`.discount_pct, .bundle_base_discount`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
                    const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_purchase_price`).text().replace(`$`, ``).trim();
                    const price: number = rawPrice.includes(`Free`) ? undefined : Number.parseFloat(rawPrice);
                    const coming_soon: boolean = undefined;
                    const preorder: boolean = (i === 0 && $(element).find(`h1`).text().startsWith(`Pre-Purchase`)) ? true : undefined;
                    const pricingEnum: PricingsEnum = i === 0 ? PricingsEnum.main_game : PricingsEnum.bundles;

                    if ((rawPrice.includes(`Free`) && !price) || (!isNaN(Number.parseFloat(rawPrice)) && !isNaN(price))) {
                        const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                        pricings.push(pricing);
                    }
                });

                // dlc
                $(".game_area_dlc_row").each((i: number, element: CheerioElement) => {
                    const coming_soon: boolean = undefined;
                    const preorder: boolean = undefined;
                    const pricingEnum: PricingsEnum = PricingsEnum.dlc;
                    const title: string = $(element).find(`.game_area_dlc_name`).text().trim();
                    const discountPercent: number = Number.parseInt($(element).find(`.discount_pct`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
                    const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_area_dlc_price`).text().replace(`$`, ``).trim();
                    const price = (rawPrice === `N/A` || rawPrice === `Free`) ? undefined : Number.parseFloat(rawPrice);

                    const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
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