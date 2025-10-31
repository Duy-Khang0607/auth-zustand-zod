import express from 'express';
import dotenv from 'dotenv'; // load file .env
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddlewares.js';

dotenv.config(); // load file .env

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json()); // Giúp express hiểu được dữ liệu gửi lên là json
app.use(cookieParser()); // Giúp express hiểu được dữ liệu gửi lên là cookie
// public routes
app.use('/api/auth', authRoute);

// private routes
app.use(protectedRoute);
app.use('/api/user', userRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
    process.exit(1);
});
