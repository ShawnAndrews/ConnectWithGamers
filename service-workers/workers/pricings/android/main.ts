import { PriceInfoResponse, PricingsEnum, IGDBExternalCategoryEnum } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");

export function getAndroidPricings(igdb_games_sys_key_id: number, steam_link: string): Promise<PriceInfoResponse[]> {

    return new Promise((resolve: any, reject: any) => {

        return resolve([]);

    });

}