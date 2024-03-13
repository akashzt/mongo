const express = require("express");
const router = express.Router();
const conroller=require("../controllers/admin");
const userAuth = require("../middlewares/authorization");
const adminAuth=require("../middlewares/adminAuth");

//report view
router.get("/reports" ,userAuth,conroller.report)

module.exports = router;