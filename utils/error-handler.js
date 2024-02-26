const { ValidationError, ValidationErrorItem } = require('sequelize');

async function errorHandler(err, req, res, next) {
  // console.log('\n\n');
  // console.log(err);
  // console.log('\n\n')
  // console.log(err.errors[0])
  // console.log('\n\n')

  // console.log('\n\n', err instanceof ValidationError ,'\n\n');
  // console.log('\n\n', err.errors[0] instanceof ValidationErrorItem ,'\n\n');

  const msg = err.message;
  const isError = true;
  switch (err.from) {
    case 'login': {
      return res.status(200).render('login', { msg, isError, layout: false });
    }

    case 'signup': {
      return res.status(200).render('error-signup', { msg, layout: false });
    }

  }

  switch (key) {
    case value:

      break;

    default:
      break;
  }

  res.status(500).json({ msg: 'Something went wrong, try again later' });
}

module.exports = errorHandler;