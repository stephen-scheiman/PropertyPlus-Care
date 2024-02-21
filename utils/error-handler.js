async function errorHandler(err, req, res, next) {
  console.log(err);
  const customError = {
    message: err.msg || 'Something went wrong. Try again later.',
    statusCode: err.statusCode || 500
  };



  res.status(customError.statusCode).json({ message: err.message });
}

module.exports = errorHandler;