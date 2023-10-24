import User from "../models/userModel.js";

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Anda belum login" });
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    req.userId = user.id;
    req.role = user.role;
    next();
}

export const operatorOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    if (user.role !== "operator") return res.status(403).json({ message: "Anda tidak memiliki akses" });
    next();
}