import express from 'express';
import setRoutes from './app.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { loggingEndpointMiddleware } from './shared/middlewares/logging.middleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(loggingEndpointMiddleware);

app.get('/', (req, res) => {
    res.send('Hello, Atom Technical Test!');
});
setRoutes(app);

if (process.env.FUNCTIONS_EMULATOR != 'true') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;
