import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import { sendAttachment } from './emailService';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                // order: [['createdAt', 'ASC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Doctor_Info,
                        attributes: ['specialtyId'],
                        include: [{ model: db.Specialty, attributes: ['name'] }],
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'],
                },
            });
            let listProvinces = await db.Doctor_Info.findAll({
                attributes: ['provinceId'],
                include: {
                    model: db.Allcode,
                    as: 'provinceData',
                    attributes: ['valueEn', 'valueVi'],
                },
                raw: false,
            });
            doctors.listProvinces = listProvinces;
            console.log(doctors);
            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                doctorId,
                priceId,
                paymentId,
                provinceId,
                nameClinic,
                addressClinic,
                note,
                contentMarkdown,
                contentHTML,
                description,
                specialtyId,
                clinicId,
            } = inputData;

            if (
                !doctorId ||
                !contentHTML ||
                !contentMarkdown ||
                !priceId ||
                !paymentId ||
                !provinceId ||
                !((nameClinic && addressClinic) || clinicId) ||
                !specialtyId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                //Upsert to markdown
                let [markdown, isCreatedMarkdown] = await db.Markdown.findOrCreate({
                    where: { doctorId },
                    defaults: {
                        contentHTML: contentHTML,
                        contentMarkdown: contentMarkdown,
                        description: description,
                        doctorId: doctorId,
                    },
                    raw: false,
                });
                if (!isCreatedMarkdown) {
                    markdown.contentHTML = contentHTML;
                    markdown.contentMarkdown = contentMarkdown;
                    markdown.description = description;
                    markdown.doctorId = doctorId;
                    await markdown.save();
                }
                // if (markdown) {
                //     markdown.contentHTML = contentHTML;
                //     markdown.contentMarkdown = contentMarkdown;
                //     markdown.description = description;
                //     markdown.doctorId = doctorId;
                //     await markdown.save();
                // } else {
                //     let newMarkdown = await db.Markdown.create({
                //         contentHTML: contentHTML,
                //         contentMarkdown: contentMarkdown,
                //         description: description,
                //         doctorId: doctorId,
                //     });
                // }
                //upsert to doctor info
                let [doctorInfo, isCreatedDoctorInfo] = await db.Doctor_Info.findOrCreate({
                    where: { doctorId },
                    defaults: {
                        doctorId: doctorId,
                        priceId: priceId,
                        provinceId: provinceId,
                        paymentId: paymentId,
                        nameClinic: nameClinic,
                        addressClinic: addressClinic,
                        note: note ? note : '',
                        specialtyId: specialtyId,
                        clinicId: clinicId,
                    },
                    raw: false,
                });
                if (!isCreatedDoctorInfo) {
                    doctorInfo.doctorId = doctorId;
                    doctorInfo.priceId = priceId;
                    doctorInfo.provinceId = provinceId;
                    doctorInfo.paymentId = paymentId;
                    doctorInfo.nameClinic = nameClinic;
                    doctorInfo.addressClinic = addressClinic;
                    doctorInfo.note = note ? note : '';
                    doctorInfo.specialtyId = specialtyId;
                    doctorInfo.clinicId = clinicId;
                    await doctorInfo.save();
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor successfully',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'password', 'doctorId'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Clinic,
                                    attributes: ['name', 'address'],
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: true,
                    nest: true,
                });

                if (data) {
                    if (data.clinicId) {
                        data.nameClinic = data.Clinic.name;
                        data.addressClinic = data.Clinic.address;
                    }

                    if (data.image) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
                    }
                } else if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                let schedules = data.arrSchedule;
                if (schedules && schedules.length > 0) {
                    schedules = schedules.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE || 10;
                        return item;
                    });
                }
                let existingSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.formattedDate,
                    },
                    attributes: ['id', 'timeType', 'maxNumber', 'doctorId', 'date'],
                    raw: true,
                });
                let toCreate = _.differenceWith(schedules, existingSchedule, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
                });
                let toDelete = _.differenceWith(existingSchedule, schedules, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                if (toDelete && toDelete.length > 0) {
                    await db.Schedule.destroy({
                        where: {
                            id: toDelete.map((item) => item.id),
                        },
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId,
                        date,
                    },

                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) data = [];
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getExtraDoctorInfo = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: { doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId'],
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Allcode,
                            as: 'paymentData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'provinceData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getProfileDoctor = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'password', 'doctorId'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'genderData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                } else if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getListPatient = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        date,
                        doctorId,
                    },
                    attributes: ['date', 'id'],
                    include: [
                        {
                            model: db.Patient,
                            attributes: [
                                'email',
                                'fullName',
                                'address',
                                'birthday',
                                'reason',
                                'illnessHistory',
                                'phoneNumber',
                            ],
                            as: 'patientData',
                            include: [
                                {
                                    model: db.Allcode,
                                    attributes: ['valueVi', 'valueEn'],
                                    as: 'genderPatient',
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeBooking',
                            attributes: ['valueVi', 'valueEn'],
                        },
                        {
                            model: db.Allcode,
                            as: 'statusData',
                            attributes: ['valueVi', 'valueEn'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let sendPrescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.imageBase64 || !data.bookingId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        id: data.bookingId,
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                await sendAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctor,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraDoctorInfo,
    getListPatient,
    getProfileDoctor,
    sendPrescription,
};
