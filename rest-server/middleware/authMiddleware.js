import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../helpers/UserHelper.js';

const authMiddleware = async (req, res, next) => {
    console.log(req.headers);
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            status: 109,
            message: 'Token tidak ditemukan',
            data: null
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        
        const user = await findUserByEmail(decoded.email);
        if (!user) {
            return res.status(403).json({
                status: 110,
                message: 'User tidak ditemukan',
                data: null
            });
        }
        
        req.user = { email: user.email, id: user.id };
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err);
        return res.status(403).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        });
    }
};

export default authMiddleware;
