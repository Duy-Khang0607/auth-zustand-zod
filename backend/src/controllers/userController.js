


export const authMe = async (req, res) => {
    try {
        // Lấy user từ authMiddleware
        const user = req.user;

        // Trả thông tin user về cho client
        return res.status(200).json({ success: true, message: "Lấy thông tin user thành công !" , user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống !" });
    }
}