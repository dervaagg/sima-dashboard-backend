const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("Role", {
        name: {
            type: DataTypes.STRING,
        },
    });

    return Role;
};