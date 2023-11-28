module.exports = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: 'root',
  DB: 'monitoring_backeng',
  dialect: 'mysql',
  port: 8889,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // 30 detik
    idle: 10000 // 10 detik
  }
}