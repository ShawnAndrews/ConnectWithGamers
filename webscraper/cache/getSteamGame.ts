import { PlatformEnum, Achievement, cleanString, getSteamCoverURL, getSteamCoverThumbURL, PriceInfoResponse, PricingsEnum } from "../../client/client-server-common/common";
import * as cheerio from "cheerio";

export function getSteamGenres(data: string): string[] {
    const genres: string[] = [];
    const $: CheerioStatic = cheerio.load(data);

    $(`.glance_tags.popular_tags > a`).each((i: number, element: CheerioElement) => genres.push($(element).html().trim().replace(`&amp;`, `&`).replace(`&apos;`, `'`)));

    return genres;
}

export function getSteamPlatforms(data: string): number[] {
    const platforms: number[] = [];
    const $: CheerioStatic = cheerio.load(data);

    if ($(`.platform_img.win`).length > 0) {
        platforms.push(PlatformEnum.windows);
    } else {
        if ($(`.sysreq_tab[data-os="win"]`).length > 0) {
            platforms.push(PlatformEnum.windows);
        }
    }

    if ($(`.platform_img.mac`).length > 0) {
        platforms.push(PlatformEnum.mac);
    } else {
        if ($(`.sysreq_tab[data-os="mac"]`).length > 0) {
            platforms.push(PlatformEnum.mac);
        }
    }

    if ($(`.platform_img.linux`).length > 0) {
        platforms.push(PlatformEnum.linux);
    } else {
        if ($(`.sysreq_tab[data-os="linux"]`).length > 0) {
            platforms.push(PlatformEnum.linux);
        }
    }

    return platforms;
}

export function getSteamModes(data: string): string[] {
    const genres: string[] = [];
    const $: CheerioStatic = cheerio.load(data);

    $(`#category_block > .game_area_details_specs:not(.learning_about)`).each((i: number, element: CheerioElement) => {
        genres.push($(element).find(`.name`).html());
    });

    return genres;
}

export function getSteamAchievements(data: string): Achievement[] {
    const achievements: Achievement[] = [];
    const $: CheerioStatic = cheerio.load(data);

    if ($(`#mainContents .achieveRow`).length > 0) {
        $(`#mainContents .achieveRow`).each((i: number, element: CheerioElement) => {
            const link: string = $(element).find(`img`).length > 0 ? $(element).find(`img`).attr(`src`) : undefined;
            const name: string = cleanString($(element).find(`.achieveTxt h3`).html()).trim();
            const description: string = cleanString($(element).find(`.achieveTxt h5`).html()).trim();
            const percent: number = parseFloat($(element).find(`.achievePercent`).html().replace(`%`, ``));
            const achievement: Achievement = { name: name, description: description, link: link, percent: percent, log_dt: new Date() };

            achievements.push(achievement);
        });
    }

    return achievements;
}


export function getSteamImages(data: string, steamGamesSysKeyId: number): string[] {
    const images: string[] = [];
    const $: CheerioStatic = cheerio.load(data);

    // covers
    images.push(getSteamCoverURL(steamGamesSysKeyId));
    images.push(getSteamCoverThumbURL(steamGamesSysKeyId));

    // screenshots
    $(`#highlight_strip_scroll > .highlight_strip_screenshot`).each((i: number, element: CheerioElement) => {
        images.push($(element).find(`img`).attr(`src`).replace(`116x65`, `1920x1080`));
    });

    return images;
}

export function getSteamPricings(data: string, steamGamesSysKeyId: number): PriceInfoResponse[] {

    const $: CheerioStatic = cheerio.load(data);
    const pricings: PriceInfoResponse[] = [];

    // main game/bundles
    $(".game_area_purchase_game").each((i: number, element: CheerioElement) => {
        const monthNameToNumber = (name: string) =>  new Date(Date.parse(name + " 1, 2012")).getMonth() + 1;
        const title: string = cleanString($(element).find(`h1`).clone().children().remove().end().text().replace(`Buy `, ``).replace(`Pre-Purchase`, ``).replace(`Play`, ``).trim());
        const discountPercent: number = Number.parseInt($(element).find(`.discount_pct, .bundle_base_discount`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
        const discountEndDate: Date = $(element).find(`.game_purchase_discount_countdown`).length > 0
        ? new Date((parseInt(data.substring(data.indexOf(`$DiscountCountdown, `), data.indexOf(` );`, data.indexOf(`$DiscountCountdown, `) + 20)))) || new Date(`${$(element).find(`.game_purchase_discount_countdown`).text().split(" ").splice(-2)}, ${monthNameToNumber($(element).find(`.game_purchase_discount_countdown`).text().split(" ").splice(-2)[0]) >= monthNameToNumber(new Date().toLocaleString(`default`, { month: `long` })) ? new Date().getFullYear() : new Date().getFullYear() + 1}`).getTime())
        : undefined;
        const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_purchase_price`).text().replace(`$`, ``).trim();
        const price: number = rawPrice.includes(`Free`) ? undefined : Number.parseFloat(rawPrice);
        const pricingEnum: PricingsEnum = i === 0 ? PricingsEnum.main_game : PricingsEnum.bundles;

        if ((rawPrice.includes(`Free`) && !price) || (!isNaN(Number.parseFloat(rawPrice)) && !isNaN(price))) {
            const pricing: PriceInfoResponse = { pricingEnumSysKeyId: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, discount_end_dt: discountEndDate, log_dt: new Date() };
            pricings.push(pricing);
        }
    });

    // dlc
    $(".game_area_dlc_row").each((i: number, element: CheerioElement) => {
        const pricingEnum: PricingsEnum = PricingsEnum.dlc;
        const title: string = cleanString($(element).find(`.game_area_dlc_name`).text().trim());
        const discountPercent: number = Number.parseInt($(element).find(`.discount_pct`).text().replace(`-`, ``).replace(`%`, ``)) || undefined;
        const rawPrice: string = discountPercent ? $(element).find(`.discount_final_price`).text().replace(`$`, ``) : $(element).find(`.game_area_dlc_price`).text().replace(`$`, ``).trim();
        const price: number = (rawPrice === `N/A` || rawPrice === `Free`) ? undefined : Number.parseFloat(rawPrice);

        const pricing: PriceInfoResponse = { pricingEnumSysKeyId: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, discount_end_dt: undefined, log_dt: new Date() };
        pricings.push(pricing);
    });

    // demo
    if ($(".demo_above_purchase").length > 0) {
        const pricingEnum: PricingsEnum = PricingsEnum.demo;
        const title: string = $(`.demo_above_purchase > h1`).text().trim().replace(`Download `, ``);
        const discountPercent: number = undefined;
        const price: number = undefined;
        const pricing: PriceInfoResponse = { pricingEnumSysKeyId: pricingEnum, steamGamesSysKeyId: steamGamesSysKeyId, title: title, price: price, discount_percent: discountPercent, discount_end_dt: undefined, log_dt: new Date() };
        pricings.push(pricing);
    }

    return pricings;

}