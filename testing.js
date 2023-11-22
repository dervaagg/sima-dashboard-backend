const { getKodeWaliRandom } = require("./src/utils/mahasiswaUtil");

// bcrypt = require('bcrypt')

// async function hashPassword(text) {
//     const result = await bcrypt.hash(text, 10);
//     return result
// }

const generateKodeWali = () => {
    for (let i = 0; i < 100; i++) {
        console.log(getKodeWaliRandom());
    }
};

const jalurMasuk = ["SNMPTN", "SBMPTN", "Mandiri", "Lainnya"];
const generateJalurMasuk = () => {
    for (let i = 0; i < 100; i++) {
        console.log(jalurMasuk[Math.floor(Math.random() * jalurMasuk.length)]);
    }
};

generateKodeWali();
// generateJalurMasuk();
