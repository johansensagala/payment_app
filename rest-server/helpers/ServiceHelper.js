import { pool } from "../config.js";

const addService = async (service) => {
    const { service_code, service_name, service_icon, service_tarif } = service;
    const query = 'INSERT INTO services (service_code, service_name, service_icon, service_tarif) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [service_code, service_name, service_icon, service_tarif]);
    return result.insertId;
};

const fetchServices = async () => {
    const query = 'SELECT service_code, service_name, service_icon, service_tarif FROM services';
    const [rows] = await pool.query(query);
    return rows;
};

export { addService, fetchServices };
