import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/eventRoutes.js';
import connectDB from './utils/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server is listening on port: ${PORT}`));
