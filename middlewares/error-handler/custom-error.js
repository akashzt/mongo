const constants = require("../../constants/constants");

let errors = {};

class CustomError extends Error {
  constructor(message, details, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// expose class
errors.CustomError = CustomError;

CustomError.prototype.sendResponse = function(res) {
  //res.status(this.statusCode);
  res.json({
    status: {
      code: this.statusCode,
      message: this.message,
      details: this.details
    },
    result: {}
  });
};

function createCustomError(message, statusCode, detail) {
  return function() {
    return new CustomError(message, statusCode, detail);
  };
}

CustomError.prototype.withDetails = function(details) {
  this.details = details;
  return this;
};


module.exports = errors;

// bussiness errors
errors.invalidCode = createCustomError("Invalid_Code", "Invalid code.", constants.response_code.BAD_REQUEST);

errors.invalidCartStatus = createCustomError("Invalid_cart_status", "Cart status is inalid", constants.response_code.METHOD_NOT_ALLOWED);

errors.invalidId = createCustomError("Invalid_Id", "invalid id.", constants.response_code.INVALID_ID);

errors.invalidInput = createCustomError("Invalid_Input", "The request input is not as expected by API. Please provide valid input.", constants.response_code.BAD_REQUEST);


