import { pool } from "../config.js";
import { findUserByEmail } from "./UserHelper.js";

const checkBalance = async (email) => {
    const query = 'SELECT balance FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
};

const updateBalance = async (email, amount) => {
    const currentBalance = await checkBalance(email);
    const newBalance = parseFloat(currentBalance.balance) + parseFloat(amount);
    
    const query = 'UPDATE users SET balance = ? WHERE email = ?';
    await pool.query(query, [newBalance, email]);
    return newBalance;
};

const checkTransactions = async (email, offset, limit) => {
    let query = `
        SELECT invoice_number, transaction_type, service_name, amount, created_on 
        FROM transactions 
        JOIN users ON transactions.user_id = users.id
        LEFT JOIN services ON transactions.service_id = services.id
        WHERE email = ?
        ORDER BY created_on DESC`;

    if (limit !== undefined && limit > 0) {
        query += ` LIMIT ?`;
        if (offset !== undefined && offset >= 0) {
            query += ` OFFSET ?`;
        }
    }

    const params = [email];
    if (limit !== undefined && limit > 0) {
        params.push(limit);
        if (offset !== undefined && offset >= 0) {
            params.push(offset);
        }
    }

    const [rows] = await pool.query(query, params);
    return rows;
};

const addTransactions = async (email, service_code, transaction_type, amount, ) => {
    const user = await findUserByEmail(email);
    const userId = user.id;
    const invoiceNumber = `INV-${Date.now()}`;

    const insertQuery = `
        INSERT INTO transactions (amount, transaction_type, service_id, user_id, invoice_number, created_on)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const result = await pool.query(insertQuery, [amount, transaction_type, service_code, userId, invoiceNumber]);

    return {
        transactionId: result.insertId, 
        invoiceNumber,
        created_on: new Date().toISOString()
    };
};

const checkService = async (service_code) => {
    const query = 'SELECT * FROM services WHERE service_code = ?';
    const [rows] = await pool.query(query, [service_code]);
    return rows[0];
};

export { addTransactions, checkBalance, checkService, checkTransactions, updateBalance };

