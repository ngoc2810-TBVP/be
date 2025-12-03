const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const orderController = require("../../admin/controllers/order.controller");

// Middleware kiểm tra admin
const requireAdmin = (req, res, next) => {
    if (req.user.status !== "admin") {
        return res.status(403).json({ code: 403, message: "Chỉ admin mới truy cập!" });
    }
    next();
}

// Lấy tất cả order
router.get("/", requireAuth, requireAdmin, orderController.getAllOrders);

// Cập nhật trạng thái order
router.put("/:id/status", requireAuth, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
