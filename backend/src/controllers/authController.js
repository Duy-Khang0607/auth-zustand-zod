import User from "../models/User.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Session from "../models/Session.js";


const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000 // 14 ngày tính theo ms

export const signUp = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        // Kiểm tra các trường
        if(!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        // Kiểm tra username hoặc email đã tồn tại chưa
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if(existingUser) {
            // Kiểm tra trường nào bị trùng
            if(existingUser.username === username) {
                return res.status(409).json({ message: 'Username đã tồn tại' });
            }
            if(existingUser.email === email) {
                return res.status(409).json({ message: 'Email đã tồn tại' });
            }
        }

        // Mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10); // 2^10 -> Mã hóa

        // Tạo user mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        });

        // Return
        return res.status(201).json({ message: "Đăng ký thành công !" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống !" });
    }
}

export const signIn = async (req, res) => {
    try {
        // Lấy input
        const { username, password } = req.body;

        // Kiểm tra username và password
        if(!username || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin !" });
        }

        // Kiểm tra user trong db có tồn tại không
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(401).json({ message: "Username hoặc Password không chính xác" });
        }

        // So sánh password với hasedPassword dưới db
        const passwordCorrect = await bcrypt.compare(password, user?.hashedPassword);
        if(!passwordCorrect) {
            return res.status(401).json({ message: "Username hoặc Password không chính xác" });
        }
        
        // nếu password khớp -> Tạo access token
        const accessToken = jwt.sign({ userId: user?._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
        if(!accessToken) {
            return res.status(401).json({ message: "Không thể tạo access token" });
        }

        // Tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        if(!refreshToken) {
            return res.status(401).json({ message: "Không thể tạo refresh token" });
        }

        // Tạo session dưới DB để lưu refresh token
        await Session.create({
            userId: user?._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        // Trả refresh token về trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // chỉ truy cập được trong https
            sameSite: 'none', // cho phép truy cập từ các domain khác
            maxAge: REFRESH_TOKEN_TTL
        });

        // Trả access token về cho client
        return res.status(200).json({ message: `User ${user?.displayName} đã đăng nhập thành công !`, accessToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống !" });
    }
}

export const signOut = async (req, res) => {
    try {
        // Lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if(token) {
            // Xóa refresh token trong Session (DB)
            await Session.deleteOne({ refreshToken: token });
            // Xóa cookie từ trình duyệt
            res.clearCookie('refreshToken');
        }
        return res.status(200).json({ message: "Đăng xuất thành công !" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống !" });
    }
}