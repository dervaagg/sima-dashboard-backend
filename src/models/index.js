const config = require('../config/db.config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        port: config.port,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
)

const db = {};

db.Sequelize = Sequelize
db.sequelize = sequelize

db.dosen = require('./dosen.model')(sequelize, Sequelize)
db.irs = require('./irs.model')(sequelize, Sequelize)
db.kabupaten = require('./kabupaten.model')(sequelize, Sequelize)
db.khs = require('./khs.model')(sequelize, Sequelize)
db.mahasiswa = require('./mahasiswa.model')(sequelize, Sequelize)
db.pkl = require('./pkl.model')(sequelize, Sequelize)
db.provinsi = require('./provinsi.model')(sequelize, Sequelize)
db.role = require('./role.model')(sequelize, Sequelize)
db.skripsi = require('./skripsi.model')(sequelize, Sequelize)
db.user = require('./user.model')(sequelize, Sequelize)
db.status = require('./status.model')(sequelize, Sequelize)

db.ROLES = ["admin", "dosen", "mahasiswa", "departemen"];
db.STATUS = [
    "Aktif",
    "Cuti",
    "Mangkir",
    "Drop Out",
    "Mengundurkan Diri",
    "Lulus",
    "Meninggal Dunia",
];

db.dosen.hasMany(db.user)

// db.apply_loker.belongsTo(db.pencaker, {
//     foreignKey: 'no_ktp',
// })

// db.loker.hasMany(db.apply_loker, {
//     foreignKey: 'idloker',
// })

// db.apply_loker.belongsTo(db.loker, {
//     foreignKey: 'idloker',
// })

// db.apply_loker.hasMany(db.tahapan_apply, {
//     foreignKey: 'idapply',
// })

// db.tahapan_apply.belongsTo(db.apply_loker, {
//     foreignKey: 'idapply',
// })

// db.tahapan_apply.belongsTo(db.tahapan, {
//     foreignKey: 'idtahapan',
// })

// db.loker.belongsTo(db.master_status, {
//     foreignKey: 'status',
// })

// db.master_status.hasMany(db.loker, {
//     foreignKey: 'idstatus',
// })


module.exports = db;