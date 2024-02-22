const { Vendor, Issue } = require("../../models");
const { BadRequestError, InternalServerError } = require("../errors");


async function getAllVendors() {
  const vendors = Vendor.findAll({
    include: [{ model: Issue }],
    raw: true,
    nest: true,
  });

  if (!vendors) {
    throw new InternalServerError("Couldn't find vendors");
  }
  // console.log(vendors);
  return vendors;
}

async function getVendorByID(id) {
  const vendor = Vendor.findByPk(id, {
    include: [{ model: Issue }],
    raw: true,
  });

  if (!vendor) {
    throw new InternalServerError(`Couldn't find vendor with id ${id}`);
  }
  // console.log(vendor);
  return vendor;
}

async function createVendor(vendorData) {
  const vendor = await Vendor.create(vendorData);

  if (!vendor) {
    throw new InternalServerError(`New Vendor creation failed. ${vendorData}`);
  }
  // console.log(vendor);
  return vendor;
}

//delete vendor
async function deleteVendor(vendor_id) {
  const vendor = await Vendor.destroy({ where: { vendor_id } });

  if (!vendor) {
    throw new InternalServerError(`Delete vendor failed id ${vendor_id}`);
  }
  // console.log(vendor);
  return vendor;
}

//update vendor
async function updateVendor(vendor_id, vendorData) {
  const vendor = await Vendor.update(vendorData, { where: { vendor_id } });

  if (!vendor[0]) {
    throw new InternalServerError(`Update vendor failed id ${vendor_id}`);
  }
  // console.log(vendor);
  vendor;
};

module.exports = { createVendor, deleteVendor, updateVendor };
