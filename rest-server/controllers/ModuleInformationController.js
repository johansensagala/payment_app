import fs from 'fs';
import { baseUrl, port } from '../config.js';
import { addBanner, fetchBanners } from '../helpers/BannerHelper.js';
import { addService, fetchServices } from '../helpers/ServiceHelper.js';

const basePath = `${baseUrl}:${port}`;

const getBanners = async (req, res) => {
    try {
        const banners = await fetchBanners();

        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: banners
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const getServices = async (req, res) => {
    try {
        const services = await fetchServices();

        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: services
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const createBanner = async (req, res) => {
    try {
        const { banner_name, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: 102,
                message: 'Gambar banner tidak ada',
                data: null
            });
        }

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.mimetype)) {
            fs.unlinkSync(file.path);
            return res.status(400).json({
                status: 102,
                message: 'Format gambar tidak sesuai',
                data: null
            });
        }

        const banner_image = `${basePath}/public/BannerImage/${file.filename}`;
        const newBanner = { banner_name, banner_image, description };

        const bannerId = await addBanner(newBanner);

        res.status(201).json({
            status: 0,
            message: 'Banner berhasil ditambahkan',
            data: { bannerId }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const createService = async (req, res) => {
    try {
        const { service_code, service_name, service_tarif } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: 102,
                message: 'Ikon service tidak ada',
                data: null
            });
        }

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.mimetype)) {
            fs.unlinkSync(file.path);
            return res.status(400).json({
                status: 102,
                message: 'Format ikon tidak sesuai',
                data: null
            });
        }

        const service_icon = `${basePath}/public/ServiceIcon/${file.filename}`;
        const newService = { service_code, service_name, service_icon, service_tarif };

        const serviceId = await addService(newService);

        res.status(201).json({
            status: 0,
            message: 'Service berhasil ditambahkan',
            data: { serviceId }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

export { createBanner, createService, getBanners, getServices };

