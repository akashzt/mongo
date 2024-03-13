const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const userAuth = require("../middlewares/authorization");
const joi=require('../middlewares/joi/user');



// create a new user
router.post("/user",joi.createUser, controller.createUser);
// update details for an existing user, it does not allow updating the password
router.put("/user",joi.updateUser,userAuth, controller.updateUser);
// login user using email and password
router.post("/user/login",joi.loginUser, controller.loginUser);
// change user password, you have to pass oldPassword and new password and a jwt in header for Auth
router.put("/user/change-password",joi.updatePassword,userAuth,controller.changePassword);
// get user details/profile
router.get("/user/profile",userAuth, controller.getUserProfile);

//add user Address

router.post("/user/address",joi.addAddress,userAuth,controller.addAddress);

//get all address
router.get("/user/address",userAuth,controller.showAddress);

module.exports = router;
