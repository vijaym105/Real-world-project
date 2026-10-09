import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        clientId: process.env.GOOGLE_CLIENT_ID,
        refreshToken: process.env.REFRESH_TOKEN_SECRET
    }
})

transporter.verify()
    .then(() => {
        console.log("Ready to send emails");

    })
    .catch((err) => {
        console.log(err);
    })

export const sendEmail = async (to, subject, html) => {

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html
    };

    const res = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + res.response);
}

