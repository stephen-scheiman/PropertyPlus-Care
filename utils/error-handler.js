async function errorHandler(err, req, res, next) {
  const customError = {
    message: err.msg || 'Something went wrong. Try again later.',
    statusCode: err.statusCode || 500
  };


  if (req.header.HX - Request) {

  } else {
    res.status(customError.statusCode).json({ message: err.message });
  }
}

module.exports = errorHandler;