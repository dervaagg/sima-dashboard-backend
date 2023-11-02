import { ENUM, Sequelize } from 'sequelize';
import db from '../config/db.js';

const { DataTypes } = Sequelize;
const Users = db.define(
  'users',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: ENUM('lecturer', 'admin', 'student', 'department'),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

// Users.sync().then(() => {
//   console.log('🔄 User Model synced');
// });

export default Users;