const bcrypt = require("bcryptjs");
import axios from "axios";
import DatabaseBase from "../base/dbBase";
import { genRandStr } from "../../../util/main";
import { sendVerificationEmail } from "../../../util/nodemailer";
import { GenericModelResponse, RecoveryEmailInfo, AccountsInfo, SteamFriend, TwitchUser, TwitchEmote, TwitchPair, AccountInfo } from "../../../client/client-server-common/common";
import config from "../../../config";

export const SALT_RNDS = 10;
export const EMAIL_VERIFICATION_LEN = 15;
export const ACCOUNT_RECOVERYID_LEN = 32;

class AccountModel extends DatabaseBase {

    constructor() {
        super();
    }

    /**
     * Create an account.
     */
    createAccount(username: string, email: string, password: string, defaultTwitch?: string, defaultSteam?: string, defaultDiscord?: string): Promise<number> {

        const salt = bcrypt.genSaltSync(SALT_RNDS);
        const hash = bcrypt.hashSync(password, salt);
        const emailVerification = genRandStr(EMAIL_VERIFICATION_LEN);
        const columnNames: string[] = ["username", "email", "passwordHash", "salt", "createdOn", "emailVerification", "recoveryid"];
        const columnValues: any[] = [username, email, hash, salt, Date.now() / 1000, emailVerification, genRandStr(ACCOUNT_RECOVERYID_LEN)];

        if (defaultTwitch) {
            columnNames.push("twitch");
            columnValues.push(defaultTwitch);
        }

        if (defaultSteam) {
            columnNames.push("steam");
            columnValues.push(defaultSteam);
        }

        if (defaultDiscord) {
            columnNames.push("discord");
            columnValues.push(defaultDiscord);
        }

        return new Promise( (resolve, reject) => {

            this.insert(
                "accounts",
                columnNames,
                columnValues,
                `?, ?, ?, ?, FROM_UNIXTIME(?), ?, ?${defaultTwitch ? ", ?" : ""}${defaultSteam ? ", ?" : ""}${defaultDiscord ? ", ?" : ""}`)
                .then((response: GenericModelResponse) => {
                    sendVerificationEmail(email, `http://www.connectwithgamers.com/account/verify/${emailVerification}`)
                    .then(() => {
                        const accountId: number = response.data.insertId;
                        return resolve(accountId);
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });
                })
                .catch((error: string) => {
                    console.log(`Faled insert: ${error}`);
                    return reject(`Username is taken.`);
                });

        });
    }

    /**
     * Get account id.
     */
    getAccountId(username: string): Promise<GenericModelResponse> {

        return new Promise( (resolve, reject) => {

            const response: GenericModelResponse = {error: undefined, data: undefined};

            this.select(
                "accounts",
                ["accountid"],
                `username=?`,
                [username])
                .then((dbResponse: GenericModelResponse) => {
                    const accountid: number = dbResponse.data[0].accountid;
                    response.data = { accountid: accountid };
                    return resolve(response);
                })
                .catch((error: string) => {
                    response.error = error;
                    return reject(response);
                });

        });
    }

