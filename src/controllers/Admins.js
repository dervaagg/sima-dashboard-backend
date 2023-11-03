import { UUID, UUIDV4 } from 'sequelize';
import Admins from '../models/AdminModel.js';
import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const getAdmins = async (req, res) => {
    try {
        const response = await Admins.findAll({
            attributes: ['id', 'name', 'id_number', 'phone_number', 'email'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Admin tidak tersedia' });
    }
};

export const getAdminById = async (req, res) => {
    try {
        const response = await Admins.findOne({
            attributes: ['id', 'name', 'id_number', 'phone_number', 'email'],
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'admin tidak ditemukan' });
    }
};

export const createAdmin = async (req, res) => {
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
        await Admins.create({
            id: Admins.UUIDV4,
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

export const updateAdmin = async (req, res) => {
    const admin = await Admins.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan' });
    const { name, id_number, phone_number, email } = req.body;

    try {
        await Admins.update(
            {
                name: name,
                id_number: id_number,
                phone_number: phone_number,
                email: email,
            },
            {
                where: {
                    id: admin.id,
                },
            }
        );
        res.status(201).json({ message: 'Admin berhasil terupdate' });
    } catch (error) {
        res.status(400).json({ message: 'Admin gagal terupdate' });
    }
};

export const deleteAdmin = async (req, res) => {
    const admin = await Admins.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan' });
    try {
        await admin.destroy({
            where: {
                id: admin.id,
            },
        });
        res.status(201).json({ message: 'Admin berhasil terhapus' });
    } catch (error) {
        res.status(400).json({ message: 'Admin gagal terhapus' });
    }
};
