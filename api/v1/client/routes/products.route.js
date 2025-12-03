const express = require('express')
const router = express.Router();

const controller = require("../controllers/product.controller")

router.get("/", controller.index)
router.get("/products-feature", controller.productsFeature)
router.get("/:slug", controller.detail)

module.exports = router;
