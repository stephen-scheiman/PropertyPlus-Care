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
async function createVendor(req, res) {
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

//delete vendor
async function deleteVendor(req, res) {
  const vendor_id = req.params.id;

  const vendorDelData = await Vendor.destroy({
    where: {
      vendor_id,
    },
  });
  if (!vendorDelData) {
    throw new BadRequestError("Delete vendor failed");
  } else {
    res.status(200).json({ msg: `Delete vendor ID: ${vendor_id} succeeded` });
  }
}

//update vendor
async function updateVendor(req, res) {
  const vendor_id = req.params.id;
  const {
    vendor_first_name,
    vendor_last_name,
    vendor_trade,
    vendor_email,
    vendor_phone,
  } = req.body;

  const vendorData = await Vendor.update(
    {
      vendor_first_name,
      vendor_last_name,
      vendor_trade,
      vendor_email,
      vendor_phone,
    },
    {
      where: {
        vendor_id,
      },
    },
  );
  if (!vendorData[0]) {
    throw new BadRequestError("Update vendor failed");
  } else {
    res.status(200).json({ msg: `Update vendor ID: ${vendor_id} succeeded` });
  }
};

module.exports = { renderVendors, renderOneVendor, createVendor, deleteVendor, updateVendor };
