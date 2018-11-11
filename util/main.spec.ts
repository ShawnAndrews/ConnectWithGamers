import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { formatDate, addMonths, steamAPIGetPriceInfo, ArrayClean, genRandStr, steamAPIGetReviews } from "./main";
import { SteamAPIGetPriceInfoResponse, SteamAPIGetReviewsResponse } from "../client/client-server-common/common";

describe("Date manipulation", function() {
  const currentDate: Date = new Date();

  it("converts Date to human-readable format", function() {
    const correctFormat: RegExp = /\d\d\d\d-\d\d-\d\d/;
    const returnedFormat: string = formatDate(currentDate);

    expect(correctFormat.test(returnedFormat)).to.equal(true);
  });

  it("adds months to a Date", function() {
    const monthsToAdd: number = 5;

    expect(addMonths(currentDate, monthsToAdd)).that.is.a("Date");
  });

  it("cleans an array", function() {
    const uncleanedArray: number[] = [2, 5, 5, 7, 8, 7, 1];
    const cleanedArray: number[] = [2, 5, 5, 8, 1];

    return expect(ArrayClean(uncleanedArray, 7)).deep.equal(cleanedArray);
  });

  it("generates a random alphanumeric string", function() {
    const strLength: number = 34;

    return expect(genRandStr(strLength)).has.length(strLength);
  });

});

describe("Steam API calls", function() {

  it("gets game prices", function() {
    const steamGameIds: number[] = [311210, 292730];
    const steamPricePromise: Promise<SteamAPIGetPriceInfoResponse[]> = steamAPIGetPriceInfo(steamGameIds);

    return expect(steamPricePromise).to.eventually.have.length(2);
  });

  it("gets game reviews", function() {
    const steamGameId: number = 311210;
    const steamPricePromise: Promise<SteamAPIGetReviewsResponse> = steamAPIGetReviews(steamGameId);

    return steamPricePromise.then((data: SteamAPIGetReviewsResponse) => {
      expect(data).has.property("reviews");
    });
  });

});