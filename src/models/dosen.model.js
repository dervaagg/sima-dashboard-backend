const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Dosen = sequelize.define("Dosen", {
        nip: {
            type: DataTypes.STRING,
            unique: true,
            required: [true, "NIP wajib diisi"],
            maxlength: [18, "NIP maksimal 18 karakter"],
        },
        name: {
            type: DataTypes.STRING,
            required: [true, "Nama wajib diisi"],
            maxlength: [50, "Nama maksimal 50 karakter"],
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            // required: [true, 'Email wajib diisi'],
            maxlength: [50, "Email maksimal 50 karakter"],
        },
        alamat: {
            type: DataTypes.STRING,
            // required: [true, 'Alamat wajib diisi'],
            maxlength: [100, "Alamat maksimal 100 karakter"],
        },
        phone: {
            type: DataTypes.STRING,
            // unique: true,
            // required: [true, 'No telepon wajib diisi'],
            maxlength: [12, "No telepon maksimal 12 karakter"],
        },
        user: {
            references: {
                model: "User",
            },
        },
    });

    return Dosen;
};
