const CustomError = require("./custom-error");
class BadRequestError extends CustomError {
  constructor(str, msg, data) {
    super(msg);
    this.from = str;
    this.data = data;
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;