import mongoose from 'mongoose';

export const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: { // lưu thởi điểm refresh token hết hạn
        type: Date,
        required: true
    }
}, {
    timestamps: true, // Tạo trường createdAt và updatedAt tự động
});

// Tự động xóa session khi refresh token hết hạn
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);
export default Session; 