import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) return res.status(400).json({ message: 'Password salah!' });

  const userId = user.id;
  const name = user.name;
  const email = user.email;

  const accessToken = jwt.sign(
    { userId, name, email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10m',
    }
  );

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken,
  });
};

export const me = async (req, res) => {
  const user = await Users.findOne({
    attributes: ['id', 'name', 'email', 'role'],
    where: {
      id: req.user.userId,
    },
  });

  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  res.status(200).json({ user, status: 'success' });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(204);

  const user = await Users.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user) return res.sendStatus(204);

  const userId = user.id;

  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};
