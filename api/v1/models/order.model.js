const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    items: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true } // giá tại thời điểm đặt
        }
    ],
    total_price: { type: Number, required: true },
    payment_method: { type: String, default: "COD" }, // COD hoặc Online
    status: { type: String, default: "pending" }, // pending, processing, completed, canceled
    shipping_address: { type: String, default: "" },
    note: String
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;
