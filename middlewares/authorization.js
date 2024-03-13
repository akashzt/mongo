const jwt = require("jsonwebtoken");
const config = require("config");
const response = require("../lib/response");
const constants = require("../constants/constants");

const authorization = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.get("jwt.secret"), (err, decoded) => {
      if (err) {
        return response.sendResponse(constants.response_code.JWT, null, null, res, err);
      }
      req.user = decoded;
      return next();

    });
  } else {
    return response.sendResponse(constants.response_code.UNAUTHORIZED, null, null, res);
  }
};

module.exports = authorization;
