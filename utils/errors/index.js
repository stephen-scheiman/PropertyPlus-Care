const BadRequestError = require("./bad-request-error");
const CustomError = require("./custom-error");
const InternalServerError = require("./internal-server-error");
const NotFoundError = require("./not-found-error");
const UnauthorizedError = require("./unauthorized-error");

module.exports = {
  BadRequestError,
  CustomError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
}