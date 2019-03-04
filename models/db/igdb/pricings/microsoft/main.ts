import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum, convertIGDBExternCateEnumToSysKeyId } from "../../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
const MICROSOFT_RATE_LIMIT_MS: number = 1000;

export function getMicrosoftPricings(igdb_games_sys_key_id: number, microsoft_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        setTimeout(() => {

            const isXboxNotMicrosoft: boolean = microsoft_link.startsWith(`http://marketplace.xbox.com`);

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
                const externalEnumSysKey: number = convertIGDBExternCateEnumToSysKeyId(IGDBExternalCategoryEnum.microsoft);
                const pricings: PriceInfoResponse[] = [];
                const datePlus7Days: Date = new Date();
                let mainGameUnavailable: boolean = false;
                datePlus7Days.setDate(datePlus7Days.getDate() + 7);

                if (isXboxNotMicrosoft) {

                    // free/main game/dlc
                    $(".SearchGrid .ProductResults > li").each((i: number, element: CheerioElement) => {
                        const coming_soon: boolean = undefined;
                        const preorder: boolean = undefined;
                        const isMainGame: boolean = i === 0;
                        const isFree: boolean = $(element).find(`.ProductPrice`).text() === `Free`;
                        const title: string = $(element).find(`h2`).text().trim();
                        const pricingEnum: PricingsEnum = isMainGame ? PricingsEnum.main_game : PricingsEnum.dlc;
                        const discountPercent: number = undefined;
                        const price: number = isFree ? undefined : Number.parseFloat($(element).find(`.ProductPrice`).text().replace(`$`, ``));

                        const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                        pricings.push(pricing);
                    });

                } else {

                    const isBundlesOnly: boolean = $(`h2:contains('Included in')`).length > 0;
                    if (isBundlesOnly) {

                        // bundles
                        $(".expansion-panel__pane__content .c-channel-placement-content").each((i: number, element: CheerioElement) => {
                            const coming_soon: boolean = undefined;
                            const preorder: boolean = undefined;
                            const title: string = $(element).find(`h3`).text();
                            const isGold: boolean = $(element).find(`span:contains('Gold')`).length > 0;
                            const isPass: boolean = $(element).find(`span:contains('Pass')`).length > 0;
                            const pricingEnum: PricingsEnum = isGold ? PricingsEnum.free_or_discounted_with_xbox_live_gold : (isPass ? PricingsEnum.free_or_discounted_with_xbox_game_pass : (i === 0 ? PricingsEnum.main_game : PricingsEnum.bundles));
                            const price: number = Number.parseFloat($(element).find(`[itemprop='price']`).text().replace(`$`, ``));
                            const discountPercent: number = undefined;

                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        });

                    } else {

                        // xbox pass
                        const freeWithPass: boolean = $(`div:contains('Included with Xbox Game Pass')`).length > 0;
                        if (freeWithPass) {
                            const coming_soon: boolean = undefined;
                            const preorder: boolean = undefined;
                            const title: string = $(`#productTitle`).find(`h1`).text();
                            const pricingEnum: PricingsEnum = PricingsEnum.free_or_discounted_with_xbox_game_pass;
                            const discountPercent: number = undefined;
                            const price: number = undefined;
                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        }

                        // xbox live gold
                        const discountedWithGold: boolean = $(`div:contains('with Xbox Live Gold')`).length > 0;
                        if (discountedWithGold) {
                            const coming_soon: boolean = undefined;
                            const preorder: boolean = undefined;
                            const title: string = $(`#productTitle`).find(`h1`).text();
                            const discountPercent: number = undefined;
                            const pricingEnum: PricingsEnum = PricingsEnum.free_or_discounted_with_xbox_live_gold;
                            const price: number = Number.parseFloat($(`.remediation-cta-label`).text().replace(`with Xbox Live Gold`, ``).replace(`$`, ``).trim());
                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        }

                        // main game
                        $("#productPrice").each((i: number, element: CheerioElement) => {
                            const title: string = $(`#productTitle`).find(`h1`).text();
                            const preorder: boolean = title.includes(`(Pre-order)`) ? true : undefined;
                            const coming_soon: boolean = undefined;
                            const discountPercent: number = undefined;
                            const price: number = Number.parseFloat($(element).find(`#ProductPrice_productPrice_PriceContainer`).children().first().text().replace(`$`, ``));
                            const pricingEnum: PricingsEnum = PricingsEnum.main_game;

                            // game is unavailable
                            if (isNaN(price)) {
                                mainGameUnavailable = true;
                            }

                            const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                            pricings.push(pricing);
                        });

                    }

                    // in app purchases
                    $(`[aria-label='add-ons for this game'] li`).each((i: number, element: CheerioElement) => {
                        const coming_soon: boolean = undefined;
                        const preorder: boolean = undefined;
                        const title: string = $(element).find(`h3`).text();
                        const discountPercent: number = undefined;
                        const price: number = !isNaN(Number.parseFloat($(element).find(`[itemprop='price']`).text().replace(`$`, ``))) ? Number.parseFloat($(element).find(`[itemprop='price']`).text().replace(`$`, ``)) : undefined;
                        const pricingEnum: PricingsEnum = PricingsEnum.in_app_purchase;

                        const pricing: PriceInfoResponse = { externalEnum: externalEnumSysKey, pricingEnum: pricingEnum, igdbGamesSysKeyId: igdb_games_sys_key_id, title: title, price: price, coming_soon: coming_soon, preorder: preorder, discount_percent: discountPercent, expires_dt: datePlus7Days };
                        pricings.push(pricing);
                    });

                }

                if (mainGameUnavailable) {
                    return resolve([]);
                } else {
                    return resolve(pricings);
                }
            })
            .catch((error: string) => {
                return reject(error);
            });

        }, MICROSOFT_RATE_LIMIT_MS);

    });

}