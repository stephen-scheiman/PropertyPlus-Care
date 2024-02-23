function pageRedirect(req, res, next) {
  if (req.headers['hx-request']) {
    return next();
  }
  return res.status(200).set('hx-request', true).redirect('/');
}

module.exports = pageRedirect;