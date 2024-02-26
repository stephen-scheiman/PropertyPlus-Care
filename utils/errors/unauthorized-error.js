const CustomError = require("./custom-error");
class UnauthorizedError extends CustomError{
  constructor(str, msg) {
    super(msg);
    this.from = str;
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;