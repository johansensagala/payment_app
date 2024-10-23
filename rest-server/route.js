// routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';

import { getProfile, login, register, updateImage, updateProfile } from './controllers/ModuleMembershipController.js';
import { getBanners, getServices, createBanner, createService } from './controllers/ModuleInformationController.js';
import { getBalance, topup, transact, getHistories } from './controllers/ModuleTransactionController.js';
import authMiddleware from './middleware/authMiddleware.js';

const router = express.Router();

const storageProfileImage = multer.diskStorage({
    destination: './files/ProfileImage/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const storageBannerImage = multer.diskStorage({
    destination: './files/BannerImage/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const storageServiceIcon = multer.diskStorage({
    destination: './files/ServiceIcon/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadProfileImage = multer({ storage: storageProfileImage });
const uploadBannerImage = multer({ storage: storageBannerImage });
const uploadServiceIcon = multer({ storage: storageServiceIcon });

// Module Membership
router.post('/registration', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, updateProfile);
router.put('/profile/image', authMiddleware, uploadProfileImage.single('profile_image'), updateImage);

// // Module Information
router.get('/banner', authMiddleware, getBanners);
router.post('/banner', authMiddleware, uploadBannerImage.single('banner_image'), createBanner);
router.get('/services', authMiddleware, getServices);
router.post('/services', authMiddleware, uploadServiceIcon.single('service_icon'), createService);

// Module Transaction
router.get('/balance', authMiddleware, getBalance);
router.post('/topup', authMiddleware, topup);
router.post('/transaction', authMiddleware, transact);
router.get('/transaction/history', authMiddleware, getHistories);

export default router;
