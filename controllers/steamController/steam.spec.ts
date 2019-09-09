import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { routes, GenericCachedRoute, GenericCachedWithDataRoute } from "./steam";
import {
    NewsArticle,
    GameResponse
} from "../../client/client-server-common/common";
import { upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames } from "./cache/upcomingGames/main";
import { recentGamesKeyExists, getCachedRecentGames, cacheRecentGames } from "./cache/recentlyReleased/main";
import { gameKeyExists, getCachedGame, cacheGame } from "./cache/games/main";
import { searchGamesKeyExists, getCachedSearchGames, cacheSearchGames } from "./cache/searchGames/main";
import { popularGamesKeyExists, getCachedPopularGames, cachePopularGames } from "./cache/popularGames/main";
import { resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames } from "./cache/filter/main";
import { reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames } from "./cache/reviewedGames/main";
import { predefinedPopularGamesKeyExists, getCachedPredefinedPopularGames, cachePredefinedPopularGames } from "./cache/predefined/popular/main";
import { predefinedUpcomingGamesKeyExists, getCachedPredefinedUpcomingGames, cachePredefinedUpcomingGames } from "./cache/predefined/upcoming/main";
import { predefinedRecentGamesKeyExists, getCachedPredefinedRecentGames, cachePredefinedRecentGames } from "./cache/predefined/recent/main";
import { newsKeyExists, getCachedNews, cacheNews } from "./cache/news/main";

describe("STEAM Routes", function() {
    const steamRouterPrefix: string = `/steam`;

    it(steamRouterPrefix.concat(routes.getRoute("predefinedrecent")), function() {
        expect(GenericCachedRoute<GameResponse[]>(predefinedRecentGamesKeyExists, getCachedPredefinedRecentGames, cachePredefinedRecentGames)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("predefinedupcoming")), function() {
        expect(GenericCachedRoute<GameResponse[]>(predefinedUpcomingGamesKeyExists, getCachedPredefinedUpcomingGames, cachePredefinedUpcomingGames)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("predefinedpopular")), function() {
        expect(GenericCachedRoute<GameResponse[]>(predefinedPopularGamesKeyExists, getCachedPredefinedPopularGames, cachePredefinedPopularGames)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("upcominggames")), function() {
        expect(GenericCachedRoute<GameResponse[]>(upcomingGamesKeyExists, getCachedUpcomingGames, cacheUpcomingGames)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("reviewedgames")), function() {
        expect(GenericCachedRoute<GameResponse[]>( reviewedGamesKeyExists, getCachedReviewedGames, cacheReviewedGames)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("news")), function() {
        expect(GenericCachedRoute<NewsArticle[]>(newsKeyExists, getCachedNews, cacheNews)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("populargames")), function() {
        expect(GenericCachedRoute<GameResponse[]>(popularGamesKeyExists, getCachedPopularGames, cachePopularGames)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("recentgames")), function() {
        expect(GenericCachedRoute<GameResponse[]>(recentGamesKeyExists, getCachedRecentGames, cacheRecentGames)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("searchgames")), function() {
        const query: string = "call of duty";
        expect(GenericCachedWithDataRoute<SearchGameResponse[], string>(searchGamesKeyExists, getCachedSearchGames, cacheSearchGames, query)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("resultsgames")), function() {
        const query: string = `{"query":"tomb raider","platforms":"6","genres":"31,5","categories":"0","popularity":"60","sort":"releasedate-desc"}`;
        expect(GenericCachedWithDataRoute<GameResponse[], string>(resultsGamesKeyExists, getCachedResultsGames, cacheResultsGames, query)).to.eventually.be.fulfilled;
    });

    it(steamRouterPrefix.concat(routes.getRoute("game")), function() {
        const gameid: number = 37777;
        expect(GenericCachedWithDataRoute<GameResponse, number>(gameKeyExists, getCachedGame, cacheGame, gameid)).to.eventually.be.fulfilled;
    });

});