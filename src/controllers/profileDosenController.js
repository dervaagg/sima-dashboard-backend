const getProfileDosen = require("../services/profileDosenServices");

const getProfileDosenController = async (req, res) => {
    const nip = req.id
    if (!nip) return res.status(400).json({
        message: "ID kosong"
    })
    try {
        const result = await getProfileDosen({ nip });
        return res.status(200).json({
            message: "Profile dosen berhasil diambil",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ message: err.message });
    }
};

module.exports = getProfileDosenController
