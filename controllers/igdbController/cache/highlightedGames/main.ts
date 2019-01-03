import config from "../../../../config";
import { GameResponse, RawGame, GameFields, redisCache, IGDBCacheEntry } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse, AxiosError } from "axios";
import { buildIGDBRequestBody, getCurrentUnixTimestampInSeconds } from "../../../../util/main";
import { getCachedGame, cachePreloadedGame } from "../game/main";
const redis = require("redis");
const redisClient = redis.createClient();

/**
 * Check if redis key exists.
 */
export function highlightedGamesKeyExists(): Promise<boolean> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.exists(cacheEntry.key, (error: string, value: boolean) => {
            if (error) {
                return reject(error);
            }
            return resolve(value);
        });
    });

}

/**
 * Get redis-cached highlighted games.
 */
export function getCachedHighlightedGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];

    return new Promise((resolve: any, reject: any) => {
        redisClient.get(cacheEntry.key, (error: string, stringifiedGameIds: string) => {
            if (error) {
                return reject(error);
            }

            const ids: number[] = JSON.parse(stringifiedGameIds);
            const gamePromises: Promise<GameResponse>[] = ids.map((id: number) => getCachedGame(id));

            Promise.all(gamePromises)
            .then((gameResponses: GameResponse[]) => {
                return resolve(gameResponses);
            })
            .catch((error: string) => {
                return reject(error);
            });
        });
    });

}

/**
 * Cache highlighted games.
 */

export function cacheHighlightedGames(): Promise<GameResponse[]> {
    const cacheEntry: IGDBCacheEntry = redisCache[3];
    const CURRENT_UNIX_TIME_S: number = getCurrentUnixTimestampInSeconds();
    const THREE_MONTH_AGO_UNIX_TIME_S: number = getCurrentUnixTimestampInSeconds() - (60 * 60 * 24 * 30 * 3);

    return new Promise((resolve: any, reject: any) => {

        const URL: string = `${config.igdb.apiURL}/games`;
        const body: string = buildIGDBRequestBody(
            [
                `cover != null`,
                `screenshots != null`,
                `first_release_date > ${THREE_MONTH_AGO_UNIX_TIME_S}`,
                `first_release_date <= ${CURRENT_UNIX_TIME_S}`,
                `total_rating > 60`,
                `platforms = 6`,
                `id != 110694`
            ],
            GameFields.join(),
            undefined,
            `sort popularity desc`
        );

        axios({
            method: "post",
            url: URL,
            headers: {
                "user-key": config.igdb.key,
                "Accept": "application/json"
            },
            data: body
        })
        .then( (response: AxiosResponse) => {
            const rawGamesResponses: RawGame[] = response.data;
            rawGamesResponses[rawGamesResponses.length - 1] = hardCodedDNM;
            const ids: number[] = rawGamesResponses.map((RawGame: RawGame) => RawGame.id);
            const gamePromises: Promise<GameResponse>[] = rawGamesResponses.map((RawGame: RawGame) => cachePreloadedGame(RawGame));

            redisClient.set(cacheEntry.key, JSON.stringify(ids));
            if (cacheEntry.expiry !== -1) {
                redisClient.expire(cacheEntry.key, cacheEntry.expiry);
            }

            Promise.all(gamePromises)
            .then((gameResponses: GameResponse[]) => {
                return resolve(gameResponses);
            })
            .catch((error: string) => {
                return reject(error);
            });

        })
        .catch((error: AxiosError) => {
            return reject(error);
        });

    });

}

