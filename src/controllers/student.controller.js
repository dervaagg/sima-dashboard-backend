import { UUID, UUIDV4 } from 'sequelize';
import Students from '../models/student.model.js';
import Users from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const getStudents = async (req, res) => {
    try {
        const response = await Students.findAll({
            attributes: ['id', 'name', 'id_number', 'year', 'address', 'city', 'province', 'status', 'id_lecturer', 'phone_number', 'email'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Student tidak tersedia' });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const response = await Students.findOne({
            attributes: ['name', 'id_number', 'year', 'address', 'city', 'province', 'status', 'id_lecturer', 'phone_number', 'email'],
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Student tidak ditemukan' });
    }
};

export const createStudent = async (req, res) => {
    const { name, id_number, year, address, city, province, phone_number, status, id_lecturer, email, password, confPassword, role, } = req.body;
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
        await Students.create({
            id: Students.UUIDV4,
            name: name,
            id_number: id_number,
            year: year,
            address: address,
            city: city,
            province: province,
            phone_number: phone_number,
            status: status,
            id_lecturer: id_lecturer,
            email: email,
        });
        res.status(201).json({ message: 'Student berhasil dibuat' });
    } catch (error) {
        res.status(400).json({ message: 'Student gagal dibuat' });
    }
};

export const updateStudent = async (req, res) => {
    const student = await Students.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!student) return res.status(404).json({ message: 'Student tidak ditemukan' });
    const { name, id_number, year, address, city, province, phone_number, status, id_lecturer, email } = req.body;

    try {
        await Students.update(
            {
                name: name,
                id_number: id_number,
                year: year,
                address: address,
                city: city,
                province: province,
                phone_number: phone_number,
                status: status,
                id_lecturer: id_lecturer,
                email: email,
            },
            {
                where: {
                    id: Students.id,
                },
            }
        );
        res.status(201).json({ message: 'Student berhasil terupdate' });
    } catch (error) {
        res.status(400).json({ message: 'Student gagal terupdate' });
    }
};

export const deleteStudent = async (req, res) => {
    const student = await Students.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!student) return res.status(404).json({ message: 'Student tidak ditemukan' });
    try {
        await student.destroy({
            where: {
                id: student.id,
            },
        });
        res.status(201).json({ message: 'student berhasil terhapus' });
    } catch (error) {
        res.status(400).json({ message: 'Student gagal terhapus' });
    }
};