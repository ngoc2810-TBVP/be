const express = require('express')
const router = express.Router();

const controller = require("../controllers/role.controller")

router.get("/", controller.index)
router.post("/create", controller.create)
router.get("/permissions", controller.permissions)
router.patch("/permissions/update", controller.updatePermissions)

module.exports = router;
