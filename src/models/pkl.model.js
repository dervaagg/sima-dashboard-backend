const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const PKL = sequelize.define("PKL", {
        nilai: {
            type: DataTypes.STRING,
            maxlength: [1, "Nilai maksimal 1 karakter"],
        },
        semester: {
            type: DataTypes.NUMBER,
            maxlength: [2, "Semester maksimal 1 karakter"],
        },
        status_konfirmasi: {
            type: DataTypes.STRING,
            maxlength: [20, "Status konfirmasi  maksimal 20 karakter"],
        },
        file: {
            type: DataTypes.STRING,
            // maxlength: [100, 'Alamat maksimal 100 karakter'],
        },
        mahasiswa: {
            references: {
                model: "Mahasiswa",
            },
        },
    });

    return PKL;
};