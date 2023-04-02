import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import { sendSimpleEmail } from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let verifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1',
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({ errCode: 0, errMessage: 'Confirm appointment successfully' });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been confirmed or does not exist',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                let token = uuidv4();

                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    },
                });
                //create booking record
                if (user && user[0]) {
                    let [booking, bookingCreated] = await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            phoneNumber: data.phoneNumber,
                        },
                        defaults: {
                            phoneNumber: data.phoneNumber,
                            doctorId: data.doctorId,
                            statusId: 'S1',
                            date: data.date,
                            timeType: data.timeType,
                            patientId: user[0].id,
                            token: token,
                        },
                    });
                    if (bookingCreated) {
                        await sendSimpleEmail({
                            receiverEmail: data.email,
                            patientName: data.fullName,
                            time: data.time,
                            language: data.language,
                            doctorName: data.doctorName,
                            redirectLink: buildUrlEmail(data.doctorId, token),
                        });
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Already exist booking appointment',
                        });
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Booking appointment success',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { postBookAppointment, verifyBookAppointment };
