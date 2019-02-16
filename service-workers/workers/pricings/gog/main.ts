import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEndumToSysKeyId } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
const GOG_RATE_LIMIT_MS: number = 1000;

export function getGogPricings(igdb_games_sys_key_id: number, gog_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

            console.log(gog_link);
            axios({
                method: "get",
                url: gog_link,
                headers: {
                    "birthtime": 28801,
                    "Cookie": "gog_lc=CA_USD_en-US;"
                },
                maxRedirects: 5
            })
            .then((response: AxiosResponse) => {
                const $: CheerioStatic = cheerio.load(response.data);
                const externalEnumSysKey: number = convertIGDBExternCateEndumToSysKeyId(IGDBExternalCategoryEnum.gog);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                const isFree: boolean = $(`.product-actions-price__final-amount`).text() === `FREE`;
                const title: string = $(`.productcard-basics__title`).text().trim();
                let price: string = undefined;
                let pricingEnum: PricingsEnum = undefined;
                let discountPercent: number = undefined;

                if (isFree) {
                    pricingEnum = PricingsEnum.free;
                } else {
                    const halfTempLen = $(`.product-actions-price`).text().length / 2;
                    const basePrice: number = Number.parseFloat($(`.product-actions-price`).text().slice(0, halfTempLen));
                    const discountedPrice: number = Number.parseFloat($(`.product-actions-price`).text().slice(halfTempLen));
                    discountPercent = basePrice !== discountedPrice ? Math.round(Number.parseFloat((discountedPrice / basePrice).toFixed(2)) * 100) || undefined : undefined;
                    price = $(`.product-actions-price__final-amount`).text();
                    pricingEnum = PricingsEnum.main_game;
                }

                console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                pricings.push(pricing);

                return resolve(pricings);
            })
            .catch((error: string) => {
                return reject(error);
            });

        }, GOG_RATE_LIMIT_MS);

    });

}