const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const IRS = sequelize.define("IRS", {
        semester_aktif: {
            type: DataTypes.NUMBER,
            required: [true, "Semester aktif wajib diisi"],
            maxlength: [2, "Semester aktif maksimal 2 karakter"],
        },
        sks: {
            type: DataTypes.NUMBER,
            required: [true, "SKS wajib diisi"],
            maxlength: [2, "SKS maksimal 2 karakter"],
        },
        file: {
            type: DataTypes.STRING,
            required: [true, "Upload wajib diisi"],
        },
        status_konfirmasi: {
            type: DataTypes.STRING,
            enum: ["belum", "sudah"],
            default: "belum",
        },
        mahasiswa: {
            references: {
                model: "Mahasiswa",
            },
        },
    });

    return IRS;
};