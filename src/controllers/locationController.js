const { getKota } = require("../services/locationServices");

const getKotaController = async (req, res) => {
    const { keyword } = req.query;
    try {
        const result = await getKota(keyword);
        return res.json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

module.exports = { getKotaController };
