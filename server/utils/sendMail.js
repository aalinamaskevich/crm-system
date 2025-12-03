const nodemailer = require('nodemailer');

// Настройка транспорта
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'obrazovanierazvitie@gmail.com',
        pass: 'jcesatddhyuufjca'
    }
});

// Функция для отправки письма
function sendMail(to, subject, text, html = null) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

exports.sendMail = sendMail;