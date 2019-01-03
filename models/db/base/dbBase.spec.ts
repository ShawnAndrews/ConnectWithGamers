import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import DatabaseBase from "./dbBase";
import { GenericModelResponse } from "../../../client/client-server-common/common";
import { MysqlError } from "mysql";

describe("Database base model", function() {
    const dbBase: DatabaseBase = new DatabaseBase();
    let testEmoteId: number;

    it("connects to mysql db", function() {
        return dbBase.connectToDatabase((err: MysqlError) => {
            expect(err).is.null;
        });
    });

    it("inserts", function() {
        const chatEmoteURL: string = "https://i.imgur.com/0y2obrO.png";
        const chatEmotePrefix: string = "b";
        const chatEmoteSuffix: string = "C";

        const insertPromise: Promise<GenericModelResponse> = dbBase.insert("chatemotes",
            ["prefix", "suffix", "emoteurl", "createdOn"],
            [chatEmotePrefix, chatEmoteSuffix, chatEmoteURL, Date.now() / 1000],
            "?, ?, ?, FROM_UNIXTIME(?)");

        return insertPromise
            .then((response: GenericModelResponse) => {
                expect(response.data.insertId).is.not.undefined;
                testEmoteId = response.data.insertId;
            });
    });

    it("selects", function() {
        expect(testEmoteId).is.not.undefined;
        const selectPromise: Promise<GenericModelResponse> = dbBase.select("chatemotes",
            ["prefix", "suffix", "emoteurl", "createdOn"],
            "emoteid=?",
            [testEmoteId]);

        return expect(selectPromise).to.eventually.be.fulfilled;
    });

    it("updates", function() {
        expect(testEmoteId).is.not.undefined;
        const chatNewEmoteURL: string = "https://i.imgur.com/Y74t2Fm.png";

        const updatePromise: Promise<GenericModelResponse> = dbBase.update("chatemotes",
            "emoteurl=?",
            [chatNewEmoteURL],
            "emoteid=?",
            [testEmoteId]);

        return expect(updatePromise).to.eventually.be.fulfilled;
    });

    it("deletes", function() {
        expect(testEmoteId).is.not.undefined;
        const deletePromise: Promise<GenericModelResponse> = dbBase.delete("chatemotes", ["emoteid=?"], [testEmoteId]);

        return expect(deletePromise).to.eventually.be.fulfilled;
    });

});