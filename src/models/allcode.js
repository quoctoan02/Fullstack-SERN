'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' });
            Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' });
            Allcode.hasMany(models.Patient, { foreignKey: 'gender', as: 'genderPatient' });
            Allcode.hasMany(models.Booking, { foreignKey: 'statusId', as: 'statusData' });
            Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' });
            Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeTypeBooking' });
            Allcode.hasMany(models.Doctor_Info, { foreignKey: 'priceId', as: 'priceData' });
            Allcode.hasMany(models.Doctor_Info, { foreignKey: 'paymentId', as: 'paymentData' });
            Allcode.hasMany(models.Doctor_Info, { foreignKey: 'provinceId', as: 'provinceData' });
        }
    }
    Allcode.init(
        {
            keyMap: DataTypes.STRING,
            type: DataTypes.STRING,
            valueVi: DataTypes.STRING,
            valueEn: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Allcode',
        }
    );
    return Allcode;
};
