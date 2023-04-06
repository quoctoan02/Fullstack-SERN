import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';
let router = express.Router();

let initWebRouters = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcodes', userController.handleGetAllCodes);
    router.get('/api/top-doctor-home', doctorController.handleGetTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.handleGetAllDoctors);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor', doctorController.getDetailDoctor);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-doctor-info', doctorController.getExtraDoctorInfo);
    router.get('/api/get-profile-doctor', doctorController.getProfileDoctor);
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.verifyBookAppointment);
    router.get('/api/get-list-patient', doctorController.getListPatient);
    router.post('/api/send-prescription', doctorController.sendPrescription);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty', specialtyController.getDetailSpecialty);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic', clinicController.getDetailClinic);

    return app.use('/', router);
};

module.exports = initWebRouters;
