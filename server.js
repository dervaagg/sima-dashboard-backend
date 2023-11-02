import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import db from './src/config/db.js';
import Users from './src/models/userModel.js';
import Admins from './src/models/AdminModel.js';
import Lecturers from './src/models/LecturerModel.js';
import Departments from './src/models/DepartmentModel.js';
import Students from './src/models/StudentModel.js';
const app = express();

dotenv.config();

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



app.listen(process.env.APP_PORT, () => {
  console.log('Server started');
});
