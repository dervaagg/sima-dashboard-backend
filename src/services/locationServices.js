const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getKota = async (keyword) => {
    console.log(keyword);
    try {
        const kota = await prisma.tb_kabupaten.findMany({
            take: 10,
            where: {
                namaKab: {
                    contains: keyword,
                },
            },
        });
        console.log(kota);
        return kota;
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = { getKota };
