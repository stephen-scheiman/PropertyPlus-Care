const CustomError = require("./custom-error");

class InternalServerError extends CustomError {
  constructor(msg) {
    super(msg);
    this.statusCode = 500;
  }
};

module.exports = InternalServerError;