import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();

dotenv.config();

app.listen(process.env.APP_PORT, () => {
  console.log('Server started on port : ' + process.env.APP_PORT);
});

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3001',
  })
);

// (async () => {
// await db.sync();
// })();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', Routes);

