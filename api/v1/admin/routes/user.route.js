const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middlewares/auth.middleware");
const controller = require("../controllers/user.controller");

router.get("/", authMiddleWare.requireAuth, controller.getAllUsers);

router.get("/:id", authMiddleWare.requireAuth, controller.getUserDetail);
router.post("/create", authMiddleWare.requireAuth, controller.createUser);

router.patch("/update/:id", authMiddleWare.requireAuth, controller.updateUser);

router.patch("/delete/:id", authMiddleWare.requireAuth, controller.deleteUser);

module.exports = router;
