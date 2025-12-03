const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");

// Client checkout
router.post("/checkout", requireAuth, orderController.checkoutCart);

// Lấy danh sách đơn hàng của user
router.get("/my-orders", requireAuth, orderController.getUserOrders);
module.exports = router;
