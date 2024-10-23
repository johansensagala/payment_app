import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'payment_app',
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(() => {
        console.log('Koneksi MySQL berhasil!');
    })
    .catch(err => {
        console.error('Koneksi MySQL gagal:', err);
    });

const port = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL || "http://localhost";

export { port, pool, baseUrl };
