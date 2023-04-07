const db = require('../models');

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.avatar ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.address ||
                !data.background ||
                !data.provinceId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    avatar: data.avatar,
                    background: data.background,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    address: data.address,
                    provinceId: data.provinceId,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Create new clinic successfully',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                attributes: ['id', 'name', 'avatar'],
            });
            if (data && data.length > 0) {
                data.map((item) => {
                    item.avatar = Buffer.from(item.avatar, 'base64').toString('binary');
                    return item;
                });
            }

            resolve({
                errCode: 0,
                errMessage: 'Get all clinic successfully',
                data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailClinic = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                let data = {};
                data = await db.Clinic.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: [
                        'name',
                        'descriptionHTML',
                        'descriptionMarkdown',
                        'address',
                        'avatar',
                        'background',
                    ],
                });
                if (data) {
                    data.avatar = Buffer.from(data.avatar, 'base64').toString('binary');
                    data.background = Buffer.from(data.background, 'base64').toString('binary');
                    let doctorIds = await db.Doctor_Info.findAll({
                        where: {
                            clinicId: inputId,
                        },
                        attributes: ['doctorId'],
                    });
                    data.doctorIds = doctorIds;
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Get all clinic successfully',
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinic,
};
