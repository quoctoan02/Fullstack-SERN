'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Clinic.hasMany(models.Doctor_Info, {
                foreignKey: 'clinicId',
            });
        }
    }
    Clinic.init(
        {
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            descriptionHTML: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
            avatar: DataTypes.STRING,
            background: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Clinic',
        }
    );
    return Clinic;
};
