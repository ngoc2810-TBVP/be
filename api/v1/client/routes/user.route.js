const express = require('express')
const router = express.Router();
const authMiddleWare = require('../middlewares/auth.middleware')

const controller = require("../controllers/user.controller")

router.post("/register", controller.register)
router.post("/login", controller.login)
router.post("/checkToken", controller.checkToken)
router.get('/verify', authMiddleWare.requireAuth, controller.verifyUser);

module.exports = router;
