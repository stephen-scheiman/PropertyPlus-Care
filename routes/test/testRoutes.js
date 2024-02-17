const router = require('express').Router();

router.route('/')
  .get((req, res) => {res.render("homepage")})


module.exports = router;