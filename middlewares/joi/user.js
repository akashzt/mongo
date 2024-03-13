let joi = require('joi');
const resp = require("../../lib/response");
const constants = require("../../constants/constants");
const logger = require("../../lib/logger");
// validation schema for create user
const createUserSchema = joi.object({
  email: joi.string().trim().required().email({ minDomainSegments: constants.EMAIL_DOMAIN_SEGMENTS }),
  name: joi.string().trim(),
  phone: joi.string().trim(),
  password: joi.string().min(constants.Numbers.eight).max(constants.Numbers.twenty).required(),
  role:joi.string().trim()
});

// validation schema for create user
const updatePasswordSchema = joi.object({
  oldPassword: joi.string().min(constants.Numbers.eight).max(constants.Numbers.twenty).required(),
  newPassword: joi.string().min(constants.Numbers.eight).max(constants.Numbers.twenty)
    .disallow(joi.ref('oldPassword')).required(),
});

// validation schema for create user
const updateUserSchema = joi.object({
  name: joi.string().trim(),
  phone: joi.string().trim(),
  role: joi.string().trim(),
  profileImage: joi.string().trim()
});

// validation schema for login user
const loginUserSchema = joi.object({
  email: joi.string().trim().required().email({ minDomainSegments: constants.EMAIL_DOMAIN_SEGMENTS }),
  password: joi.string().trim().required(),
});
// validation schema for login user
const noBodyRequestSchema = joi.object({
});

//create address

const createUserAddressSchema = joi.object({
  street: joi.string().trim().required(),
  city: joi.string().trim().required(),
  state: joi.string().trim().required(),
  country: joi.string().trim().required(),
  pinCode: joi.string().trim().min(constants.Numbers.five).max(constants.Numbers.six).required(),
});

//add address

// Method to validate update password req body
const addAddress = function (req, res, next) {
  logger.info("Validating update password req body");
  const validate = createUserAddressSchema.validate(req.body);
  if (validate.error) {
    return resp.sendResponse(constants.response_code.BAD_REQUEST, validate.error.message, {}, res, validate.error);
  }
  return next();

};

// Method to validate create user body
const createUser = function (req, res, next) {
  logger.info("Validating create user data");
  const validate = createUserSchema.validate(req.body);
  if (validate.error) {
    // NOTE : We need to send this error details (In Future)
    // validate.error.details
    return resp.sendResponse(constants.response_code.BAD_REQUEST, validate.error.message, {}, res, validate.error);
  }
  return next();

};

// Method to validate update password req body
const updatePassword = function (req, res, next) {
  logger.info("Validating update password req body");
  const validate = updatePasswordSchema.validate(req.body);
  if (validate.error) {
    return resp.sendResponse(constants.response_code.BAD_REQUEST, validate.error.message, {}, res, validate.error);
  }
  return next();

};

// Method to validate update user req body
const updateUser = function (req, res, next) {
  logger.info("Validating update password req body");
  const validate = updateUserSchema.validate(req.body);
  if (validate.error) {
    return resp.sendResponse(constants.response_code.BAD_REQUEST, validate.error.message, {}, res, validate.error);
  }
  return next();

};
// Method to validate login user req body
const loginUser = function (req, res, next) {
  logger.info("Validating user login req body");
  const validate = loginUserSchema.validate(req.body);
  if (validate.error) {
    return resp.sendResponse(constants.response_code.BAD_REQUEST, validate.error.message, {}, res, validate.error);
  }
  return next();

};
// Method to validate with blank req body
const noBodyRequest = function (req, res, next) {
  logger.info("Validating no body request");
  const validate = noBodyRequestSchema.validate(req.body);
  if (validate.error) {
    return resp.sendResponse(constants.response_code.BAD_REQUEST, validate.error.message, {}, res, validate.error);
  }
  return next();

};

module.exports = {
  createUser,
  updatePassword,
  updateUser,
  loginUser,
  noBodyRequest,
  addAddress
};
