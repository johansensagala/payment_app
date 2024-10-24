import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { baseUrl, port } from '../config.js';
import { addUser, findUserByEmail, updateUserImage, updateUserProfile } from '../helpers/UserHelper.js';

const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
            status: 102,
            message: 'Semua field harus diisi',
            data: null
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter email tidak sesuai format',
            data: null
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            status: 102,
            message: 'Password harus memiliki minimal 8 karakter',
            data: null
        });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: 102,
                message: 'Email sudah terdaftar',
                data: null
            });
        }

        const result = await addUser({ first_name, last_name, email, password });
        res.status(200).json({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: null
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter email tidak sesuai format',
            data: null
        });
    }

    try {
        const user = await findUserByEmail(email);
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign(
                    {
                        email: user.email,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '12h' }
                );

                res.status(200).json({
                    status: 0,
                    message: 'Login Sukses',
                    data: { token }
                });
            } else {
                res.status(401).json({
                    status: 103,
                    message: 'Username atau password salah',
                    data: null
                });
            }
        } else {
            res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({
            status: 1,
            message: e.message,
            data: null
        });
    }
};

const getProfile = async (req, res) => {
    const { email } = req.user;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                status: 1,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        const { first_name, last_name, profile_image } = user;

        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: {
                email,
                first_name,
                last_name,
                profile_image
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const updateProfile = async (req, res) => {
    const { email } = req.user;

    try {
        const { first_name, last_name } = req.body;

        await updateUserProfile(email, { first_name, last_name });

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                status: 1,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        const { profile_image } = user;

        res.status(200).json({
            status: 0,
            message: 'Update Profile berhasil',
            data: {
                email,
                first_name,
                last_name,
                profile_image,
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 1,
            message: error.message,
            data: null
        });
    }
};

const updateImage = async (req, res) => {
    try {
        const email = req.user.email;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: 102,
                message: 'Format Image tidak sesuai',
                data: null
            });
        }

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.mimetype)) {
            fs.unlinkSync(file.path);
            return res.status(400).json({
                status: 102,
                message: 'Format Image tidak sesuai',
                data: null
            });
        }

        const imagePath = `${baseUrl}/public/ProfileImage/${file.filename}`;
        
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        }

        await updateUserImage(email, imagePath);

        return res.status(200).json({
            status: 0,
            message: 'Update Profile Image berhasil',
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: imagePath
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

export { getProfile, login, register, updateImage, updateProfile };

