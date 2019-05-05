const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
router.post("/reg", userController.create);
router.post("/auth", userController.authenticate);
module.exports = router;
