const express = require("express");
const router = express.Router();

const controller = require("../controllers/product-category.controller");

router.get("/", controller.index);
router.get("/getProductCaterogy", controller.getProductsInCategory);
router.get("/:slug", controller.getProductsBySlugCategory);

module.exports = router;
