const { PrismaClient } = require("@prisma/client");
const countSemester = require("../utils/countSemester");
const prisma = new PrismaClient();

const searchMahasiswa = async (data) => {
    try {
        // Can't use prisma query because wildcards (%) are not supported
        // https://github.com/prisma/prisma/discussions/3159
        let result;
        const filterWali = data.nip
            ? {
                kodeWali: data.nip,
            }
            : {};
        // Default: get semua data siswa
        if (!data.keyword) {
            result = await prisma.tb_mhs.findMany({
                where: {
                    ...filterWali,
                },
                select: {
                    nama: true,
                    nim: true,
                    foto: true,
                },
            });
        } else {
            result = await prisma.tb_mhs.findMany({
                where: {
                    OR: [
                        {
                            nama: {
                                contains: data.keyword,
                            },
                        },
                        {
                            nim: {
                                contains: data.keyword,
                            },
                        },
                    ],
                    ...filterWali,
                },
                select: {
                    nama: true,
                    nim: true,
                    foto: true,
                },
            });
        }

        return result;
    } catch (err) {
        throw err;
    }
};

// TODO: Refactor get data algorithm
const getDataAkademikMhs = async (data) => {
    try {
        const dataMhs = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim,
            },
            select: {
                nama: true,
                nim: true,
                angkatan: true,
                jalurMasuk: true,
                foto: true,
                statusAktif: true,
                alamat: true,
                email: true,
                noHP: true,
                fk_kodeWali: {
                    select: {
                        nip: true,
                        nama: true,
                        foto: true,
                    },
                },
            },
        });

        if (!dataMhs) throw new Error("Mahasiswa tidak ditemukan");
        // console.log(data.nip, dataMhs)
        if (data.nip) {
            if (dataMhs.fk_kodeWali.nip != data.nip)
                throw new Error("Bukan dosen wali, data mahasiswa tidak dapat diakses");
        }

        const currentSmt = countSemester(dataMhs.angkatan);

        // ============== IRS ==============
        let irs = await prisma.tb_irs.findMany({
            where: {
                nim: data.nim,
            },
            orderBy: {
                semester: "asc",
            },
        });

        // Get available semester
        let availableSmt = [];
        irs = irs.reduce((r, doc) => {
            if (parseInt(doc.semester) > 0 && parseInt(doc.semester) <= currentSmt) {
                availableSmt.push(doc.semester);
                r.push({ type: "irs", available: true, ...doc });
            }
            return r;
        }, []);

        // Insert empty irs
        for (let i = 1; i <= currentSmt; i++) {
            if (!availableSmt.find((e) => e === i.toString())) {
                irs.push({ type: "irs", available: false, semester: i.toString() });
            }
        }

        // ============== KHS ==============
        let khs = await prisma.tb_khs.findMany({
            where: {
                nim: data.nim,
            },
            orderBy: {
                semester: "asc",
            },
        });

        // Get all available semester
        availableSmt = [];
        khs = khs.reduce((r, doc) => {
            if (parseInt(doc.semester) > 0 && parseInt(doc.semester) <= currentSmt) {
                availableSmt.push(doc.semester);
                r.push({ type: "khs", available: true, ...doc });
            }
            return r;
        }, []);

        // Insert empty khs
        for (let i = 1; i <= currentSmt; i++) {
            // console.log(parseInt(khs[i].semester)-offset, i+1)
            if (!availableSmt.find((e) => e === i.toString())) {
                khs.push({ type: "khs", available: false, semester: i.toString() });
            }
        }

        // ============== PKL ==============
        let pkl = await prisma.tb_pkl.findMany({
            where: {
                nim: data.nim,
            },
            orderBy: {
                semester: "asc",
            },
        });

        // Reshape PKL data
        pkl = pkl.reduce((r, doc) => {
            if (parseInt(doc.semester) > 0 && parseInt(doc.semester) <= currentSmt) {
                r.push({
                    type: "pkl",
                    available: true,
                    ...doc,
                });
            }
            return r;
        }, []);

        // ============== SKRIPSI ==============
        let skripsi = await prisma.tb_skripsi.findMany({
            where: {
                nim: data.nim,
            },
            orderBy: {
                semester: "asc",
            },
        });

        // Reshape Skripsi data
        skripsi = skripsi.reduce((r, doc) => {
            if (parseInt(doc.semester) > 0 && parseInt(doc.semester) <= currentSmt) {
                r.push({
                    type: "skripsi",
                    available: true,
                    ...doc,
                });
            }
            return r;
        }, []);

        // Append all queried data into one array
        let combinedData = irs.concat(khs, pkl, skripsi);

        // Groups the data by semesters
        let groupBySmt = combinedData.reduce((r, a) => {
            delete a.nim;
            r[a.semester] = r[a.semester] || [];
            r[a.semester].push(a);
            return r;
        }, {});

        return {
            nama: dataMhs.nama,
            nim: dataMhs.nim,
            angkatan: dataMhs.angkatan,
            statusAktif: dataMhs.statusAktif,
            jalurMasuk: dataMhs.jalurMasuk,
            semester: currentSmt,
            foto: dataMhs.foto,
            alamat: dataMhs.alamat,
            email: dataMhs.email,
            noHP: dataMhs.noHP,
            namaDoswal: dataMhs.fk_kodeWali.nama,
            nipDoswal: dataMhs.fk_kodeWali.nip,
            fotoDoswal: dataMhs.fk_kodeWali.foto,
            dataAkademik: groupBySmt,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// TODO: Refactor get count status
// Count status, for dashboard
const getCountStatusDataAkademikMhs = async (data) => {
    try {
        // TODO: Get status by angkatan
        const filterWali = data.nip ? { kodeWali: data.nip } : {};
        const filterAngkatan = data.angkatan
            ? { angkatan: parseInt(data.angkatan) }
            : {};

        // Count mahasiswa and amount of irs and khs entry required
        let countMhs = 0,
            countRequiredData;
        if (data.angkatan) {
            countMhs = await prisma.tb_mhs.count({
                where: {
                    ...filterWali,
                    ...filterAngkatan,
                },
            });
            countRequiredData = countMhs * countSemester(data.angkatan);
        } else {
            const allMhs = await prisma.tb_mhs.groupBy({
                by: ["angkatan"],
                where: {
                    ...filterWali,
                },
                _count: {
                    nim: true,
                },
            });
            // Amount of required data calculated from semester mhs
            countRequiredData = allMhs.reduce((count, mhs) => {
                const { _count, angkatan } = mhs;

                countMhs += _count.nim;
                return count + _count.nim * countSemester(angkatan);
            }, 0);
        }

        let result = {};

        // ============== IRS ==============
        if (data.dokumen === "IRS" || data.dokumen === "ALL") {
            const irs = await prisma.tb_irs.groupBy({
                by: ["statusValidasi"],
                where: {
                    fk_nim: { ...filterWali, ...filterAngkatan },
                },
                _count: {
                    nim: true,
                },
            });

            // Count validated and not validated
            let countIRS = 0;
            result.irs = irs.reduce((res, obj) => {
                const { _count, statusValidasi } = obj;
                res[statusValidasi ? "validated" : "notValidated"] = _count.nim;
                countIRS += _count.nim;
                return res;
            }, {});

            // No entry calculated from how many required data - how many IRS available
            if (!result.irs.validated) result.irs.validate = 0;
            if (!result.irs.notValidated) result.irs.notValidated = 0;
            result.irs.noEntry = countRequiredData - countIRS;

            if (data.dokumen === "IRS") return result;
        }

        // ============== KHS ==============
        if (data.dokumen === "KHS" || data.dokumen === "ALL") {
            const khs = await prisma.tb_khs.groupBy({
                by: ["statusValidasi"],
                where: {
                    fk_nim: { ...filterWali, ...filterAngkatan },
                },
                _count: {
                    nim: true,
                },
            });

            // Count validated and not validated
            let countKHS = 0;
            result.khs = khs.reduce((res, obj) => {
                const { _count, statusValidasi } = obj;
                res[statusValidasi ? "validated" : "notValidated"] = _count.nim;
                countKHS += _count.nim;
                return res;
            }, {});

            // No entry calculated from how many required data - how many KHS available
            if (!result.khs.validated) result.khs.validated = 0;
            if (!result.khs.notValidated) result.khs.notValidated = 0;
            result.khs.noEntry = countRequiredData - countKHS;

            if (data.dokumen === "KHS") return result;
        }

        // ============== PKL ==============
        if (data.dokumen === "PKL" || data.dokumen === "ALL") {
            const pkl = await prisma.tb_pkl.groupBy({
                by: ["statusValidasi"],
                where: {
                    fk_nim: { ...filterWali, ...filterAngkatan },
                },
                _count: {
                    nim: true,
                },
            });

            // Only count not validated one
            let countPKL = 0;
            result.pkl = pkl.reduce((res, obj) => {
                const { _count, statusValidasi } = obj;
                if (!statusValidasi) {
                    res["notValidated"] = _count.nim;
                }
                countPKL += _count.nim;
                return res;
            }, {});

            // Lulus --> PKL mhs that has been validated
            // Tidak lulus --> PKL mhs that hasn't been validated + no entry
            if (!result.pkl.notValidated) result.pkl.notValidated = 0;
            result.pkl.lulus = countPKL - result.pkl.notValidated;
            result.pkl.blmLulus = countMhs - result.pkl.lulus;

            if (data.dokumen === "PKL") return result;
        }

        // ============== SKRIPSI ==============
        if (data.dokumen === "SKRIPSI" || data.dokumen === "ALL") {
            const skripsi = await prisma.tb_skripsi.groupBy({
                by: ["statusValidasi"],
                where: {
                    fk_nim: { ...filterWali, ...filterAngkatan },
                },
                _count: {
                    nim: true,
                },
            });

            // Only count not validated one
            let countSkripsi = 0;
            result.skripsi = skripsi.reduce((res, obj) => {
                const { _count, statusValidasi } = obj;
                if (!statusValidasi) {
                    res["notValidated"] = _count.nim;
                }
                countSkripsi += _count.nim;
                return res;
            }, {});

            // Lulus --> Skripsi mhs that has been validated
            // Tidak lulus --> Skripsi mhs that hasn't been validated + no entry
            if (!result.skripsi.notValidated) result.skripsi.notValidated = 0;
            result.skripsi.lulus = countSkripsi - result.skripsi.notValidated;
            result.skripsi.blmLulus = countMhs - result.skripsi.lulus;

            if (data.dokumen === "SKRIPSI") return result;
        }
        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    searchMahasiswa,
    getDataAkademikMhs,
    getCountStatusDataAkademikMhs,
};
