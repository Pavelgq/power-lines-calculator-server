const nodemailer = require("nodemailer");

// let testEmailAccount = await nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_NAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = { transporter };
