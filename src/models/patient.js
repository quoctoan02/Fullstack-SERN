'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Patient.belongsTo(models.Allcode, {
                foreignKey: 'gender',
                targetKey: 'keyMap',
                as: 'genderPatient',
            });

            Patient.hasMany(models.Booking, {
                foreignKey: 'patientId',
                as: 'patientData',
            });
        }
    }

    Patient.init(
        {
            email: DataTypes.STRING,
            birthday: DataTypes.STRING,
            illnessHistory: DataTypes.STRING,
            fullName: DataTypes.STRING,
            address: DataTypes.STRING,
            gender: DataTypes.STRING,
            reason: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Patient',
        }
    );
    return Patient;
};
