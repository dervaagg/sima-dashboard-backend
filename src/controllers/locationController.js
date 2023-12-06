const getKota = require("../services/locationServices");
const getProvinsi = require("../services/locationServices");

const getKotaController = async (req, res) => {
    console.log('ini kota');

    const { keyword } = req.query;
    try {
        const result = await getKota(keyword);
        return res.json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const getProvinsiController = async (req, res) => {
    console.log('ini provinsi');
    const { keyword } = req.query;
    try {
        const result = await getProvinsi(keyword);
        return res.json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

module.exports = { getKotaController, getProvinsiController };
