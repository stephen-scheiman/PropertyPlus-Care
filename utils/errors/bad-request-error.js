const CustomError = require("./custom-error");
class BadRequestError extends CustomError {
  constructor(str, msg) {
    super(msg);
    this.from = str;
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;