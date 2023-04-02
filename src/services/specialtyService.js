const db = require('../models');

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Create new specialty successfully',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getAllSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: 'Get all specialty successfully',
                data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailSpecialty = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                let data = {};
                data = await db.Specialty.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkdown'],
                });
                if (data) {
                    let doctorIds = [];
                    let listProvinces = [];
                    listProvinces = await db.Doctor_Info.findAll({
                        where: {
                            specialtyId: inputId,
                        },
                        attributes: ['provinceId'],
                        include: {
                            model: db.Allcode,
                            as: 'provinceData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        raw: false,
                    });
                    data.listProvinces = listProvinces;

                    if (location === 'ALL') {
                        doctorIds = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId,
                            },
                            attributes: ['doctorId'],
                        });
                        data.doctorIds = doctorIds;
                    } else {
                        doctorIds = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location,
                            },
                            attributes: ['doctorId'],
                        });
                        data.doctorIds = doctorIds;
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Get all specialty successfully',
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = { createSpecialty, getAllSpecialty, getDetailSpecialty };
