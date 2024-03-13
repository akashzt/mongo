const jwt = require("jsonwebtoken");
const config = require("config");
const response = require("../lib/response");
const constants = require("../constants/constants");

const adminAuthorization = (req, res, next) => {
  let {user}=req;
  if (user && user.role && (user.role).toUpperCase()==="ADMIN") {
   
      return next();

  }
    return response.sendResponse(constants.response_code.UNAUTHORIZED, null, null, res);
  
};

module.exports = adminAuthorization;
