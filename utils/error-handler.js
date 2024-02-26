const { findProperties, findPropertyByID } = require("./queries/properties");
const { findOwnerById } = require("./queries/owners");
const { findVendorByID } = require('./queries/vendors');

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
      const owner = await findOwnerById(err.data.owner_id);
      return res
        .status(200)
        .set({ "hx-retarget": "this", "hx-reswap": "outerHTML" })
        .render("owner-form-edit", { owner, msg, isError, layout: false });
    }

    case "owner-form-new": {
      return res
        .status(200)
        .render("owner-form-new", { msg, isError, layout: false });
    }

    case "property-form-edit": {
      const property = await findPropertyByID(err.data.property_id);
      return res
        .status(200)
        .set({ "hx-retarget": "this", "hx-reswap": "outerHTML" })
        .render("property-form-edit", {
          property,
          msg,
          isError,
          layout: false,
        });
    }

    case "property-form-new": {
      return res
        .status(200)
        .render("property-form-new", { msg, isError, layout: false });
    }

    case "issue-form-edit": {
      const issue = await findIssueByID(err.data.issue_id);
      return res
        .status(200)
        .set({ "hx-retarget": "this", "hx-reswap": "outerHTML" })
        .render("issue-form-edit", {
          issue,
          msg,
          isError,
          layout: false,
        });
    }

    case "issue-form-new": {
      return res
        .status(200)
        .render("issue-form-new", { msg, isError, layout: false });
    }

    case "vendor-form-edit": {
      const vendor = await findVendorByID(err.data.vendor_id);
      return res
        .status(200)
        .set({ "hx-retarget": "this", "hx-reswap": "outerHTML" })
        .render('vendor-form-edit', { vendor, msg, isError, layout: false });
    }

    case "vendor-form-new": {
      return res
        .status(200)
        .render("vendor-form-new", { msg, isError, layout: false });
    }
  }

  res.status(500).json({ msg: "Something went wrong, try again later" });
}

module.exports = errorHandler;
