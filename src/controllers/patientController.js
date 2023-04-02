import patientService from '../services/patientService';

let postBookAppointment = async (req, res) => {
    try {
        let message = await patientService.postBookAppointment(req.body);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error from server',
        });
    }
};

let verifyBookAppointment = async (req, res) => {
    try {
        let message = await patientService.verifyBookAppointment(req.body);
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
    postBookAppointment,
    verifyBookAppointment,
};
