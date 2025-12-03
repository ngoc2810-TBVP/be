const Order = require(".././../models/order.model");

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user_id").populate("items.product_id");
        res.status(200).json({ code: 200, orders });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật trạng thái order
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ code: 404, message: "Order không tồn tại" });

        order.status = status;
        await order.save();

        res.status(200).json({ code: 200, message: "Cập nhật trạng thái thành công", order });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};
