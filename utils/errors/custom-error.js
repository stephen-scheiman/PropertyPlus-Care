class CustomError extends Error {
  constructor(msg) {
    super(msg);
  }
};

module.exports = CustomError;