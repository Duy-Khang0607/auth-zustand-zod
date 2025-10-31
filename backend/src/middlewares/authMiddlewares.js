import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authorization xác minh user đăng nhập
export const protectedRoute = async (req, res, next) => {
    try {
        // Lấy access token từ header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader?.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: "Không có access token" });
        }

        // Xác thực access token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err) {
                return res.status(401).json({ message: "Access token hết hạn hoặc không chính xác" });
            }

             // Tim User 
            const user = await User.findById(decoded.userId).select('-hashedPassword');
            if(!user) {
                return res.status(401).json({ message: "User không tồn tại" });
            }

            // Trả user vào req.use
            req.user = user;
            next();
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống !" });
    }
}