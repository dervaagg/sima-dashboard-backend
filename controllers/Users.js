import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ['id', 'name', 'email', 'role'],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: 'Password dan confirm password tidak cocok' });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ message: 'User berhasil dibuat' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  const { name, email, role } = req.body;

  try {
    await User.update(
      {
        name: name,
        email: email,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(201).json({ message: 'User berhasil terupdate' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(201).json({ message: 'User berhasil terhapus' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
