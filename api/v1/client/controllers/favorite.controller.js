const Favorite = require("../../models/favorite.model");
const Product = require("../../models/product.model");

module.exports = {
    // Lấy danh sách yêu thích
    getFavorites: async (req, res) => {
        try {
            const user_id = req.user.id;
            let favorite = await Favorite.findOne({ user_id }).populate("products");

            if (!favorite) favorite = await Favorite.create({ user_id, products: [] });

            res.json({ status: "success", favorite });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Thêm sản phẩm vào yêu thích
    addFavorite: async (req, res) => {
        try {
            const user_id = req.user.id;
            const { product_id } = req.body;

            const product = await Product.findById(product_id);
            if (!product) return res.status(404).json({ message: "Product not found" });

            let favorite = await Favorite.findOne({ user_id });

            if (!favorite) {
                favorite = await Favorite.create({ user_id, products: [product_id] });
            } else {
                if (!favorite.products.includes(product_id)) {
                    favorite.products.push(product_id);
                    await favorite.save();
                }
            }

            res.json({ status: "success", favorite });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Xóa sản phẩm khỏi yêu thích
    removeFavorite: async (req, res) => {
        try {
            const user_id = req.user.id;
            const { product_id } = req.params;

            const favorite = await Favorite.findOne({ user_id });
            if (!favorite) return res.status(404).json({ message: "Favorites not found" });

            favorite.products = favorite.products.filter(
                (id) => id.toString() !== product_id
            );

            await favorite.save();

            res.json({ status: "success", favorite });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Xóa tất cả sản phẩm yêu thích
    clearFavorites: async (req, res) => {
        try {
            const user_id = req.user.id;

            const favorite = await Favorite.findOneAndUpdate(
                { user_id },
                { products: [] },
                { new: true }
            );

            res.json({ status: "success", favorite });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
