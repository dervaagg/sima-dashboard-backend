import { UUID, UUIDV4 } from 'sequelize';
import Departments from '../models/DepartmentModel.js';
import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const getDepartments = async (req, res) => {
    try {
        const response = await Departments.findAll({
            attributes: ['id', 'name', 'id_number', 'phone_number', 'email'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Admin tidak tersedia' });
    }
};

export const getDepartmentById = async (req, res) => {
    try {
        const response = await Departments.findOne({
            attributes: ['id', 'name', 'id_number', 'phone_number', 'email'],
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Departmen tidak ditemukan' });
    }
};

export const createDepartment = async (req, res) => {
    const { name, id_number, phone_number, email, password, confPassword, role, } = req.body;
    if (password !== confPassword)
        return res
            .status(400)
            .json({ message: 'Password dan confirm password tidak cocok' });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            email: email,
            password: hashPassword,
            confPassword: hashPassword,
            role: role,
        })
        await Departments.create({
            id: Departments.UUIDV4,
            name: name,
            id_number: id_number,
            phone_number: phone_number,
            email: email,
        });
        res.status(201).json({ message: 'User berhasil dibuat' });
    } catch (error) {
        res.status(400).json({ message: 'User gagal dibuat' });
    }
};

export const updateDepartment = async (req, res) => {
    const department = await Departments.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!department) return res.status(404).json({ message: 'Department tidak ditemukan' });
    const { name, id_number, phone_number, email } = req.body;

    try {
        await Departments.update(
            {
                name: name,
                id_number: id_number,
                phone_number: phone_number,
                email: email,
            },
            {
                where: {
                    id: Departments.id,
                },
            }
        );
        res.status(201).json({ message: 'Department berhasil terupdate' });
    } catch (error) {
        res.status(400).json({ message: 'Department gagal terupdate' });
    }
};

export const deleteDepartment = async (req, res) => {
    const department = await Departments.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!department) return res.status(404).json({ message: 'Department tidak ditemukan' });
    try {
        await department.destroy({
            where: {
                id: department.id,
            },
        });
        res.status(201).json({ message: 'Department berhasil terhapus' });
    } catch (error) {
        res.status(400).json({ message: 'Department gagal terhapus' });
    }
};