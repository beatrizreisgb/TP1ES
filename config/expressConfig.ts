import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import UserRouter from '../src/domains/User/controller/index';
import OwnerRouter from '../src/domains/Owner/controller/index';

dotenv.config();

export const app: Express = express();

const options : CorsOptions = {
	credentials: true,
	origin: '*'
};

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.use('/api/users', UserRouter);
app.use('/api/owners', OwnerRouter);

export default app;