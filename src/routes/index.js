const express = require("express");
const {
    uploadImage,
    uploadPDF,
    uploadExcel,
    uploadDokumen,
    uploadExcelMhs,
    uploadFotoProfil,
} = require("../middlewares/fileUpload");
const multer = require("multer");

const { loginController } = require("../controllers/loginController");

const {
    getDataDosenController,
    getAkunMahasiswaController,
    addMahasiswaController,
    batchAddMahasiswaController,
    getJumlahAkunMahasiswaController,
    cetakDaftarAkunMahasiswaController,
    getJumlahAkunDosenController,
    getAkunDosenController,
    addDosenController,
    cetakDaftarAkunDosenController,
    updateStatusAkunMhsController,
    updateStatusAkunDosenController,
} = require("../controllers/operatorController");

const {
    getDataRegisterMahasiswaController,
    updateDataMahasiswaController,
    entryDataIrsController,
    entryDataKhsController,
    entryDataPklController,
    entryDataSkripsiController,
    getProfileMahasiswaController,
    getDashboardMahasiswaController,
    getListSkripsiController,
    getListPKLController,
    getListKHSController,
    getListIRSController,
} = require("../controllers/mahasiswaController");

const {
    validasiDataIrsController,
    validasiDataKhsController,
    validasiDataPklController,
    validasiDataSkripsiController,
    rekapMahasiswaDosenController,
    daftarMahasiswaDosenController,
    searchMahasiswaDosenController,
    getDataAkademikMhsDosenController,
    getStatusValidasiController,
    getDashboardDosenController,
    getDataRegisterDosenController,
    updateDataDosenController,
    cetakDaftarMhsDosenController,
    updateStatusAktifMhsController,
} = require("../controllers/dosenController");

const {
    rekapMahasiswaDepartemenController,
    daftarMahasiswaDepartemenController,
    searchMahasiswaDepartemenController,
    getDashboardDepartemenController,
    getDataAkademikMhsDepartemenController,
    cetakDaftarMhsDepartemenController,
} = require("../controllers/departemenController");

const { getKotaController } = require("../controllers/locationController");

const verifyToken = require("../middlewares/verifyToken");
const getProfileDosenController = require("../controllers/profileDosenController");

const router = express.Router();

// Login
router.post("/login", loginController);
router.get("/kota", getKotaController);

router.use(verifyToken);

//=======================================================
// Operator
// Dashboard
router.get("/operator/jumlah-akun-mahasiswa", getJumlahAkunMahasiswaController);
router.get("/operator/jumlah-akun-dosen", getJumlahAkunDosenController);
router.get("/operator/profile", getProfileDosenController);

// List akun
router.get("/operator/akun-mahasiswa", getAkunMahasiswaController);
router.get("/operator/akun-dosen", getAkunDosenController);

// Add akun
router.get("/operator/daftar-dosen", getDataDosenController);
router.post("/operator/add-mahasiswa", addMahasiswaController);
router.post("/operator/add-dosen", addDosenController);
router.post(
    "/operator/batch-add-mahasiswa",
    uploadExcelMhs,
    batchAddMahasiswaController
);

// Cetak list akun
router.get(
    "/operator/akun-mahasiswa/cetak",
    cetakDaftarAkunMahasiswaController
);
router.get("/operator/akun-dosen/cetak", cetakDaftarAkunDosenController);

// Update status akun
router.put("/operator/akun-mahasiswa/status-aktif/:nim", updateStatusAkunMhsController)
router.put("/operator/akun-dosen/status-aktif/:nip", updateStatusAkunDosenController)

//=======================================================
// Mahasiswa Controller
router.get("/mahasiswa/register", getDataRegisterMahasiswaController);
router.post(
    "/mahasiswa/update-data",
    uploadFotoProfil,
    updateDataMahasiswaController
);
router.get("/mahasiswa/get-irs"), getListIRSController;
router.get("/mahasiswa/get-khs"), getListKHSController;
router.get("/mahasiswa/get-pkl"), getListPKLController;
router.get("/mahasiswa/get-skripsi"), getListSkripsiController;

