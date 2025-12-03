const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
});

const cartSchema = new mongoose.Schema(
    {
        userToken: {
            type: String, // Lưu token của user thay vì user_id
            required: true,
            unique: true
        },
        items: [cartItemSchema],
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;
