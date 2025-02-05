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

const sendMail = async (email, subject, resetLink) => {
  const body = ` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Password Reset Request</title> </head> <body> <div style="background-color: #f3f3f3; padding: 20px;"> <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> <h2 style="background-color: #6a1b9a; color: #ffffff; padding: 10px; border-radius: 8px 8px 0 0; margin: 0;">Password Reset Request</h2> <div style="padding: 20px;"> <p>Hi ${email},</p> <p>Someone has requested a new password for the following account on Volcano BD:</p> <p><strong>Username:</strong> ${email}</p> <p>If you didn't make this request, just ignore this email. If you'd like to proceed:</p> <p><a href="${resetLink}" style="color: #6a1b9a; text-decoration: none;">Click here to reset your password</a></p> <p>Thanks for reading.</p> </div> </div> <p style="text-align: center; color: #888888; font-size: 12px;">Nimble ware — Built with <a href="http://localhost:3000/" style="color: #6a1b9a; text-decoration: none;">WooCommerce</a></p> </div> </body> </html> `;
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
