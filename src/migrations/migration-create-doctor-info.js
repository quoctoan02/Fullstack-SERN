'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('doctor_info', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            doctorId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            priceId: {
                type: Sequelize.STRING,
            },
            provinceId: {
                type: Sequelize.STRING,
            },
            clinicId: {
                type: Sequelize.INTEGER,
            },
            specialtyId: {
                type: Sequelize.INTEGER,
            },
            paymentId: {
                type: Sequelize.STRING,
            },
            nameClinic: {
                type: Sequelize.STRING,
            },
            addressClinic: {
                type: Sequelize.STRING,
            },
            note: {
                type: Sequelize.STRING,
            },
            count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('doctor_info');
    },
};
