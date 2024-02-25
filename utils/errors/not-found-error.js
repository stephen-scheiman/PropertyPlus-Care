const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  constructor(str, msg) {
    super(msg);
    this.from = str;
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;