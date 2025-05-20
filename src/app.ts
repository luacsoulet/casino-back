import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import morgan from 'morgan';
import pool from './plugins/db';
import authRoutes from './routes/auth';

const app = express();

const db = pool;

db.connect()
    .then(() => {
        console.log('Connected to PostgreSQL ✅');
    })
    .catch((err) => {
        console.log(err);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

export default app;