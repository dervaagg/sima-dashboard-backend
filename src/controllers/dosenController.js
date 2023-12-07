const fs = require("fs");
const {
    searchMahasiswa,
    getDataAkademikMhs,
    getCountStatusDataAkademikMhs,
} = require("../services/dataMahasiswaServices");
const {
    getDataRegisterDosen,
    validasiDataIrs,
    validasiDataKhs,
    validasiDataPkl,
    validasiDataSkripsi,
    getStatusValidasiIRS,
    getStatusValidasiKHS,
    getStatusValidasiPKL,
    getStatusValidasiSkripsi,
    updateDataDosen,
    updateStatusAktifMhs,
} = require("../services/dosenServices");

const {
    rekapStatusMahasiswa,
    daftarStatusMahasiswa,
    rekapPklMahasiswa,
    daftarPklMahasiswa,
    rekapSkripsiMahasiswa,
    daftarSkripsiMahasiswa,
    cetakDaftarStatusMahasiswa,
    cetakDaftarPklMahasiswa,
    cetakDaftarSkripsiMahasiswa,
} = require("../services/rekapServices");
const path = require("path");

// Register
const getDataRegisterDosenController = async (req, res) => {
    const nip = req.id;
    try {
        const result = await getDataRegisterDosen({ nip });
        return res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const updateDataDosenController = async (req, res) => {
    const { nip, oldUsername, username, email, password, alamat, kodeKab, noHP } =
        req.body;
    const foto = req.file;

    // check null input
    if (
        !nip ||
        !username.trim() ||
        !oldUsername.trim() ||
        !email.trim() ||
        !password.trim() ||
        !alamat.trim() ||
        !kodeKab ||
        !noHP
    ) {
        return res.status(400).json({
            message: "Data tidak boleh kosong",
        });
    }

    // Check nip
    if (nip != req.id) {
        return res.status(403).json({
            message: "NIP berbeda dari data login. Entry tidak dapat dilakukan",
        });
    }

    // regex username hanya boleh huruf kecil, angka, dan underscore
    const regexUsername = /^[a-z0-9_]+$/;
    //check username (check duplicate sudah ada di service)
    if (!regexUsername.test(username)) {
        return res.status(400).json({
            message:
                "Username hanya boleh terdiri dari huruf kecil, angka, dan underscore",
        });
    }

    // regex email harus include students.undip.ac.id atau lecturers.undip.ac.id
    const regexEmail = /lecturer.undip.ac.id$/;
    //check email
    if (!regexEmail.test(email)) {
        return res.status(400).json({
            message: "Email harus menggunakan email Undip",
        });
    }

    // TODO-VALIDATE: check password

    // Check nomor HP (format nomor HP Indonesia)
    const regexNoHP = /^(\+62|62|)8[1-9]{1}[0-9]{8,12}$/;
    if (!regexNoHP.test(noHP)) {
        if (noHP.length < 10 || noHP.length > 13) {
            return res.status(400).json({
                message: "Nomor HP tidak valid, minimal 9 digit dan maksimal 13 digit",
            });
        }
        return res.status(400).json({
            message: "Nomor HP tidak valid. Gunakan format (62)",
        });
    }

    // Check format foto
    if (foto) {
        if (
            path.extname(foto.originalname) !== ".png" &&
            path.extname(foto.originalname) !== ".jpg" &&
            path.extname(foto.originalname) !== ".jpeg"
        ) {
            return res.status(400).json({
                message: "Format foto harus png,jpg,jpeg",
            });
        }
    }

    try {
        const data = {
            nip,
            username,
            oldUsername,
            email,
            password,
            alamat,
            kodeKab,
            noHP,
        };

        if (foto) {
            data.foto = foto;
        }

        const result = await updateDataDosen(data);

        console.log({
            message: "Data berhasil diubah",
            data: result,
        });
        return res.status(200).json({
            message: "Data berhasil diubah",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ message: err.message });
    }
};

// Dashboard
const getDashboardDosenController = async (req, res) => {
    const nip = req.id;
    let { angkatan, dokumen } = req.query;

    // !! Udah ada checking di JWT (?)
    // if (!nip) {
    //   return res.status(400).json({
    //     message: "ID kosong",
    //   });
    // }

    if (!dokumen) dokumen = "ALL";
    if (!["ALL", "IRS", "KHS", "PKL", "SKRIPSI"].includes(dokumen))
        return res.status(400).json({ message: "Dokumen param not valid" });

    try {
        const data = { nip, angkatan, dokumen };
        const result = await getCountStatusDataAkademikMhs(data);

        return res.status(200).json({
            message: "Data dashboard berhasil diretrieve",
            data: result,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

// Get status validasi
const getStatusValidasiController = async (req, res) => {
    const nip = req.id;
    let { page, qty, keyword, sortBy, order } = req.query;
    const path = req.path;

    // Insert default value
    if (!page) page = 1;
    if (!qty) qty = 5;
    if (!sortBy) sortBy = "statusValidasi";
    if (!order) order = "asc";

    // Check params
    if (isNaN(page) || isNaN(qty) || !["asc", "desc"].includes(order))
        return res.status(400).json({ message: "Bad request. Params not valid" });
    page = parseInt(page);
    qty = parseInt(qty);

    // !! Udah ada checking di JWT (?)
    // if (!nip) {
    //   return res.status(400).json({
    //     message: "ID kosong",
    //   });
    // }

    try {
        const data = { nip, page, qty, keyword, sortBy, order };
        let result = null;
        switch (path) {
            case "/dosen/status-validasi/irs":
                result = await getStatusValidasiIRS(data);
                break;
            case "/dosen/status-validasi/khs":
                result = await getStatusValidasiKHS(data);
                break;
            case "/dosen/status-validasi/pkl":
                result = await getStatusValidasiPKL(data);
                break;
            case "/dosen/status-validasi/skripsi":
                result = await getStatusValidasiSkripsi(data);
                break;
        }

        if (!result)
            return res.status(400).json({
                message: "Failed to retrieve list status validasi",
            });

        return res.status(200).json({
            data: result,
            message: "Daftar status validasi berhasil diambil",
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};

// Validasi data
const validasiDataIrsController = async (req, res) => {
    const { nim, semester, status, jumlahSks, fileName } = req.body;
    const nip = req.id;

    // // check null input
    // if (!nim || !semester || !status || !jumlahSks || !fileName) {
    //     return res.status(400).json({
    //         message: "Data tidak boleh kosong",
    //     });
    // }

    // Check status
    const statusIRS = ["Aktif", "Cuti"];
    if (!statusIRS.includes(status)) {
        return res.status(400).json({
            message: "Status IRS tidak valid",
        });
    }

    // Check jumlah sks
    if (jumlahSks < 0 || jumlahSks > 24) {
        return res.status(400).json({
            message: "Jumlah SKS tidak valid",
        });
    }

    try {
        const data = {
            nip,
            nim,
            semester,
            status,
            jumlahSks,
            fileName,
        };

        const result = await validasiDataIrs(data);
        return res.status(200).json({
            message: "validasi data IRS berhasil",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};

const validasiDataKhsController = async (req, res) => {
    const {
        nim,
        semester,
        status,
        jumlahSksSemester,
        ips,
        jumlahSksKumulatif,
        ipk,
        fileName,
    } = req.body;
    const nip = req.id;

    // check null input
    if (
        !nim ||
        !semester ||
        !status.trim() ||
        !jumlahSksSemester ||
        !ips ||
        !jumlahSksKumulatif ||
        !ipk ||
        !fileName.trim()
    ) {
        return res.status(400).json({
            message: "Data tidak boleh kosong",
        });
    }

    // TODO-VALIDATE: Recheck validate semester in KHS (validasi dosen)

    // Check jumlah sks
    if (jumlahSksSemester < 0 || jumlahSksSemester > 24) {
        return res.status(400).json({
            message: "Jumlah SKS tidak valid",
        });
    }

    // Check IPS
    if (parseFloat(ips) < 0 || parseFloat(ips) > 4) {
        return res.status(400).json({
            message: "IPS tidak valid",
        });
    }

    // TODO-VALIDATE: validasi jumlah sks kumulatif

    // Check IPK
    if (parseFloat(ipk) < 0 || parseFloat(ipk) > 4) {
        return res.status(400).json({
            message: "IPK tidak valid",
        });
    }

    try {
        const data = {
            nip,
            nim,
            semester,
            status,
            jumlahSksSemester,
            ips,
            jumlahSksKumulatif,
            ipk,
            fileName,
        };

        const result = await validasiDataKhs(data);
        return res.status(200).json({
            message: "validasi data KHS berhasil ",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};

const validasiDataPklController = async (req, res) => {
    const { nim, semester, nilai, fileName } = req.body;
    const nip = req.id;

    // check null input
    if (!nim || !semester || !nilai || !fileName.trim()) {
        return res.status(400).json({
            message: "Data tidak boleh kosong",
        });
    }

    // TODO-VALIDATE: validasi nilai PKL

    try {
        const data = {
            nip,
            nim,
            semester,
            nilai,
            fileName,
        };

        const result = await validasiDataPkl(data);
        return res.status(200).json({
            message: "validasi data progress PKL berhasil",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};

const validasiDataSkripsiController = async (req, res) => {
    const { nim, semester, nilai, tanggalLulusSidang, lamaStudi, fileName } =
        req.body;

    const nip = req.id;

    // check null input
    if (
        !nim ||
        !semester ||
        !nilai ||
        !tanggalLulusSidang ||
        !lamaStudi ||
        !fileName.trim()
    ) {
        return res.status(400).json({
            message: "Data tidak boleh kosong",
        });
    }
    // TODO-VALIDATE: Check nilai skripsi, lama studi, dan tanggalLulusSidang

    try {
        const data = {
            nip,
            nim,
            semester,
            nilai,
            tanggalLulusSidang,
            lamaStudi,
            fileName,
        };

        const result = await validasiDataSkripsi(data);
        return res.status(200).json({
            message: "validasi data progress Skripsi berhasil",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};

const rekapMahasiswaDosenController = async (req, res) => {
    const nip = req.id;
    const path = req.path;

    try {
        let result;
        if (path === `/dosen/rekap/pkl`) {
            result = await rekapPklMahasiswa({
                nip,
            });
        } else if (path === `/dosen/rekap/skripsi`) {
            result = await rekapSkripsiMahasiswa({
                nip,
            });
        } else if (path === `/dosen/rekap/status`) {
            result = await rekapStatusMahasiswa({
                nip,
            });
        } else {
            return res.status(404).json({
                message: "path tidak ditemukan",
            });
        }
        return res.status(200).json({
            message: "rekap mahasiswa berhasil diambil",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};

const daftarMahasiswaDosenController = async (req, res) => {
    const nip = req.id;
    const path = req.path;
    let { page, qty, sortBy, order } = req.query;

    if (!page) page = 1;
    if (!qty) qty = 5;
    if (!order) order = "asc";

    // Check params
    if (isNaN(page) || isNaN(qty) || !["asc", "desc"].includes(order))
        return res.status(400).json({ message: "Bad request. Params not valid" });
    page = parseInt(page);
    qty = parseInt(qty);

    try {
        const data = { nip, page, qty, sortBy, order };
        let result;
        if (path === `/dosen/daftar-pkl`) {
            result = await daftarPklMahasiswa(data);
        } else if (path === `/dosen/daftar-skripsi`) {
            result = await daftarSkripsiMahasiswa(data);
        } else if (path === `/dosen/daftar-status`) {
            result = await daftarStatusMahasiswa(data);
        } else {
            return res.status(404).json({
                message: "path tidak ditemukan",
            });
        }
        return res.status(200).json({
            message: "rekap status mahasiswa berhasil diambil",
            data: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};

const searchMahasiswaDosenController = async (req, res) => {
    // Check if keyword is nim / nama
    const { keyword } = req.query;
    const nip = req.id;

    if (!nip) {
        return res.status(400).json({
            message: "NIP tidak boleh kosong",
        });
    }

    try {
        const result = await searchMahasiswa({
            nip,
            keyword,
        });

        return res.status(200).json({
            message: "search berhasil",
            data: result,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

const getDataAkademikMhsDosenController = async (req, res) => {
    const { nim } = req.query;
    const nip = req.id;

    if (!nim) {
        return res.status(400).json({ message: "NIM tidak boleh kosong" });
    }

    try {
        const result = await getDataAkademikMhs({
            nim,
            nip,
        });
        if (result.nipDoswal != nip) {
            return res.status(403).json({
                message: "bukan dosen wali, data mahasiswa tidak dapat diambil",
            });
        }

        return res.status(200).json({
            message: "data mahasiswa berhasil diambil",
            data: result,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

const cetakDaftarMhsDosenController = async (req, res) => {
    const nip = req.id;
    const path = req.path;

    try {
        const data = { nip };
        let result;
        if (path === `/dosen/daftar-pkl/cetak`) {
            result = await cetakDaftarPklMahasiswa(data);
        } else if (path === `/dosen/daftar-skripsi/cetak`) {
            result = await cetakDaftarSkripsiMahasiswa(data);
        } else if (path === `/dosen/daftar-status/cetak`) {
            result = await cetakDaftarStatusMahasiswa(data);
        } else {
            return res.status(404).json({
                message: "path tidak ditemukan",
            });
        }

        // TODO: Handling ketika terjadi error ketika download
        return res.download(result, (err) => {
            if (err) {
                console.log(err);
                // res.status(400).json({
                //   message: err.message
                // })
            }
            fs.unlinkSync(result);
            // return res.status(200).json({
            //   message: "File berhasil di download"
            // })
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

const updateStatusAktifMhsController = async (req, res) => {
    const nip = req.id;
    const { nim, statusAktif } = req.body;
    if (!nim || !statusAktif) {
        return res.status(400).json({
            message: "Data tidak boleh kosong",
        });
    }

    if (
        ![
            "Aktif",
            "Cuti",
            "Mangkir",
            "DO",
            "Lulus",
            "UndurDiri",
            "MeninggalDunia",
        ].includes(statusAktif)
    ) {
        return res.status(400).json({
            message: "Value status aktif tidak valid",
        });
    }

    try {
        const data = { nip, nim, statusAktif };
        const result = await updateStatusAktifMhs(data);

        return res.status(200).json({
            data: result,
            message: "Status aktif mahasiswa berhasil diupdate",
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};



module.exports = {
    getDataRegisterDosenController,
    updateDataDosenController,

    getDashboardDosenController,
    getStatusValidasiController,

    validasiDataIrsController,
    validasiDataKhsController,
    validasiDataPklController,
    validasiDataSkripsiController,

    rekapMahasiswaDosenController,
    daftarMahasiswaDosenController,

    searchMahasiswaDosenController,
    getDataAkademikMhsDosenController,

    cetakDaftarMhsDosenController,

    updateStatusAktifMhsController,
};
