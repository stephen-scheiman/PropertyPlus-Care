function pageRedirect(req, res, next) {
  console.log('\n\n', req.headers);

  if (req.headers['hx-request']) {
    return next();
  }
  return res.status(200).set('hx-request', true).redirect('/');
}

module.exports = pageRedirect;