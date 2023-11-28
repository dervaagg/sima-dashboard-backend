const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("Status", {
        name: {
            type: DataTypes.STRING,
        },
    });

    return Status;
};