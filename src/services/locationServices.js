const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getKota = async (keyword) => {
    console.log(keyword);
    try {
        if (keyword) {

            const kota = await prisma.tb_kabupaten.findMany({
                take: 10,
                where: {
                    namaKab: {
                        mode: "insensitive",
                        contains: keyword,
                    },
                },
            });

            return kota
        } else {
            const kota = await prisma.tb_kabupaten.findMany();
            return kota;
        }


        console.log(kota);
    } catch (err) {
        throw new Error(err);
    }
};

const getProvinsi = async (keyword) => {
    console.log(keyword);
    try {
        const provinsi = await prisma.tb_provinsi.findMany({
            take: 10,
            where: {
                namaProv: {
                    contains: keyword,
                },
            },
        });
        console.log(provinsi);
        return provinsi;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = getKota, getProvinsi;
