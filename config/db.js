import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const testDbConnection = async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const db = new Sequelize(process.env.POSTGRESQL_DB_URI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default db;
