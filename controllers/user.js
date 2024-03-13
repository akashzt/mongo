const logger = require("../lib/logger");
const resp = require("../lib/response");
const query = require("../lib/queries/user");
const utils = require("../lib/utils");
const constants = require("../constants/constants");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const config = require("config");


const userProfileFields = ["_id", "email","password","name","phone", "role", "profileImage","active"];

const createUser = async function (req, res, next) {
  try {
    logger.info("In create User controller");
    const body = req.body;
    // do not allow duplicate emails in db
    if (body.email && !!(await query.getUserByEmail(body.email))) {
      return await resp.sendResponse(constants.response_code.DUPLICATE, "EmailId already exist!", null, res);
    }
    // encrypt user password and generate a userId
    body.password = await utils.genPasswordHash(body.password);
    let user = await query.createUser(body);
    logger.info(`Query: responded with new user created: ${user}`);
    const token = await genNewToken({
      email: user.email,
      id: user._id,
      name: user.name,
      role: user.role
    });
    res.set("Authorization", token);
   res.body = _.pick(user, userProfileFields);
   return resp.sendResponse(constants.response_code.SUCCESS, "Success", _.pick(user, userProfileFields), res);
  } catch (err) {
    logger.info(`Error in creating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
};

const getUserProfile = async function (req, res) {
  try {
    const user = req.user;
    let userProfile = await query.getUserByEmail(user.email);
    userProfile = _.pick(userProfile, userProfileFields);
    return resp.sendResponse(constants.response_code.SUCCESS, "Success", userProfile, res);

  } catch (err) {
    logger.info(`Error in creating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
};

const updateUser = async function (req, res, next) {
    const { user } = req;
  const body = _.pick(req.body, userProfileFields);
  // if admin request make body as userData else user object
  //let userData = req.url === '/admin/user' ? _.pick(body, ["userId", "email"]) : req.user;
  try {
    // console.log("Updatable:", body);
   
    let userUpdated = await query.updateUser(user.id, body);
    userUpdatedValue = _.pick(userUpdated, userProfileFields);
    const token = await genNewToken({
      email: user.email,
      id: user.id,
      name: userUpdatedValue.name,
      role: userUpdatedValue.role
    }); 
    console.log(token)
    res.set("Authorization", token);

    return resp.sendResponse(constants.response_code.SUCCESS, "User Updated", userUpdatedValue, res);
  } catch (err) {
    logger.info(`Error in updating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, err.message, null, res, err);
  }
};


const changePassword = async function (req, res) {
  try {
    const { user, body } = req;
    const { oldPassword, newPassword } = body;

    const userData = await query.findUser(user.id);
    const result = await bcrypt.compare(oldPassword, userData.password);
    if (result) {
      const passwordHash = await utils.genPasswordHash(newPassword);
      await query.updateUser(user.id, { password: passwordHash });
      const token = await genNewToken({
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role
      });
      res.set("Authorization", token);
      return resp.sendResponse(constants.response_code.SUCCESS, "Password Updated Successfully", {}, res);
    }
    return resp.sendResponse(constants.response_code.BAD_REQUEST, "Old Password is incorrect", null, res);

  } catch (err) {
    logger.info(`Error in changing password: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
};

const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    logger.info(`User Login Initiated for ${email}`);
    // check if account with email exists, if not throw an error
    const user = await query.getUserByEmail(email);
    if (!user) {
      return resp.sendResponse(constants.response_code.NOT_FOUND, "Account not exist, please create a new account or check the email", {}, res);
    }
    // check if password is correct
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return resp.sendResponse(constants.response_code.NOT_FOUND, "Incorrect password", {}, res);
    }

    const token = await genNewToken({
      email: user.email,
      id: user._id,
      name: user.name,
      role: user.role
    });
    console.log(token); 
    let pickedUser = _.pick(user, userProfileFields);
    res.set("Authorization", token);
    return resp.sendResponse(constants.response_code.SUCCESS, "Success", _.pick(user, userProfileFields), res);
  } catch (err) {
    logger.info(`Error in creating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
};
// address route
const addAddress= async function(req,res){
  const {user}=req;
  try{
      let add=await query.createUserAddress(user.id,req.body);
      return resp.sendResponse(constants.response_code.SUCCESS, "User Adress saved", add, res);
  }
  catch(err){
    logger.info(`error in creating address: ${err.message}`)
  }
  
}

const showAddress= async function(req,res){
  try {
    const user = req.user;
    let userAddress = await query.getUserByEmail(user.email);
    console.log(userAddress)
    return resp.sendResponse(constants.response_code.SUCCESS, "user address fetch successfully", userAddress.addresses, res);

  } catch (err) {
    logger.info(`Error in creating user: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
  
}

const genNewToken = async function (payload, res) {
  try {
    const jwtOpts = config.get("jwt");
    return jwt.sign(payload, jwtOpts.secret, {
      expiresIn: jwtOpts.expires // expires in given time
    });
  } catch (err) {
    logger.info(`Error in generating token: ${err.message}`);
    return resp.sendResponse(constants.response_code.INTERNAL_SERVER_ERROR, null, null, res, err);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUserProfile,
  changePassword,
  loginUser,
  addAddress,
  showAddress
};