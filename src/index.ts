import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes';

const PORT = 8080;

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());

// const server = http.createServer(app);

const server = app.listen(PORT, '0.0.0.0', () => {
  const { address, port } = server.address() as any;
  console.log(`Server is running and accessible at http://${address}:${PORT}`);
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.log('MongoDb connection error: ' + err);
  process.exit(1);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDb connected');
});

app.use('/', router());
