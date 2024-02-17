const router = require('express').Router();

router.route('/')
  .get((req, res) => {res.render("homepage")})

router.route("/pg1")
  .get((req, res) => {res.render("test1", {layout:false})})

router.route("/pg2")
  .get((req, res) => {res.render("test2", {layout:false})})

router.route("/pg3")
  .get((req, res) => {res.render("test3", {layout:false})})

router.route("/pg4")
  .get((req, res) => {res.render("test4", {layout:false})})

module.exports = router;