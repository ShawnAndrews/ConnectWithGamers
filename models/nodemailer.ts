const nodemailer = require("nodemailer");
import config from "../config";

export function sendVerificationEmail(toEmail: string, link: string): Promise<boolean> {

    return new Promise( (resolve, reject) => {

        const transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.secure ? 465 : 587,
            secure: config.smtp.secure,
            auth: {
                user: config.smtp.username,
                pass: config.smtp.password
            }
        });

        const mailOptions = {
            from: '"Connect With Gamers Admin" <ConnectWithGamers>',
            to: toEmail,
            subject: "Email verification",
            text: link,
            html: emailTemplate(link)
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.log(`Error sending verification email: ${error}`);
                return reject(`Failed to send verification email.`);
            }
            return resolve();
        });

    });

}

const emailTemplate = (link: string): string => { return `<style>

body {
    margin: 0;
    padding: 0;
    mso-line-height-rule: exactly;
    min-width: 100%;
}

.wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    min-width: 620px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
}

body, .wrapper {
    background-color: #ffffff;
}

/* Basic */
table {
    border-collapse: collapse;
    border-spacing: 0;
}
table.center {
    margin: 0 auto;
    width: 602px;
}
td {
    padding: 0;
    vertical-align: top;
}

.spacer,
.border {
    font-size: 1px;
    line-height: 1px;
}
.spacer {
    width: 100%;
    line-height: 16px
}
.border {
    background-color: #e0e0e0;
    width: 1px;
}

.padded {
    padding: 0 24px;
}
img {
    border: 0;
    -ms-interpolation-mode: bicubic;
}
.image {
    font-size: 12px;
}
.image img {
    display: block;
}
strong, .strong {
    font-weight: 700;
}
h1,
h2,
h3,
p,
ol,
ul,
li {
    margin-top: 0;
}
ol,
ul,
li {
    padding-left: 0;
}

a {
    text-decoration: none;
    color: #616161;
}
.btn {
    background-color:#2196F3;
    border:1px solid #2196F3;
    border-radius:2px;
    color:#ffffff;
    display:inline-block;
    font-family:Roboto, Helvetica, sans-serif;
    font-size:14px;
    font-weight:400;
    line-height:36px;
    text-align:center;
    text-decoration:none;
    text-transform:uppercase;
    width:200px;
    height: 36px;
    padding: 0 8px;
    margin: 0;
    outline: 0;
    outline-offset: 0;
    -webkit-text-size-adjust:none;
    mso-hide:all;
}

/* Top panel */
.title {
    text-align: left;
}

.subject {
    text-align: right;
}

.title, .subject {
    width: 300px;
    padding: 8px 0;
    color: #616161;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
}

/* Header */
.logo {
    padding: 16px 0;
}

/* Logo */
.logo-image {

}

/* Main */
.main {
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
    -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
}

/* Content */
.columns {
    margin: 0 auto;
    width: 600px;
    background-color: #ffffff;
    font-size: 14px;
}

.column {
    text-align: left;
    background-color: #ffffff;
    font-size: 14px;
}

.column-top {
    font-size: 24px;
    line-height: 24px;
}

.content {
    width: 100%;
}

.column-bottom {
    font-size: 8px;
    line-height: 8px;
}

.content h1 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #212121;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
}

.content p {
    margin-top: 0;
    margin-bottom: 16px;
    color: #212121;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
}
.content .caption {
    color: #616161;
    font-size: 12px;
    line-height: 20px;
}

/* Footer */
.signature, .subscription {
    vertical-align: bottom;
    width: 300px;
    padding-top: 8px;
    margin-bottom: 16px;
}

.signature {
    text-align: left;
}
.subscription {
    text-align: right;
}

.signature p, .subscription p {
    margin-top: 0;
    margin-bottom: 8px;
    color: #616161;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
}
</style>

<center class="wrapper">
    <table class="top-panel center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="title" width="300">Connect With Gamers inc.</td>
            <td class="subject" width="300"><a class="strong" href="http://www.connectwithgamers.com" target="_blank">www.connectwithgamers.com</a></td>
        </tr>
        <tr>
            <td class="border" colspan="2">&nbsp;</td>
        </tr>
        </tbody>
    </table>

    <div class="spacer">&nbsp;</div>

    <table class="main center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="column">
                <div class="column-top">&nbsp;</div>
                <table class="content" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td class="padded">
                          <div class="logo-image" style="text-align:center;">
                    <a href="https://i.imgur.com/obqCKhX.png" target="_blank"><img src="https://i.imgur.com/obqCKhX.png" alt="logo-alt"  width="200" height="200"></a>
                </div>
                          <h1>Verification email!</h1>
                          <p>If you were not expecting this email please disregard it.</p>
                          <p>Click the following button to confirm your account's email address.</p>
                          <p style="text-align:center;"><a href="${link}" class="btn">CONFIRM</a></p>
                          <p style="text-align:center;">
                            <a href="#" class="strong">${link}</a>
                          </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="column-bottom">&nbsp;</div>
            </td>
        </tr>
        </tbody>
    </table>

    <div class="spacer">&nbsp;</div>

    <table class="footer center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="border" colspan="2">&nbsp;</td>
        </tr>
        <tr>
            <td class="signature" width="300">
                <p>
                    With best regards,<br>
                    Connect With Gamers<br>
                    Shawn Andrews<br>
                    </p>
                <p>
                    Support: <a class="strong" href="mailto:connectwithgamers@gmail.com" target="_blank">connectwithgamers@gmail.com</a>
                </p>
            </td>
            <td class="subscription" width="300">
                <div class="logo-image">
                    <a href="https://i.imgur.com/obqCKhX.png" target="_blank"><img src="https://i.imgur.com/obqCKhX.png" alt="logo-alt" width="70" height="70"></a>
                </div>
                <p>
                    <a class="strong block" href="http://www.connectwithgamers.com/account" target="_blank">
                        Account Settings
                    </a>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
</center>`; };