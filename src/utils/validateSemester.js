const { PrismaClient } = require('@prisma/client');
const countSemester = require('./countSemester');

const prisma = new PrismaClient();

const validateSemester = async (nim, semester) => {
    try {

        semester = parseInt(semester)
        if (semester > 0 && semester <= 14) {
            const angkatanMhs = await prisma.tb_mhs.findUnique({
                where: {
                    nim: nim,
                },
                select: {
                    angkatan: true,
                },
            });

            if (!angkatanMhs) throw new Error("Mahasiswa not found")

            return (semester <= countSemester(angkatanMhs.angkatan))
        }
        return false
    } catch (err) {
        throw (err)
    }
}

module.exports = validateSemester