    /**
     * Get account username.
     */
    getAccountUsername(accountid: number): Promise<GenericModelResponse> {

        return new Promise( (resolve, reject) => {

            const response: GenericModelResponse = {error: undefined, data: undefined};

            this.select(
                "accounts",
                ["username"],
                `accountid=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const username = dbResponse.data[0].username;
                    response.data = { username: username };
                    return resolve(response);
                })
                .catch((error: string) => {
                    response.error = error;
                    return reject(response);
                });

        });
    }

    /**
     * Get link to account's profile picture.
     */
    getAccountImage(accountid: number): Promise<string> {

        return new Promise( (resolve, reject) => {
            this.select(
                "accounts",
                ["image"],
                `accountid=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    return resolve(dbResponse.data[0].image);
                })
                .catch((error: string) => {
                    return reject(`Database error. ${error}`);
                });
        });
    }

    /**
     * Get account recovery info by username.
     */
    getAccountRecoveryInfoByUsername(username: string): Promise<RecoveryEmailInfo> {

        return new Promise( (resolve, reject) => {
            this.select(
                "accounts",
                ["email", "recoveryid"],
                `username=?`,
                [username])
                .then((dbResponse: GenericModelResponse) => {
                    const RecoveryEmailInfo: RecoveryEmailInfo = { email: dbResponse.data[0].email, uid: dbResponse.data[0].recoveryid };
                    return resolve(RecoveryEmailInfo);
                })
                .catch((error: string) => {
                    return reject(`Username not found in database.`);
                });
        });
    }

    /**
     * Verify recovery link is valid.
     */
    verifyRecoveryExists(uid: string): Promise<boolean> {

        return new Promise( (resolve, reject) => {
            this.select(
                "accounts",
                ["accountid"],
                `recoveryid=?`,
                [uid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                })
                .catch((error: string) => {
                    return reject(`Username not found in database.`);
                });
        });
    }

    /**
     * Get public account information by username filter.
     */
    getAccountsByUsernameFilter(usernameFilter: string): Promise<AccountsInfo> {
        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["accountid", "username", "discord", "steam", "twitch", "image"],
                `username LIKE ${usernameFilter ? `?` : `'%'`}`,
                [`%${usernameFilter}%`])
                .then((dbResponse: GenericModelResponse) => {
                    const accounts: AccountInfo[] = [];
                    if (dbResponse.data.length > 0) {
                        dbResponse.data.forEach((element: any) => {
                            const account: AccountInfo = {
                                accountid: element.accountid,
                                username: element.username,
                                discord_url: element.discord,
                                steam_url: element.steam,
                                twitch_url: element.twitch,
                                image: element.image
                            };
                            accounts.push(account);
                        });
                    }

                    const dbUsers: AccountsInfo = { accounts: accounts };
                    return resolve(dbUsers);
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject();
                });

        });
    }

    /**
     * Get All public accounts information.
     */
    getAccountsInfoById(accountIds: number[]): Promise<AccountsInfo> {

        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["accountid", "username", "discord", "steam", "twitch", "image"],
                `accountid IN (${accountIds.join(",")})`,
                accountIds)
                .then((dbResponse: GenericModelResponse) => {
                    const accounts: AccountInfo[] = [];

                    if (dbResponse.data.length > 0) {
                        dbResponse.data.forEach((element: any) => {
                            const account: AccountInfo = {
                                accountid: element.accountid,
                                username: element.username,
                                discord_url: element.discord,
                                steam_url: element.steam,
                                twitch_url: element.twitch,
                                image: element.image
                            };
                            accounts.push(account);
                        });
                    }

                    const dbUsers: AccountsInfo = { accounts: accounts };
                    return resolve(dbUsers);
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject();
                });

        });
    }

    /**
     * Get public account information.
     */
    getAccountInfo(accountid: number): Promise<AccountInfo> {

        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["accountid", "username", "discord", "steam", "twitch", "image"],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0) {
                        const account: AccountInfo = {
                            accountid: dbResponse.data[0].accountid,
                            username: dbResponse.data[0].username,
                            discord_url: dbResponse.data[0].discord,
                            steam_url: dbResponse.data[0].steam,
                            twitch_url: dbResponse.data[0].twitch,
                            image: dbResponse.data[0].image
                        };
                        const dbUser: AccountInfo = account;
                        return resolve(dbUser);
                    } else {
                        return reject(accountid);
                    }
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject(accountid);
                });

        });
    }

    /**
     * Return resolved twitch id from name.
     */
    getTwitchId(accountid: number): Promise<number> {

        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["twitch"],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0 && dbResponse.data[0].twitch !== null) {
                        const twitchName: string = dbResponse.data[0].twitch;

                        axios
                        .get(`https://api.twitch.tv/helix/users?login=${twitchName}`,
                        {
                            headers: {
                                "Client-ID": config.twitch.clientId,
                                "Accept": "application/vnd.twitchtv.v5+json"
                            }
                        })
                        .then((result) => {
                            if (result.data.data.length > 0) {
                                const twitchId: number = result.data.data[0].id;
                                return resolve(twitchId);
                            } else {
                                return reject("Twitch username does not exist.");
                            }
                        })
                        .catch((err: string) => {
                            return reject(`HTTP error: ${err}.`);
                        });

                    } else {
                        return reject();
                    }
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject(`Database error`);
                });

        });
    }

    /**
     * Return live streams from Twitch's following list.
     */
    getTwitchFollows(accountid: number): Promise<TwitchUser[]> {

        const getLiveFollows = (followIds: TwitchPair[]): Promise<TwitchUser[]> => {

            return new Promise( (resolve, reject) => {

                const liveFollowPromises: Promise<TwitchUser>[] = [];

                followIds.forEach((pair: TwitchPair) => {
                    liveFollowPromises.push(resolveTwitchLiveFollow(pair));
                });

                Promise.all(liveFollowPromises)
                .then((vals: TwitchUser[]) => {
                    const liveFollows: TwitchUser[] = vals.filter((follow: TwitchUser) => { return follow !== undefined; });
                    return resolve(liveFollows);
                })
                .catch((error: string) => {
                    return reject(`Error retrieving Twitch live follow data: ${error}`);
                });

            });

        };

        const getFollowIds = (twitchId: number, followCount: number): Promise<TwitchPair[]> => {

            return new Promise( (resolve, reject) => {
                const idsResolvedPerApiCall: number = 100;
                const followIdPromises: Promise<TwitchPair[]>[] = [];
                const numOfFollows: number = followCount;
                const numApiCalls: number = Math.ceil(numOfFollows / idsResolvedPerApiCall);

                for (let i = 0; i < numApiCalls; i++) {
                    followIdPromises.push(resolveTwitchFollowIds(twitchId, idsResolvedPerApiCall, i * idsResolvedPerApiCall));
                }

                Promise.all(followIdPromises)
                .then((vals: any) => {
                    const followIds: TwitchPair[] = [];
                    vals.forEach((x: TwitchPair[]) => {
                        x.forEach((y: TwitchPair) => {
                            followIds.push(y);
                        });
                    });
                    return resolve(followIds);
                })
                .catch((error: string) => {
                    return reject(`Error retrieving Twitch id data: ${error}`);
                });

            });

        };

        const getNumberOfFollows = (twitchId: number): Promise<number> => {

            return new Promise( (resolve, reject) => {

                axios
                .get(`https://api.twitch.tv/kraken/users/${twitchId}/follows/channels`,
                {
                    headers: {
                        [`Client-ID`]: config.twitch.clientId,
                        Accept: `application/vnd.twitchtv.v5+json`
                    }
                })
                .then((result: any) => {
                    return resolve(result.data._total);
                })
                .catch((err: string) => {
                    return reject(err);
                });

            });

        };

        const resolveTwitchLiveFollow = (followPair: TwitchPair): Promise<TwitchUser> => {

            return new Promise( (resolve, reject) => {
                const cheerEmotes: TwitchEmote[] = [];
                const subEmotes: TwitchEmote[] = [];
                const badgeEmotes: TwitchEmote[] = [];
                let partnered: boolean = undefined;
                let streamTitle: string = undefined;

                return axios
                .get(`https://api.twitch.tv/api/channels/${followPair.name}/product`,
                {
                    headers: {
                        [`Client-ID`]: config.twitch.clientId,
                        Accept: `application/vnd.twitchtv.v5+json`
                    }
                })
                .then((outerResult: any) => {

                    const subTiers: any[] = outerResult.data.plans;

                    subTiers.forEach((subTier: any, index: number) => {
                        const subTierEmotes: any = subTier.emoticons;
                        subTierEmotes.forEach((subEmoteRaw: any) => {
                            const reformattedEmoteName: string = index === 0 ? subEmoteRaw.regex : subEmoteRaw.regex + ` (T${index + 1})`;
                            const reformattedEmoteLink: string = subEmoteRaw.url.slice(0, subEmoteRaw.url.length - 3) + `3.0`;
                            const subEmote: TwitchEmote = { name: reformattedEmoteName, link: reformattedEmoteLink };
                            subEmotes.push(subEmote);
                        });
                    });

                })
                .catch(() => {})
                .then(() => {

                    axios
                    .get(`https://badges.twitch.tv/v1/badges/channels/${followPair.id}/display?language=en`)
                    .then((result: any) => {

                        if (result.data && result.data.badge_sets && result.data.badge_sets.bits && result.data.badge_sets.bits.versions) {
                            const cheerEmotesRaw: any = result.data.badge_sets.bits.versions;
                            for (const cheerEmoteRaw in cheerEmotesRaw) {
                                cheerEmotes.push({ name: cheerEmoteRaw, link: cheerEmotesRaw[cheerEmoteRaw].image_url_4x });
                            }
                        }

                        if (result.data && result.data.badge_sets && result.data.badge_sets.subscriber && result.data.badge_sets.subscriber.versions) {
                            const badgeEmotesRaw: any = result.data.badge_sets.subscriber.versions;
                            for (const badgeEmoteRaw in badgeEmotesRaw) {
                                let formattedBadgeName: string = undefined;
                                const badgeMonths: number = Number(badgeEmoteRaw);

                                if (badgeMonths >= 12) {
                                    const years: number = badgeMonths / 12;
                                    formattedBadgeName = `${years}y`;
                                } else if (badgeMonths === 0) {
                                    formattedBadgeName = `1m`;
                                } else {
                                    formattedBadgeName = `${badgeMonths}m`;
                                }

                                badgeEmotes.push({ name: formattedBadgeName, link: badgeEmotesRaw[badgeEmoteRaw].image_url_4x });
                            }
                        }

                        return axios
                        .get(`https://api.twitch.tv/kraken/channels/${followPair.id}`,
                        {
                            headers: {
                                [`Client-ID`]: config.twitch.clientId,
                                Accept: `application/vnd.twitchtv.v5+json`
                            }
                        });
                    })
                    .then((result: any) => {
                        partnered = result.data.partner;
                        streamTitle = result.data.status;

                        return axios
                        .get(`https://api.twitch.tv/kraken/streams/${followPair.id}`,
                        {
                            headers: {
                                [`Client-ID`]: config.twitch.clientId,
                                Accept: `application/vnd.twitchtv.v5+json`
                            }
                        });
                    })
                    .then((result: any) => {
                        const followRaw: any = result.data.stream;
                        if (followRaw) {
                            const liveFollow: TwitchUser = {
                                id: followRaw.channel._id,
                                name: followRaw.channel.name,
                                viewerCount: followRaw.viewers,
                                gameName: followRaw.channel.game,
                                profilePicLink: followRaw.channel.logo,
                                profileLink: followRaw.channel.url,
                                streamPreviewLink: followRaw.preview.small,
                                cheerEmotes: cheerEmotes.length > 0 ? cheerEmotes : undefined,
                                subEmotes: subEmotes.length > 0 ? subEmotes : undefined,
                                badgeEmotes: badgeEmotes.length > 0 ? badgeEmotes : undefined,
                                partnered: partnered,
                                streamTitle: streamTitle
                            };
                            return resolve(liveFollow);
                        } else {
                            return resolve(undefined);
                        }

                    })
                    .catch((err: string) => {
                        return reject(err);
                    });
                });

            });

        };

        const resolveTwitchFollowIds = (twitchId: number, limit: number, offset: number): Promise<TwitchPair[]> => {

            return new Promise( (resolve, reject) => {

                axios
                .get(`https://api.twitch.tv/kraken/users/${twitchId}/follows/channels/?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        [`Client-ID`]: config.twitch.clientId,
                        Accept: `application/vnd.twitchtv.v5+json`
                    }
                })
                .then((result: any) => {
                    const followsRaw: any = result.data.follows;
                    const followIds: TwitchPair[] = [];
                    followsRaw.forEach((followRaw: any) => {
                        followIds.push({ id: followRaw.channel._id, name: followRaw.channel.name });
                    });
                    return resolve(followIds);
                })
                .catch((err: string) => {
                    return reject(err);
                });

            });

        };

        return new Promise( (resolve, reject) => {

            let twitchId: number = undefined;

            this.getTwitchId(accountid)
            .then((result: number) => {
                twitchId = result;
                return getNumberOfFollows(twitchId);
            })
            .then((followCount: number) => {
                return getFollowIds(twitchId, followCount);
            })
            .then((followPairs: TwitchPair[]) => {
                return getLiveFollows(followPairs);
            })
            .then((follows: TwitchUser[]) => {
                return resolve(follows);
            })
            .catch((err: string) => {
                return reject(err);
            });

        });

    }

    /**
     * Return resolved steam id from name.
     */
    getSteamId(accountid: number): Promise<number > {

        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["steam"],
                `accountid=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0 && dbResponse.data[0].steam !== null) {
                        const steamName: string = dbResponse.data[0].steam;

                        axios
                        .get(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1?key=${config.steam.key}&vanityurl=${steamName}`)
                        .then((result: any) => {
                            if (result.data.response.steamid) {
                                const steamId: number = result.data.response.steamid;
                                    return resolve(steamId);
                            } else {
                                return reject("Steam username does not exist.");
                            }
                        })
                        .catch((err: string) => {
                            return reject(err);
                        });

                    } else {
                        return reject();
                    }
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject(`Database error`);
                });

        });
    }

    /**
     * Return data about Steam friends.
     */
    getSteamFriends(accountSteamId: number): Promise<SteamFriend[] > {

        const resolveSteamIdToFriendData = (steamids: number[]): Promise<SteamFriend[]> => {
            return new Promise( (resolve, reject) => {

                axios
                .get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.steam.key}&steamids=${steamids.join(",")}`)
                .then((summaryResult: any) => {
                    const friendsDataRaw: any = summaryResult.data.response.players;
                    const friends: SteamFriend[] = [];
                    let idsResolved: number = 0;

                    friendsDataRaw.forEach((friendDataRaw: any, index: number) => {
                        const steamid: number = friendDataRaw.steamid;
                        const isFriendOnline: boolean = friendDataRaw.personastate !== 0;
                        let lastOnline: string = undefined;
                        let countryFlagLink: string = undefined;

                        if (!isFriendOnline) {
                            const oneDay = 24 * 60 * 60 * 1000;
                            const today: Date = new Date();
                            const lastOnlineDate: Date = new Date(friendDataRaw.lastlogoff * 1000);
                            const timeDiff: number = Math.abs(lastOnlineDate.getTime() - today.getTime());
                            const days: number = Math.round(timeDiff / oneDay);
                            const hours: number = Math.floor(timeDiff / 36e5);
                            const minutes: number = Math.floor((timeDiff / (1000 * 60)) % 60);

                            if (minutes < 1 && hours === 0 && days <= 1) {
                                lastOnline = `Last online seconds ago`;
                            } else if (hours === 0 && days <= 1) {
                                lastOnline = `Last online ${minutes} minutes ago`;
                            } else if (days > 1) {
                                lastOnline = `Last online ${days} days ago`;
                            } else {
                                lastOnline = `Last online ${hours} hrs, ${minutes} minutes ago`;
                            }

                        }

                        if (friendDataRaw.loccountrycode) {
                            countryFlagLink = `https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${friendDataRaw.loccountrycode.toLowerCase()}.svg`;
                        }

                        axios
                        .get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${config.steam.key}&steamid=${steamid}`)
                        .then((recentlyPlayedResult: any) => {
                            let recentlyPlayedName: string = undefined;
                            let recentlyPlayedImageLink: string = undefined;

                            if (recentlyPlayedResult.data.response.games) {
                                const appId: number = recentlyPlayedResult.data.response.games[0].appid;
                                const appName: string = recentlyPlayedResult.data.response.games[0].name;
                                const appHash: string = recentlyPlayedResult.data.response.games[0].img_icon_url;
                                recentlyPlayedName = appName;
                                recentlyPlayedImageLink = `http://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${appHash}.jpg`;
                            }

                            const friend: SteamFriend = {
                                id: steamid,
                                name: friendDataRaw.personaname,
                                online: isFriendOnline,
                                lastOnline: lastOnline,
                                profilePicture: friendDataRaw.avatarmedium,
                                profileLink: friendDataRaw.profileurl,
                                recentlyPlayedName: recentlyPlayedName,
                                recentlyPlayedImageLink: recentlyPlayedImageLink,
                                countryFlagLink: countryFlagLink
                            };
                            friends.push(friend);
                            idsResolved++;
                            if (friendsDataRaw.length === idsResolved) {
                                resolve(friends);
                            }
                        })
                        .catch((err: any) => {
                            return reject(err);
                        });

                    });

                })
                .catch((err: any) => {
                    return reject(err);
                });

            });
        };

        return new Promise( (resolve, reject) => {
            axios
            .get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${config.steam.key}&steamid=${accountSteamId}&relationship=friend`)
            .then((result: any) => {
                if (result.data.friendslist && result.data.friendslist.friends) {
                    const idsResolvedPerApiCall: number = 100;
                    const friendPromises: Promise<SteamFriend[]>[] = [];
                    const numOfFriends: number = result.data.friendslist.friends.length;
                    const numApiCalls: number = Math.ceil(numOfFriends / idsResolvedPerApiCall);
                    for (let i = 0; i < numApiCalls; i++) {
                        let startOfSteamIds: number = -1;
                        let endOfSteamIds: number = -1;
                        if (i === (numApiCalls - 1)) {
                            // push remaining steam ids
                            startOfSteamIds = i * idsResolvedPerApiCall;
                            endOfSteamIds = (i * idsResolvedPerApiCall) + (numOfFriends % idsResolvedPerApiCall);
                        } else {
                            // push maximum number of steam ids
                            startOfSteamIds = i * idsResolvedPerApiCall;
                            endOfSteamIds = (i * idsResolvedPerApiCall) + idsResolvedPerApiCall;
                        }
                        const subsetSteamIds: number[] = result.data.friendslist.friends
                            .slice(startOfSteamIds, endOfSteamIds)
                            .map((x: any) => {
                                return x.steamid;
                            });
                        friendPromises.push(resolveSteamIdToFriendData(subsetSteamIds));
                    }

                    Promise.all(friendPromises)
                    .then((vals: any) => {
                        const friends: SteamFriend[] = [];
                        vals.forEach((x: SteamFriend[]) => {
                            x.forEach((y: SteamFriend) => {
                                friends.push(y);
                            });
                        });
                        const steamFriends: SteamFriend[] = friends;
                        return resolve(steamFriends);
                    })
                    .catch((error: string) => {
                        return reject(`Error retrieving Steam friend data: ${error}`);
                    });

                } else {
                    return reject("No friends list associated with Steam id.");
                }
            })
            .catch((err: any) => {
                if (err.response.status === 401) {
                    // Steam profile is set to Private
                    const steamFriendsResponse: SteamFriend[] = undefined;
                    return resolve(steamFriendsResponse);
                }
                return reject(err);
            });

        });
    }

    /**
     * Return account's Discord link.
     */
    getDiscordLink(accountid: number): Promise<string > {

        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["discord"],
                `accountid=?`,
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    if (dbResponse.data.length > 0 && dbResponse.data[0].discord !== null) {
                        const discordLink: string = dbResponse.data[0].discord;
                        return resolve(discordLink);
                    } else {
                        return reject();
                    }
                })
                .catch((err: string) => {
                    console.log(`Database error: ${err}`);
                    return reject(`Database error`);
                });

        });
    }

    /**
     * Send verification email to confirm account's email address.
     */
    resendAccountEmail(accountid: number): Promise<null> {

        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["email", "emailVerification"],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const dbEmailVerification: string = dbResponse.data[0].emailVerification;
                    const dbEmail: string = dbResponse.data[0].email;
                    sendVerificationEmail(dbEmail, `www.connectwithgamers.com/account/verify/${dbEmailVerification}`)
                    .then(() => {
                        return resolve();
                    })
                    .catch((error: string) => {
                        return reject(error);
                    });

                })
                .catch((error: string) => {
                    return reject(`Error: ${error}`);
                });

        });
    }

    /**
     * Verify visited URL contains a valid email verification code.
     */
    verifyAccountEmail(accountid: number, verificationCode: string): Promise<boolean> {

        return new Promise( (resolve, reject) => {

            this.select(
                "accounts",
                ["emailVerification"],
                "accountid=?",
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    const dbEmailVerification: string = dbResponse.data[0].emailVerification;

                    if (dbEmailVerification !== verificationCode) {
                        return resolve(false);
                    }

                    return this.update(
                        "accounts",
                        "emailVerification=?",
                        [undefined],
                        "accountid=?",
                        [accountid])
                        .then((dbResponse: GenericModelResponse) => {
                            if (dbResponse.data.affectedRows == 1) {
                                return resolve(true);
                            } else {
                                return reject(`Database error: Failed to update.`);
                            }
                        })
                        .catch((error: string) => {
                            return reject(`Database error. ${error}`);
                        });
                })
                .catch((error: string) => {
                    return reject(`Database error. ${error}`);
                });

        });
    }

    /**
     * Delete account by id.
     */
    deleteAccountById(accountid: number): Promise<void> {

        return new Promise( (resolve, reject) => {

            this.delete(
                "accounts",
                ["accountid=?"],
                [accountid])
                .then((dbResponse: GenericModelResponse) => {
                    return resolve();
                })
                .catch((error: string) => {
                    return reject(`Database error. ${error}`);
                });

        });
    }

}

export const accountModel: AccountModel = new AccountModel();