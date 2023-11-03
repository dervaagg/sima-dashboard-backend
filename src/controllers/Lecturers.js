import { UUID, UUIDV4 } from 'sequelize';
import Lecturers from '../models/LecturerModel.js';
import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const getLecturers = async (req, res) => {
    try {
        const response = await Lecturers.findAll({
            attributes: ['id', 'name', 'id_number', 'phone_number', 'email'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Lecturer tidak tersedia' });
    }
};

export const getLecturerById = async (req, res) => {
    try {
        const response = await Lecturers.findOne({
            attributes: ['name', 'id_number', 'phone_number', 'email'],
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Lecturer tidak ditemukan' });
    }
};

export const createLecturer = async (req, res) => {
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
        await Lecturers.create({
            id: Lecturers.UUIDV4,
            name: name,
            id_number: id_number,
            phone_number: phone_number,
            email: email,
        });
        res.status(201).json({ message: 'Lecturer berhasil dibuat' });
    } catch (error) {
        res.status(400).json({ message: 'Lecturer gagal dibuat' });
    }
};

export const updateLecturer = async (req, res) => {
    const lecturer = await Lecturers.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!lecturer) return res.status(404).json({ message: 'Lecturer tidak ditemukan' });
    const { name, id_number, phone_number, email } = req.body;

    try {
        await Lecturers.update(
            {
                name: name,
                id_number: id_number,
                phone_number: phone_number,
                email: email,
            },
            {
                where: {
                    id: Lecturers.id,
                },
            }
        );
        res.status(201).json({ message: 'Lecturer berhasil terupdate' });
    } catch (error) {
        res.status(400).json({ message: 'Lecturer gagal terupdate' });
    }
};

export const deleteLecturer = async (req, res) => {
    const lecturer = await Lecturers.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!lecturer) return res.status(404).json({ message: 'Lecturer tidak ditemukan' });
    try {
        await lecturer.destroy({
            where: {
                id: lecturer.id,
            },
        });
        res.status(201).json({ message: 'Lecturer berhasil terhapus' });
    } catch (error) {
        res.status(400).json({ message: 'Lecturer gagal terhapus' });
    }
};