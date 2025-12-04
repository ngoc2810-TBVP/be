const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Product = require("../../models/product.model");

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    // Lấy thông tin user & sản phẩm thủ công
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.user_id).select(
          "fullName email phone"
        );
        const items = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.product_id).select(
              "title price thumbnail"
            );
            return {
              ...item.toObject(),
              product,
            };
          })
        );

        return {
          ...order.toObject(),
          user,
          items,
        };
      })
    );

    res.json({ code: 200, orders: ordersWithDetails });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ code: 500, message: "Lỗi server!" });
  }
};

// =========================
// Lấy chi tiết 1 đơn hàng
// =========================
module.exports.getOrderDetail = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user_id", "fullName email phone")
      .populate("items.product_id", "title price thumbnail");

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    res.json({
      code: 200,
      message: "Lấy chi tiết đơn hàng thành công!",
      order,
    });
  } catch (err) {
    console.error("Get order detail error:", err);
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi lấy chi tiết đơn hàng!",
      error: err.message,
    });
  }
};

// =========================
// Cập nhật trạng thái đơn hàng
// =========================
module.exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu trường status!",
      });
    }

    const validStatuses = ["pending", "completed", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        code: 400,
        message: "Trạng thái không hợp lệ!",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
      order,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi cập nhật trạng thái!",
      error: err.message,
    });
  }
};

// =========================
// Xóa đơn hàng (nếu muốn)
// =========================
module.exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy đơn hàng để xóa!",
      });
    }

    await Order.deleteOne({ _id: orderId });
    res.json({
      code: 200,
      message: "Xóa đơn hàng thành công!",
    });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi xóa đơn hàng!",
      error: err.message,
    });
  }
};
