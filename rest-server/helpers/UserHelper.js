import bcrypt from 'bcrypt';
import { pool } from "../config.js";

const addUser = async (user) => {
    const { first_name, last_name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (first_name, last_name, email, password, balance) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [first_name, last_name, email, hashedPassword, 0]);
    return result.insertId;
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
};

const updateUserProfile = async (email, { first_name, last_name }) => {
    const query = 'UPDATE users SET first_name = ?, last_name = ? WHERE email = ?';
    await pool.query(query, [first_name, last_name, email]);
};

const updateUserImage = async (email, imageUrl) => {
    const query = 'UPDATE users SET profile_image = ? WHERE email = ?';
    await pool.query(query, [imageUrl, email]);
};

export { addUser, findUserByEmail, updateUserImage, updateUserProfile };