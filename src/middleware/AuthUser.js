import Users from '../models/userModel.js';
import Admins from '../models/AdminModel.js';
import jwt from 'jsonwebtoken';

export function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res
      .sendStatus(401)
      .json({ message: 'Token tidak valid. Silahkan login kembali' });
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.user.email,
      },
    });

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    if (user.role !== 'admin')
      return res.status(403).json({ message: 'Anda tidak memiliki akses' });

    next();
  } catch (error) {
    return res.status(500).send({
      message: 'Unable to validate User role!',
    });
  }
};
