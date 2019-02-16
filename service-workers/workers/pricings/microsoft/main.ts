import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEndumToSysKeyId } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");
const MICROSOFT_RATE_LIMIT_MS: number = 1000;

export function getMicrosoftPricings(igdb_games_sys_key_id: number, microsoft_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

            const isXboxNotMicrosoft: boolean = microsoft_link.startsWith(`http://marketplace.xbox.com`);

            console.log(microsoft_link);
            axios({
                method: "get",
                url: microsoft_link,
                headers: {
                    "birthtime": 28801
                },
                maxRedirects: 5
            })
            .then((response: AxiosResponse) => {
                const $: CheerioStatic = cheerio.load(response.data);
                const externalEnumSysKey: number = convertIGDBExternCateEndumToSysKeyId(IGDBExternalCategoryEnum.microsoft);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                if (isXboxNotMicrosoft) {

                    // free/main game/dlc
                    $(".SearchGrid .ProductResults > li").each((i: number, element: CheerioElement) => {

                        const isMainGame: boolean = i === 0;
                        const isFree: boolean = i === 0 && $(element).find(`.ProductPrice`).text() === `Free`;
                        const title: string = $(element).find(`h2`).text().trim();
                        const pricingEnum: PricingsEnum = isFree ? PricingsEnum.free : (isMainGame ? PricingsEnum.main_game : PricingsEnum.dlc);
                        const discountPercent: number = undefined;
                        const price: string = isFree ? undefined : $(element).find(`.ProductPrice`).text().replace(`$`, ``);

                        // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                        const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                        pricings.push(pricing);
                    });

                } else {

                    const isBundlesOnly: boolean = $(`h2:contains('Included in')`).length > 0;
                    if (isBundlesOnly) {

                        // bundles
                        $(".expansion-panel__pane__content .c-channel-placement-content").each((i: number, element: CheerioElement) => {
                            const title: string = $(element).find(`h3`).text();
                            const isGold: boolean = $(element).find(`span:contains('Gold')`).length > 0;
                            const isPass: boolean = $(element).find(`span:contains('Pass')`).length > 0;
                            const pricingEnum: PricingsEnum = isGold ? PricingsEnum.free_or_discounted_with_xbox_live_gold : (isPass ? PricingsEnum.free_or_discounted_with_xbox_game_pass : PricingsEnum.bundles);
                            const price: string = $(element).find(`[itemprop='price']`).text().replace(`$`, ``);
                            const discountPercent: number = undefined;

                            // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        });

                    } else {

                        // free
                        const freeWithPass: boolean = $(`div:contains('Included with Xbox Game Pass')`).length > 0;
                        if (freeWithPass) {
                            const title: string = $(`#productTitle`).find(`h1`).text();
                            const pricingEnum: PricingsEnum = PricingsEnum.free;
                            const discountPercent: number = undefined;
                            const price: string = undefined;
                            // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${PricingsEnum.free_or_discounted_with_xbox_game_pass} | Discount percent: ${discountPercent} | Price: ${price}`);
                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        }

                        // discounted with Gold
                        const discountedWithGold: boolean = $(`div:contains('with Xbox Live Gold')`).length > 0;
                        if (discountedWithGold) {
                            const title: string = $(`#productTitle`).find(`h1`).text();
                            const discountPercent: number = undefined;
                            const pricingEnum: PricingsEnum = PricingsEnum.free_or_discounted_with_xbox_live_gold;
                            const price: string = $(`.remediation-cta-label`).text().replace(`with Xbox Live Gold`, ``).replace(`$`, ``).trim();
                            // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        }

                        // main game
                        $("#productPrice").each((i: number, element: CheerioElement) => {
                            const title: string = $(`#productTitle`).find(`h1`).text();
                            const isPreorder: boolean = title.includes(`(Pre-order)`);
                            const discountPercent: number = undefined;
                            const price: string = $(element).find(`#ProductPrice_productPrice_PriceContainer`).children().first().text().replace(`$`, ``);
                            const pricingEnum: PricingsEnum = isPreorder ? PricingsEnum.preorder : PricingsEnum.main_game;

                            // console.log(`IGDB_games_sys_key_id: ${igdb_games_sys_key_id} | Title: ${title} | Pricing Enum: ${pricingEnum} | Discount percent: ${discountPercent} | Price: ${price}`);
                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        });

                    }

                    // in app purchases
                    $(`[aria-label='add-ons for this game'] li`).each((i: number, element: CheerioElement) => {
                        const title: string = $(element).find(`h3`).text();
                        const discountPercent: number = undefined;
                        const price: string = $(element).find(`[itemprop='price']`).text().replace(`$`, ``);
                        const pricingEnum: PricingsEnum = PricingsEnum.in_app_purchase;

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

        }, MICROSOFT_RATE_LIMIT_MS);

    });

}