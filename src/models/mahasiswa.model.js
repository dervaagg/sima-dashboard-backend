const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Mahasiswa = sequelize.define("Mahasiswa", {
        nim: {
            type: DataTypes.STRING,
            unique: true,
            required: [true, "NIM wajib diisi"],
            maxlength: [14, "NIM maksimal 14 karakter"],
        },
        name: {
            type: DataTypes.STRING,
            required: [true, "Nama wajib diisi"],
            maxlength: [50, "Nama maksimal 50 karakter"],
        },
        angkatan: {
            type: DataTypes.STRING,
            required: [true, "Angkatan wajib diisi"],
            maxlength: [4, "Angkatan maksimal 4 karakter"],
        },
        email: {
            type: DataTypes.STRING,
            // unique: true,
            maxlength: [50, "Email maksimal 50 karakter"],
        },
        alamat: {
            type: DataTypes.STRING,
            maxlength: [100, "Alamat maksimal 100 karakter"],
        },
        phone: {
            type: DataTypes.STRING,
            // unique: true,
            maxlength: [12, "No telepon maksimal 12 karakter"],
        },
        kodeWali: {
            references: {
                model: "Dosen",
            },
        },
        kodeKab: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM,
            enum: [
                "Aktif",
                "Cuti",
                "Mangkir",
                "Drop Out",
                "Undur Diri",
                "Lulus",
                "Meninggal Dunia",
            ],
            default: "Aktif",
        },
        jalurMasuk: {
            type: DataTypes.STRING,
            enum: ["SNMPTN", "SBMPTN", "Mandiri"],
        },
        user: {
            references: {
                model: "User",
            },
        },
    });

    return Mahasiswa;
};