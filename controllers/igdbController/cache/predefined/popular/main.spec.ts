import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { cachePredefinedPopularGames, getCachedPredefinedPopularGames, predefinedPopularGamesKeyExists } from "./main";

describe("Predefined Popular games", function() {
    let cachedData: any;

    it("caches", function() {
        return cachePredefinedPopularGames()
            .then((data: any) => {
                expect(data).is.not.undefined;
                cachedData = data;
            });
    });

    it("exists in cache", function() {
        expect(cachedData).is.not.undefined;
        return expect(predefinedPopularGamesKeyExists()).to.eventually.be.fulfilled;
    });

    it("gets cached version", function() {
        expect(cachedData).is.not.undefined;
        return getCachedPredefinedPopularGames()
            .then((data: any) => {
                const dataInCache: any = data;
                expect(JSON.stringify(dataInCache)).is.deep.equal(JSON.stringify(cachedData));
            });
    });

});