import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', Routes);

app.listen(process.env.APP_PORT, () => {
  console.log('Server started');
});
