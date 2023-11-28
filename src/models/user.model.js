const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      required: [true, "Username wajib diisi"],
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    roles: {
      references: {
        model: "Role",
      },
    },
  });

  return User;
};