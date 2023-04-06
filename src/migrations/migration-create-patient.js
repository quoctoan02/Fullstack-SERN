'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Patients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
            },
            fullName: {
                type: Sequelize.STRING,
            },
            birthday: {
                type: Sequelize.DATEONLY,
            },
            address: {
                type: Sequelize.STRING,
            },
            reason: {
                type: Sequelize.STRING,
            },
            illnessHistory: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.STRING,
            },
            phoneNumber: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('Patients');
    },
};
