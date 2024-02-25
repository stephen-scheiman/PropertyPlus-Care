async function errorHandler(err, req, res, next) {
  console.log(err);

  const msg = err.message;

  // const customError = {
  //   message: err.msg || 'Something went wrong. Try again later.',
  //   statusCode: err.statusCode || 500
  // };

  switch (err.from) {
    case 'login': {
      console.log('\n\nfrom switch\n\n');
      return res.status(200).render('error-login', { msg, layout: false });
    }

    default:
      break;
  }

  res.status(customError.statusCode).json({ message: err.message });
}

module.exports = errorHandler;