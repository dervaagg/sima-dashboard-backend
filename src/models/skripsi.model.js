const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Skripsi = sequelize.define("Skripsi", {
        nilai: {
            type: DataTypes.STRING,
            required: [true, "nilai wajib di isi"],
            maxlength: [1, "max length 1"],
        },
        tanggal: {
            type: DataTypes.DATE,
            required: [true, "tanggal harus di isi"],
        },
        semester: {
            type: DataTypes.NUMBER,
            required: [true, "lama studi harus di isi"],
        },
        status_konfirmasi: {
            type: DataTypes.STRING,
            required: [true, "status konfirmasi harus di isi"],
        },
        file: {
            // belum tipe data varbinary sementara string
            type:  DataTypes.STRING,
            // required: [true, "upload skripsi harus di isi"],
        },
        mahasiswa: {
            references: {
                model: "Mahasiswa",
            },
        },
    });

    return Skripsi;
};
