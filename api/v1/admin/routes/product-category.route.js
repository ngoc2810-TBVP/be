const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middlewares/auth.middleware");

const controller = require("../controllers/product-category.controller");

router.get("/", controller.index);
router.get("/:id", controller.detail);
router.post("/create", controller.create);
router.patch("/update/:id", controller.update);
router.delete("/delete/:id", controller.delete);

module.exports = router;
