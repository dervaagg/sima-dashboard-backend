const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Provinsi = sequelize.define("Provinsi", {
        id: {
            type: DataTypes.NUMBER
        },
        nama: {
            type: DataTypes.STRING,
        },
    });
    return Provinsi;
};