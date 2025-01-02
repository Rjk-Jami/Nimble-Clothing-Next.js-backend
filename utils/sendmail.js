const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'roselyn.hayes94@ethereal.email',
        pass: 'WQbc5UgRmjbjWxwb8K'
    }
});

const sendMail = async (email, subject, body) => {
    try {
        transporter.sendMail({
            from : "nimbleWare",
            to: email,
            subject: subject,
            html: body
        })
    } catch (error) {
        
        console.error(error);
        throw error("Error sending email" , 500);
    }
}
module.exports = sendMail;
