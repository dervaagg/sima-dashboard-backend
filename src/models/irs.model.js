// import { ENUM, Sequelize } from 'sequelize';
import Users from './user.model.js';
import db from '../config/db.js';
import Students from './student.model.js';

const { DataTypes } = Sequelize;
const Irss = db.define(
    'irss',
    {
        semester: {
            type: DataTypes.NUMBER,
            allowNull: false,
            required: true,
            maxlength: 2,
            validate: {
                notEmpty: true,
            },
        },
        sks: {
            type: DataTypes.NUMBER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
        },
        file: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
            validate: {
                notEmpty: true,
            },
        },
        validate: {
            type: ENUM('accept', 'reject'),
            allowNull: false,
            defaultValue: 'reject',
            validate: {
                notEmpty: true,
            },
        },
        student: {
            references: {
                model: 'students',
                key: 'id',
            },
        },
    },
    {
        freezeTableName: true,
    }
);

Students.hasMany(IRS);
Departments.belongsTo(Users, { foreignKey: 'email' });

// Irss.sync({
// force: true,
//     alter: true,
// }).then(() => {
//   console.log('🔄 ISR Model synced');
// });

export default IRS;