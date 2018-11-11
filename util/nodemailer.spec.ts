import chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;
import { sendContactEmail, sendVerificationEmail } from "./nodemailer";


describe("Mailer", function() {

    it("sends contact-us form email", function() {
        const name: string = "TestName";
        const fromEmail: string = "TestEmail@hotmail.com";
        const title: string = "TestTitle";
        const message: string = "TestMessage";
        const contactEmail: Promise<void> = sendContactEmail(name, fromEmail, title, message);

        return expect(contactEmail).to.be.fulfilled;
    });

    it("sends account verification email", function() {
        const toEmail: string = "TestEmail@hotmail.com";
        const link: string = "TestLink";
        const verificationEmail: Promise<void> = sendVerificationEmail(toEmail, link);

        return expect(verificationEmail).to.be.fulfilled;
    });

});