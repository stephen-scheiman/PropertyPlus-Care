const CustomError = require("./custom-error");

class InternalServerError extends CustomError {
  constructor(str, msg) {
    super(msg);
    this.from = str;
    this.statusCode = 500;
  }
};

module.exports = InternalServerError;