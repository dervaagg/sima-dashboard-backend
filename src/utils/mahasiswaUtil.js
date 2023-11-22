const { dosen } = require("../data/dosen");

const getKodeWaliRandom = () => {
    const length = dosen.length - 5;
    const random = Math.floor(Math.random() * length);
    return dosen[random].nip;
};

module.exports = {
    getKodeWaliRandom,
};
