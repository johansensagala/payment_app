// app.js
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { port } from './config.js';
import routes from './route.js';

// Mendapatkan __dirname dalam modul ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.use('/public', express.static(path.join(__dirname, 'files')));

// Routes
app.use('/', routes);

app.listen(port, () => { 
    console.log(`Aplikasi berjalan! di port ${port}`);
});
