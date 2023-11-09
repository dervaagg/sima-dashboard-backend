import { ENUM, Sequelize } from 'sequelize';
import db from '../config/db.js';
import Users from './user.model.js';
import Lecturers from './lecturer.model.js';

const { DataTypes } = Sequelize;
const Students = db.define(
    'students',
    {
        id: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 100],
            },
        },
        id_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 20],
            },
        },
        year: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
        province: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
        status: {
            type: ENUM('active', 'leave', 'dropout', 'absent'),
            allowNull: false,
            defaultValue: 'active',
            validate: {
                notEmpty: true,
            },
        },
        id_lecturer: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            // references: {
            //     model: Lecturers,
            //     key: 'id_number',
            // },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
            references: {
                model: Users,
                key: 'email',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        freezeTableName: true,
    }
);

Users.hasMany(Students);
Students.belongsTo(Users, { foreignKey: 'email' });

// Students.hasOne(Lecturers);
// Lecturers.belongsTo(Students, { foreignKey: 'id_number' });

// Students.sync({
// force: true,
//     alter: true,
// }).then(() => {
//     console.log('🔄 Student Model synced');
// });

export default Students;