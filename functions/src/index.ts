import express from 'express';
import setRoutes from './app.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { loggingEndpointMiddleware } from './shared/middlewares/logging.middleware.js';
import * as functions from 'firebase-functions';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(loggingEndpointMiddleware);

app.get('/', (req, res) => {
    res.send('Hello, Atom Technical Test!');
});
setRoutes(app);

export const api = functions.https.onRequest(app);
