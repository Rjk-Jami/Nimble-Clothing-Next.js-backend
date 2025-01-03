const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 587, // Use 587 for STARTTLS (non-secure to secure)
  secure: false, // false for 587, true for 465 (SSL port)
  auth: {
    user: process.env.SMTP_USER, // Use environment variable for email
    pass: process.env.SMTP_PASSWORD, // Use environment variable for password
  },
});

const sendMail = async (email, subject, body) => {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_Gmail, // Sender address
        to: email, // Recipient address
        subject: subject,
        html: body, // HTML body
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error sending email");
    }
  };
module.exports = sendMail;
