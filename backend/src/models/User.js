import mongoose from 'mongoose';

// Model cho api User

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    avatarUrl: {
        type: String,
    },
    avatarId: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500,
        trim: true,
    },
    phone: {
        type: String,
        sparse: true, // Cho phép trường này là null hoặc undefined
    }
} , {
    timestamps: true, // Tạo trường createdAt và updatedAt tự động
});

const User = mongoose.model('User', userSchema);
export default User;