// Dashboard
router.get("/mahasiswa/dashboard", getDashboardMahasiswaController);
router.get("/mahasiswa/profile", getProfileMahasiswaController);

// Entry data
router.post("/mahasiswa/entry-irs", uploadDokumen, entryDataIrsController);
router.post("/mahasiswa/entry-khs", uploadDokumen, entryDataKhsController);
router.post("/mahasiswa/entry-pkl", uploadDokumen, entryDataPklController);
router.post(
    "/mahasiswa/entry-skripsi",
    uploadDokumen,
    entryDataSkripsiController
);


//=======================================================
// Dosen Controller
router.get("/dosen/register", getDataRegisterDosenController);
router.post("/dosen/update-data", uploadFotoProfil, updateDataDosenController);

// Dashboard and profile
// TODO: refactor profile route, controller, and service
router.get("/dosen/dashboard", getDashboardDosenController);
router.get("/dosen/profile", getProfileDosenController);

// Get status validasi
router.get("/dosen/status-validasi/irs", getStatusValidasiController);
router.get("/dosen/status-validasi/khs", getStatusValidasiController);
router.get("/dosen/status-validasi/pkl", getStatusValidasiController);
router.get("/dosen/status-validasi/skripsi", getStatusValidasiController);

// Validate data mahasiswa
router.put("/dosen/validasi/irs", validasiDataIrsController);
router.put("/dosen/validasi/khs", validasiDataKhsController);
router.put("/dosen/validasi/pkl", validasiDataPklController);
router.put("/dosen/validasi/skripsi", validasiDataSkripsiController);

// Rekap
router.get("/dosen/rekap/status", rekapMahasiswaDosenController);
router.get("/dosen/rekap/pkl", rekapMahasiswaDosenController);
router.get("/dosen/rekap/skripsi", rekapMahasiswaDosenController);

router.get("/dosen/daftar-status", daftarMahasiswaDosenController);
router.get("/dosen/daftar-pkl", daftarMahasiswaDosenController);
router.get("/dosen/daftar-skripsi", daftarMahasiswaDosenController);

router.get("/dosen/daftar-status/cetak", cetakDaftarMhsDosenController);
router.get("/dosen/daftar-pkl/cetak", cetakDaftarMhsDosenController);
router.get("/dosen/daftar-skripsi/cetak", cetakDaftarMhsDosenController);

// Search mahasiswa
router.get("/dosen/search-mhs", searchMahasiswaDosenController);
router.get("/dosen/data-akademik-mhs/", getDataAkademikMhsDosenController);

// Update status aktif mahasiswa
router.put("/dosen/status-aktif-mhs/", updateStatusAktifMhsController);


//=======================================================
// Departemen Controller
// Dashboard
router.get("/departemen/dashboard", getDashboardDepartemenController);
router.get("/departemen/profile", getProfileDosenController);

// Rekap
router.get("/departemen/rekap/status", rekapMahasiswaDepartemenController);
router.get("/departemen/rekap/pkl", rekapMahasiswaDepartemenController);
router.get("/departemen/rekap/skripsi", rekapMahasiswaDepartemenController);
router.get("/departemen/daftar-status", daftarMahasiswaDepartemenController);
router.get("/departemen/daftar-pkl", daftarMahasiswaDepartemenController);
router.get("/departemen/daftar-skripsi", daftarMahasiswaDepartemenController);

router.get(
    "/departemen/daftar-status/cetak",
    cetakDaftarMhsDepartemenController
);
router.get("/departemen/daftar-pkl/cetak", cetakDaftarMhsDepartemenController);
router.get(
    "/departemen/daftar-skripsi/cetak",
    cetakDaftarMhsDepartemenController
);

// Search mahasiswa
router.get("/departemen/search-mhs/", searchMahasiswaDepartemenController);
router.get(
    "/departemen/data-akademik-mhs/",
    getDataAkademikMhsDepartemenController
);

module.exports = router;
