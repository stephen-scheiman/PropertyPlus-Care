const { findProperties } = require('./queries/properties');
const { findOwnerById } = require('./queries/owners');

async function errorHandler(err, req, res, next) {
  console.log("\n\n");
  console.log(err);
  console.log("\n\n");

  const msg = err.message;
  const isError = true;

  switch (err.from) {
    case "login": {
      return res.status(200).render("login", { msg, isError, layout: false });
    }

    case "signup": {
      return res.status(200).render("signup", { msg, isError, layout: false });
    }

    case "owner-form-edit": {
      const owner = await findOwnerById(err.data.owner_id)
      return res
        .status(200)
        .set({'hx-retarget': 'this', 'hx-reswap': 'outerHTML'})
        .render("owner-form-edit", { owner, msg, isError, layout: false });
    }
  }

  switch (key) {
    case value:
      break;

    default:
      break;
  }

  res.status(500).json({ msg: "Something went wrong, try again later" });
}

module.exports = errorHandler;
