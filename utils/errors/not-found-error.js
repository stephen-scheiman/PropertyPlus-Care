const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  constructor(msg) {
    super(msg);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;