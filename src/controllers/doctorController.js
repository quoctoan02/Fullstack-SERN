import doctorService from '../services/doctorService';

let handleGetTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let message = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

let handleGetAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(200).json(message);
    }
};

let postInfoDoctor = async (req, res) => {
    try {
        let message = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error from server',
        });
    }
};

let getDetailDoctor = async (req, res) => {
    try {
        let message = await doctorService.getDetailDoctor(req.query.id);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error from server',
        });
    }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        let message = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error from server',
        });
    }
};

let getScheduleByDate = async (req, res) => {
    try {
        let message = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error from server',
        });
    }
};

let getExtraDoctorInfo = async (req, res) => {
    try {
        let message = await doctorService.getExtraDoctorInfo(req.query.doctorId);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error from server',
        });
    }
};

let getProfileDoctor = async (req, res) => {
    try {
        let message = await doctorService.getProfileDoctor(req.query.doctorId);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error from server',
        });
    }
};

module.exports = {
    handleGetTopDoctorHome,
    handleGetAllDoctors,
    postInfoDoctor,
    getDetailDoctor,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraDoctorInfo,
    getProfileDoctor,
};
