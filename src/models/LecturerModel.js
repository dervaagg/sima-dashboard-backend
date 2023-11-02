import { ENUM, Sequelize } from 'sequelize';
import db from '../config/db.js';
import Students from './StudentModel.js';
import Users from './userModel.js';

const { DataTypes } = Sequelize;
const Lecturers = db.define(
    'lecturers',
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
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
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

Users.hasMany(Lecturers);
Lecturers.belongsTo(Users);

// Students.hasOne(Lecturers);
// Lecturers.belongsTo(Students, { foreignKey: 'id_number' });

// Lecturers.sync().then(() => {
//     console.log('🔄 Lecturer Model synced');
// });

export default Lecturers;