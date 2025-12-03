const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite.controller");

// Lấy danh sách yêu thích
router.get("/", favoriteController.getFavorites);

// Thêm sản phẩm vào yêu thích
router.post("/add", favoriteController.addFavorite);

// Xóa sản phẩm khỏi yêu thích
router.delete("/remove/:product_id", favoriteController.removeFavorite);

// Xóa tất cả
router.delete("/clear", favoriteController.clearFavorites);

module.exports = router;
