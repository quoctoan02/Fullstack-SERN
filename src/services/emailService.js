require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking Health" <boykk37@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject:
            dataSend.language === 'vi'
                ? 'Thông tin đặt lịch khám bệnh'
                : 'Information of booking medical appointment', // Subject line
        html: getBodyHTMLEmail(dataSend), // body HTML message,
    });
};

let getBodyHTMLEmail = (dataSend) => {
    if (dataSend.language === 'en') {
        return `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical apointment on the Booking Health<p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div
        <p>If the above information is true.; Please click on the link below to complete the procedure to schedule a medical examination.<p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Sincerely thank!</div>
        
        `;
    }
    if (dataSend.language === 'vi') {
        return `
        <h3>Xin chào ${dataSend.patientName}</h3>   
        <p>Bạn đã nhận được email này vì bạn đã đặt lịch khám bệnh trên Booking Health<p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div
        <p>Nếu thông tin trên là đúng. Vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh. <p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Nhấn vào đây</a>
        </div>
        <div>Xin chân thành cảm ơn</div>
        `;
    }
    return '';
};

let getBodyHTMLPrescriptionEmail = (dataSend) => {
    if (dataSend.language === 'en') {
        return `
        <h3>Dear ${dataSend.patientName}}</h3>
        <p>You received this email because you have successfully checked during ${dataSend.timeBooking}through BookingHealth<p>
        <p>Prescription information and invoices are sent in the attached file.<p>
        <div>Sincerely thank!</div>
        
        `;
    }
    if (dataSend.language === 'vi') {
        return `
        <h3>Xin chào ${dataSend.patientName}</h3>   
        <p>Bạn đã nhận được email này vì bạn đã khám bệnh thành công trong khoảng ${dataSend.timeBooking} qua BookingHealth .<p>
        <p>Thông tin đơn thuốc và hoá đơn được gửi trong file đính kèm.<p>
        <div>Xin chân thành cảm ơn</div>
        `;
    }
    return '';
};

let sendAttachment = (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Booking Health" <boykk37@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject:
                    dataSend.language === 'vi'
                        ? 'Thông tin đặt lịch khám bệnh'
                        : 'Information of booking medical appointment', // Subject line
                html: getBodyHTMLPrescriptionEmail(dataSend), // body HTML message,
                attachments: [
                    {
                        filename: `prescription-${dataSend.bookingId}.png`,
                        content: dataSend.imageBase64.split('base64,')[1],
                        encoding: 'base64',
                    },
                ], // attachments
            });
            resolve({
                errCode: 0,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { sendSimpleEmail, sendAttachment };
