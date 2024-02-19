const { Vendor, Issue } = require("../../models");
const { BadRequestError, InternalServerError } = require("../../utils/errors");

/* for purposes of unit testing, separating sequelize request function
from render data functions */

// sequelize get all vendors
async function getAllVendors() {
  const vendorData = Vendor.findAll({
    include: [{ model: Issue }],
    raw: true,
    // nest: true,
  });

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

// get vendor by ID
async function getVendorByID(id) {
  const vendorData = Vendor.findByPk(id, {
    include: [{ model: Issue }],
    raw: true,
  });

  if (!vendorData) {
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

//create new vendor
async function createVendor(req,res) {
  const {
    vendor_first_name,
    vendor_last_name,
    vendor_trade,
    vendor_email,
    vendor_phone,
  } = req.body;

  if (
    !(
      vendor_first_name &&
      vendor_last_name &&
      vendor_trade &&
      vendor_email &&
      vendor_phone
    )
  ) {
    throw new BadRequestError("Missing Data - Please complete all fields");
  }

  const newVendor = await Vendor.create({
    vendor_first_name,
    vendor_last_name,
    vendor_trade,
    vendor_email,
    vendor_phone,
  });

  if (!newVendor) {
    throw new InternalServerError("New Vendor creation failed.");
  } else {
    res.status(200).json({ msg: "New Vendor succesfully created!" });
  }
}

module.exports = { renderVendors, renderOneVendor, createVendor };
