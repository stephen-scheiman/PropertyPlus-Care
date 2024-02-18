const { Vendor } = require("../../models");
const { BadRequestError, InternalServerError } = require("../../utils/errors");

/* for purposes of unit testing, separating sequelize request function
from render data functions */

// sequelize get all vendors
async function getAllVendors() {
    const vendorData = Vendor.findAll();

if (!vendorData) {
    throw new BadRequestError("Something went wrong");
    }

    return vendorData;
}

// render vendor data function
async function renderVendors(req, res) {
    const vendors = await getAllVendors();
    res.status(200).json({ vendors });
  }

  module.exports = { renderVendors };