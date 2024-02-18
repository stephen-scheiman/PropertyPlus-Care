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
};

// render vendor data function
async function renderVendors(req, res) {
    const vendors = await getAllVendors();
    res.status(200).json({ vendors });
};

// get vendor by ID
async function getVendorByID(id) {
    const vendorData = Vendor.findByPk(id);

if (!vendorData){
    throw new BadRequestError("Something went wrong");
}

    return vendorData;
}

// render vendor by ID function
async function renderOneVendor(req, res) {
    const { id: vendor_id } = req.params;
    const vendor = await getVendorByID(vendor_id);
    res.status(200).json({ vendor });
  }

  module.exports = { renderVendors, renderOneVendor };