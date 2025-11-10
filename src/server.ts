import express from 'express';
import setRoutes from './app.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, Atom Technical Test!');
});
setRoutes(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
