import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import db from './src/config/db.js';
import usersRoutes from './src/routes/UsersRoutes.js';
import adminsRoutes from './src/routes/AdminsRoutes.js';
import departmentsRoutes from './src/routes/DepartmentsRoutes.js';
import lecturersRoutes from './src/routes/LecturersRoutes.js';
import studentsRoutes from './src/routes/StudentsRoutes.js';

const app = express();

dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3001',
  })
  );
  
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(express.json());
  app.use('/api', Routes);
  app.use(usersRoutes);
  app.use(adminsRoutes);
  app.use(departmentsRoutes);
  app.use(lecturersRoutes);
  app.use(studentsRoutes);
  
  
  app.listen(process.env.APP_PORT, () => {
    console.log('Server started on port : ' + process.env.APP_PORT);
  });
  
  
  // (async () => {
  //   await db.sync({ force: true });
  // })();
  
  // const p = new Promise((resolve, reject) => {
  //   return resolve('Success message');
  // });
  
  // p.then(data => {
  //   // 👇️ .then block ran:  Success message
  //   console.log('.then block ran: ', data);
  // }).catch(err => {
  //   console.log('.catch block ran: ', err);
  // });