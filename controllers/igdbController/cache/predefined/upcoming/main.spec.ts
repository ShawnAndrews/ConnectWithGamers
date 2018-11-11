import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { cachePredefinedUpcomingGames, getCachedPredefinedUpcomingGames, predefinedUpcomingGamesKeyExists } from "./main";

describe("Predefined Upcoming games", function() {
    let cachedData: any;

    it("caches", function() {
        return cachePredefinedUpcomingGames()
            .then((data: any) => {
                expect(data).is.not.undefined;
                cachedData = data;
            });
    });

    it("exists in cache", function() {
        expect(cachedData).is.not.undefined;
        return expect(predefinedUpcomingGamesKeyExists()).to.eventually.be.fulfilled;
    });

    it("gets cached version", function() {
        expect(cachedData).is.not.undefined;
        return getCachedPredefinedUpcomingGames()
            .then((data: any) => {
                const dataInCache: any = data;
                expect(JSON.stringify(dataInCache)).is.deep.equal(JSON.stringify(cachedData));
            });
    });

});