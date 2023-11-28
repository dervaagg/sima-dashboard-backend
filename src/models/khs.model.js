const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const KHS = sequelize.define("KHS", {
        semester_aktif: {
            type: DataTypes.NUMBER,
            required: [true, "Semester aktif wajib diisi"],
            maxlength: [1, "Semester aktif maksimal 1 karakter"],
        },
        sks: {
            type: DataTypes.NUMBER,
            required: [true, "SKS harus diisi"],
            maxlength: [2, "SKS maksimal 2 karakter"],
        },
        sks_kumulatif: {
            type: DataTypes.NUMBER,
            required: [true, "SKS kumulatif wajib diisi"],
            maxlength: [3, "SKS kumulatif maksimal 3 karakter"],
        },
        ip: {
            type: DataTypes.NUMBER,
            required: [true, "IP harus diisi"],
            maxlength: [3, "IP maksimal 3 karakter"],
        },
        ip_kumulatif: {
            type: DataTypes.NUMBER,
            required: [true, "IP kumulatif harus diisi"],
            maxlength: [3, "IP kumulatif maksimal 3 karakter"],
        },
        status_konfirmasi: {
            type: DataTypes.STRING,
            // required: [true, "Status konfirmasi harus diisi"],
            maxlength: [20, "Status konfirmasi maksimal 20 karakter"],
        },
        file: {
            type: DataTypes.STRING,
            // required: [true, "KHS harus diupload"],
        },
        mahasiswa: {
            references: {
                model: "Mahasiswa",
            },
        },
    });

    return KHS;
};