const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const QRCode = require("qrcode");

// Thanh toán giỏ hàng
exports.checkoutCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, shipping_address, payment_method, note } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ code: 400, message: "Giỏ hàng trống!" });
        }

        // Tính tổng tiền
        let totalPrice = 0;
        const orderItems = [];

        for (let item of items) {
            const product = await Product.findOne({ _id: item.product_id, deleted: false });
            if (!product) {
                return res.status(404).json({ code: 404, message: `Sản phẩm ${item.product_id} không tồn tại` });
            }

            const priceAfterDiscount = product.price - (product.discountPercentage || 0) * product.price / 100;
            totalPrice += priceAfterDiscount * item.quantity;

            orderItems.push({
                product_id: product._id,
                quantity: item.quantity,
                price: priceAfterDiscount
            });
        }

        // Tạo order
        const order = new Order({
            user_id: userId,
            items: orderItems,
            total_price: totalPrice,
            payment_method: payment_method || "COD",
            shipping_address: shipping_address || "",
            note: note || "",
            status: payment_method === "ONLINE" ? "PENDING_PAYMENT" : "PROCESSING"
        });

        await order.save();

        // Nếu là thanh toán COD → trả về luôn
        if (payment_method !== "ONLINE") {
            return res.status(200).json({
                code: 200,
                message: "Đặt hàng thành công!",
                order
            });
        }

        // --------------------------
        // 🔥 XỬ LÝ QR PAYMENT
        // --------------------------

        const bankId = process.env.BANK_ID;
        const accountNo = process.env.BANK_ACCOUNT;
        const accountName = process.env.ACCOUNT_NAME;

        // Nội dung chuyển khoản
        const paymentContent = `ORDER${order._id}`.toUpperCase();

        // Link VietQR
        const qrUrl =
            `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?` +
            `amount=${totalPrice}&addInfo=${paymentContent}`;

        // Convert thành QR Base64 (tuỳ frontend dùng loại gì)
        const qrImageBase64 = await QRCode.toDataURL(qrUrl);

        return res.status(200).json({
            code: 200,
            message: "Vui lòng quét QR để thanh toán",
            payment: {
                amount: totalPrice,
                bank: accountName,
                content: paymentContent,
                qr_url: qrUrl,
                qr_base64: qrImageBase64
            },
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user_id: userId }).populate("items.product_id");
        res.status(200).json({ code: 200, orders });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};