const hardCodedDNM: RawGame = {
    id: 105196,
    aggregated_rating: 0,
    total_rating_count: 0,
    cover: {
        id: 68377,
        height: 347,
        image_id: "tjiibzaypq6cbx4qouik",
        url: "//images.igdb.com/igdb/image/upload/t_thumb/tjiibzaypq6cbx4qouik.jpg",
        width: 264,
        alpha_channel: false,
        animated: false
    },
    external_games: [
        {
            id: 1218083,
            category: 1,
            created_at: 1531094400,
            game: 105196,
            name: "Don't Notice Me",
            uid: "859740",
            updated_at: 1531699200,
            url: "https://store.steampowered.com/app/859740",
            year: 2018
        }
    ],
    first_release_date: 1541548800,
    genres: [
        {
            id: 2,
            created_at: 1297555200,
            name: "Point-and-click",
            slug: "point-and-click",
            updated_at: 1323302400,
            url: "https://www.igdb.com/genres/point-and-click"
        },
        {
            id: 9,
            created_at: 1297555200,
            name: "Puzzle",
            slug: "puzzle",
            updated_at: 1323216000,
            url: "https://www.igdb.com/genres/puzzle"
        },
        {
            id: 13,
            created_at: 1297555200,
            name: "Simulator",
            slug: "simulator",
            updated_at: 1323216000,
            url: "https://www.igdb.com/genres/simulator"
        },
        {
            id: 31,
            created_at: 1323561600,
            name: "Adventure",
            slug: "adventure",
            updated_at: 1323561600,
            url: "https://www.igdb.com/genres/adventure"
        },
        {
            id: 32,
            created_at: 1341360000,
            name: "Indie",
            slug: "indie",
            updated_at: 1341360000,
            url: "https://www.igdb.com/genres/indie"
        }
    ],
    name: "Don't Notice Me",
    platforms: [
        {
            id: 6,
            abbreviation: "win",
            alternative_name: "mswin",
            category: 4,
            created_at: 1297555200,
            name: "PC (Microsoft Windows)",
            platform_logo: 203,
            slug: "win",
            updated_at: 1470009600,
            url: "https://www.igdb.com/platforms/win",
            versions: [
                1,
                13,
                14,
                15,
                124
            ],
            websites: [
                2
            ],
            generation: -1,
            product_family: -1,
            summary: ""
        },
        {
            id: 14,
            abbreviation: "mac",
            alternative_name: "Mac OS",
            category: 4,
            created_at: 1297641600,
            name: "Mac",
            platform_logo: 100,
            slug: "mac",
            updated_at: 1394236800,
            url: "https://www.igdb.com/platforms/mac",
            versions: [
                45,
                141,
                142,
                143,
                144,
                145,
                146,
                147,
                148,
                149,
                150,
                151
            ],
            websites: [
                5
            ],
            generation: -1,
            product_family: -1,
            summary: ""
        }
    ],
    release_dates: [
        {
            id: 159978,
            category: 0,
            created_at: 1539475200,
            date: 1541548800,
            game: 105196,
            human: "2018-Nov-07",
            m: 11,
            platform: 14,
            region: 8,
            updated_at: 1539475200,
            y: 2018
        },
        {
            id: 159979,
            category: 0,
            created_at: 1539475200,
            date: 1541548800,
            game: 105196,
            human: "2018-Nov-07",
            m: 11,
            platform: 6,
            region: 8,
            updated_at: 1539475200,
            y: 2018
        }
    ],
    screenshots: [
        {
            id: 228721,
            height: 1079,
            image_id: "qidm2bqrwlapwd7qvny6",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/qidm2bqrwlapwd7qvny6.jpg",
            width: 1920,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228722,
            height: 1080,
            image_id: "azsd45ympn28gpprkali",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/azsd45ympn28gpprkali.jpg",
            width: 1906,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228723,
            height: 1079,
            image_id: "c7svc4553wmfegbkmukg",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/c7svc4553wmfegbkmukg.jpg",
            width: 1920,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228724,
            height: 1080,
            image_id: "lnqfvcs5hg3hpg1fm30v",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/lnqfvcs5hg3hpg1fm30v.jpg",
            width: 1903,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228726,
            height: 1080,
            image_id: "dk71ff2myqlpkxwccun6",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/dk71ff2myqlpkxwccun6.jpg",
            width: 1906,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228728,
            height: 1080,
            image_id: "mvkwpffsw6ospss5ugny",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/mvkwpffsw6ospss5ugny.jpg",
            width: 1919,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228730,
            height: 1080,
            image_id: "rurosekzmuhttqpqtmps",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/rurosekzmuhttqpqtmps.jpg",
            width: 1913,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228732,
            height: 1080,
            image_id: "atqmj1czsndccp50evg4",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/atqmj1czsndccp50evg4.jpg",
            width: 1910,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228733,
            height: 1080,
            image_id: "kn5ogyp80elf2scn2dxo",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/kn5ogyp80elf2scn2dxo.jpg",
            width: 1920,
            alpha_channel: false,
            animated: false
        },
        {
            id: 228734,
            height: 1080,
            image_id: "tldw89b88sl1k6jblvlz",
            url: "//images.igdb.com/igdb/image/upload/t_thumb/tldw89b88sl1k6jblvlz.jpg",
            width: 1920,
            alpha_channel: false,
            animated: false
        }
    ],
    summary: "Don't Notice Me is an adventure puzzle game where you play as Mika Kittinger, a normal teen girl who just wants to get back a love letter she gave to her crush. All you need to do is sneak into his room and find the letter before anyone notices. You may need to find his address, break into his house and crack the codes on all the locks he seems to have in his room. You may even get an opportunity to snoop through his phone and computer while you're there.",
    videos: [
        {
            id: 22201,
            name: "Trailer",
            video_id: "NZIN1uluCSk"
        }
    ]
};