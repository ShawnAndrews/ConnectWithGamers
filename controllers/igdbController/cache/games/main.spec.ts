import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { cacheGame, getCachedGame, gameKeyExists } from "./main";

describe("Get game by id", function() {
    let cachedData: any;
    const gameid: number = 37777;

    it("caches", function() {
        return cacheGame(gameid)
            .then((data: any) => {
                expect(data).is.not.undefined;
                cachedData = data;
            });
    });

    it("exists in cache", function() {
        expect(cachedData).is.not.undefined;
        return expect(gameKeyExists(gameid)).to.eventually.be.fulfilled;
    });

    it("gets cached version", function() {
        expect(cachedData).is.not.undefined;
        return getCachedGame(gameid)
            .then((data: any) => {
                const dataInCache: any = data;
                expect(JSON.stringify(dataInCache)).is.deep.equal(JSON.stringify(cachedData));
            });
    });

});