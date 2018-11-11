import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { cacheGenreList, getCachedGenreList, genreListKeyExists } from "./main";

describe("List of genres", function() {
    let cachedData: any;

    it("caches", function() {
        return cacheGenreList()
            .then((data: any) => {
                expect(data).is.not.undefined;
                cachedData = data;
            });
    });

    it("exists in cache", function() {
        expect(cachedData).is.not.undefined;
        return expect(genreListKeyExists()).to.eventually.be.fulfilled;
    });

    it("gets cached version", function() {
        expect(cachedData).is.not.undefined;
        return getCachedGenreList()
            .then((data: any) => {
                const dataInCache: any = data;
                expect(JSON.stringify(dataInCache)).is.deep.equal(JSON.stringify(cachedData));
            });
    });

});