const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Kabupaten = sequelize.define("Kabupaten", {
        id: DataTypes.NUMBER,
        id_provinsi: DataTypes.STRING,
        nama: DataTypes.STRING,
    });
    
    return Kabupaten;
};
