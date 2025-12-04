const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // liên kết tới collection "users"
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // liên kết tới collection "products"
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true }, // giá sản phẩm tại thời điểm đặt
      },
    ],
    total_price: { type: Number, required: true },
    payment_method: { type: String, default: "COD" }, // COD hoặc Online
    status: { type: String, default: "pending" }, // pending, completed, canceled
    shipping_address: { type: String, default: "" },
    note: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;
