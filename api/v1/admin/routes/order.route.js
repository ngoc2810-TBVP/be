const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const orderController = require("../../admin/controllers/order.controller");

// Lấy tất cả order
router.get("/", requireAuth, orderController.getAllOrders);

// Cập nhật trạng thái order
router.put("/:id/status", requireAuth, orderController.updateOrderStatus);

module.exports = router;
