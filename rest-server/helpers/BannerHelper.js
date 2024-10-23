import { pool } from "../config.js";

const addBanner = async (banner) => {
    const { banner_name, banner_image, description } = banner;
    const query = 'INSERT INTO banners (banner_name, banner_image, description) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [banner_name, banner_image, description]);
    return result.insertId;
};

const fetchBanners = async () => {
    const query = 'SELECT banner_name, banner_image, description FROM banners';
    const [rows] = await pool.query(query);
    return rows;
};

export { addBanner, fetchBanners };
