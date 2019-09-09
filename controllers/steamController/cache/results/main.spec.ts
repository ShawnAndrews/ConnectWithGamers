import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { cacheResultsGames, getCachedResultsGames, resultsGamesKeyExists } from "./main";

describe("Get games by filter", function() {
    let cachedData: any;
    const query: string = `{"query":"tomb raider","platforms":"6","genres":"31,5","categories":"0","popularity":"60","sort":"releasedate-desc"}`;

    it("caches", function() {
        return cacheResultsGames(query)
            .then((data: any) => {
                expect(data).is.not.undefined;
                cachedData = data;
            });
    });

    it("exists in cache", function() {
        expect(cachedData).is.not.undefined;
        return expect(resultsGamesKeyExists(query)).to.eventually.be.fulfilled;
    });

    it("gets cached version", function() {
        expect(cachedData).is.not.undefined;
        return getCachedResultsGames(query)
            .then((data: any) => {
                const dataInCache: any = data;
                expect(JSON.stringify(dataInCache)).is.deep.equal(JSON.stringify(cachedData));
            });
    });

});