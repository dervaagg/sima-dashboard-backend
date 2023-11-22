const fs = require("fs");
const { searchMahasiswa, getCountStatusDataAkademikMhs, getDataAkademikMhs } = require("../services/dataMahasiswaServices");
const {
    rekapStatusMahasiswa,
    daftarStatusMahasiswa,
    rekapPklMahasiswa,
    daftarPklMahasiswa,
    rekapSkripsiMahasiswa,
    daftarSkripsiMahasiswa,
    cetakDaftarPklMahasiswa,
    cetakDaftarSkripsiMahasiswa,
    cetakDaftarStatusMahasiswa,
} = require("../services/rekapServices");

const getDashboardDepartemenController = async (req, res) => {
    let { angkatan, dokumen } = req.query

    if (!dokumen) dokumen = "ALL"
    if (!["ALL", "IRS", "KHS", "PKL", "SKRIPSI"].includes(dokumen)) return res.status(400).json({ message: "Dokumen param not valid" })

    try {
        const data = { angkatan, dokumen }
        const result = await getCountStatusDataAkademikMhs(data)

        return res.status(200).json({
            message: "Data dashboard berhasil diretrieve",
            data: result
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}

const rekapMahasiswaDepartemenController = async (req, res) => {
    const path = req.path;

    try {
        let result;
        if (path === "/departemen/rekap/pkl") {
            result = await rekapPklMahasiswa();
        } else if (path === "/departemen/rekap/skripsi") {
            result = await rekapSkripsiMahasiswa();
        } else if (path === "/departemen/rekap/status") {
            result = await rekapStatusMahasiswa();
        } else {
            return res.status(404).json({ message: "path tidak ditemukan" });
        }
        return res.status(200).json({
            message: "rekap mahasiswa berhasil diambil",
            data: result,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const daftarMahasiswaDepartemenController = async (req, res) => {
    const path = req.path;
    let { page, qty, sortBy, order } = req.query;

    if (!page) page = 1;
    if (!qty) qty = 5;
    if (!order) order = "asc"

    // Check params
    if (isNaN(page) || isNaN(qty) || !["asc", "desc"].includes(order)) return res.status(400).json({ message: "Bad request. Params not valid" })
    page = parseInt(page);
    qty = parseInt(qty)

    try {
        const data = { page, qty, sortBy, order }
        let result;
        if (path === "/departemen/daftar-pkl") {
            result = await daftarPklMahasiswa(data);
        } else if (path === "/departemen/daftar-skripsi") {
            result = await daftarSkripsiMahasiswa(data);
        } else if (path === "/departemen/daftar-status") {
            result = await daftarStatusMahasiswa(data);
        } else {
            return res.status(404).json({ message: "path tidak ditemukan" });
        }
        return res.status(200).json({
            message: "rekap status mahasiswa berhasil diambil",
            data: result,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const searchMahasiswaDepartemenController = async (req, res) => {
    // Check if keyword is nim / nama
    const { keyword } = req.query;
    let type = "Nama";

    if (!isNaN(keyword)) {
        type = "NIM";
    }

    try {
        const result = await searchMahasiswa({ keyword, type });

        return res.status(200).json({
            message: "search berhasil",
            data: result,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const getDataAkademikMhsDepartemenController = async (req, res) => {
    const {
        nim
    } = req.query

    if (!nim) {
        return res.status(400).json({ message: "NIM tidak boleh kosong" })
    }

    try {
        const result = await getDataAkademikMhs({
            nim
        })

        return res.status(200).json({
            message: "data mahasiswa berhasil diambil",
            data: result
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
};

const cetakDaftarMhsDepartemenController = async (req, res) => {
    const path = req.path;

    try {
        const data = {};
        let result;
        if (path === `/departemen/daftar-pkl/cetak`) {
            result = await cetakDaftarPklMahasiswa(data);
        } else if (path === `/departemen/daftar-skripsi/cetak`) {
            result = await cetakDaftarSkripsiMahasiswa(data);
        } else if (path === `/departemen/daftar-status/cetak`) {
            result = await cetakDaftarStatusMahasiswa(data);
        } else {
            return res.status(404).json({
                message: "path tidak ditemukan",
            });
        }

        return res.status(200).download(result, (err) => {
            if (err) {
                console.log(err)
                // res.status(400).json({
                //   message: err.message
                // })
            }
            fs.unlinkSync(result)
            // return res.status(200).json({
            //   message: "File berhasil di download"
            // })
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
}

module.exports = {
    getDashboardDepartemenController,
    rekapMahasiswaDepartemenController,
    daftarMahasiswaDepartemenController,
    searchMahasiswaDepartemenController,
    getDataAkademikMhsDepartemenController,
    cetakDaftarMhsDepartemenController
};
