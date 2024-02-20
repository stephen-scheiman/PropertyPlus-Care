const { Vendor, Issue } = require("../models");
const { BadRequestError, InternalServerError } = require("../utils/errors");

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
  let {
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

  //validate letters only
  const namePattern = /^[a-zA-Z]+$/;
  if (
    !(namePattern.test(vendor_first_name) && namePattern.test(vendor_last_name))
  ) {
    throw new BadRequestError("Please enter the vendor's first and last name");
  }

  //format vendor name before sending to db
  vendor_first_name =
  vendor_first_name[0].toUpperCase() + vendor_first_name.slice(1).toLowerCase();

  vendor_last_name =
  vendor_last_name[0].toUpperCase() + vendor_last_name.slice(1).toLowerCase();

  //validate email formatting
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(vendor_email)) {
      throw new BadRequestError("Please enter a valid email address");
    }

  //validate that the email is unique
  const vendorData = await getAllVendors();
  for(x=0; x<vendorData.length; x++){
    if (vendor_email === vendorData[x].vendor_email){
      throw new BadRequestError("A vendor with this email address already exists")
    } 
  }
  
  //format the phone number as (XXX)XXX-XXXX
  vendor_phone = vendor_phone.replace(/[^0-9 ]/g, "");

  if (vendor_phone.length > 10 || vendor_phone.length < 10) {
    throw new BadRequestError("Please enter a valid 10 digit phone number, no symbols or spaces");
  }

  vendor_phone =
    "(" +
    vendor_phone.slice(0, 3) +
    ")" +
    vendor_phone.slice(3, 6) +
    "-" +
    vendor_phone.slice(6);

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

  //validate letters only
  const namePattern = /^[a-zA-Z]+$/;
  if (
    !(namePattern.test(vendor_first_name) && namePattern.test(vendor_last_name))
  ) {
    throw new BadRequestError("Please enter the vendor's first and last name");
  }

  //format vendor name before sending to db
  vendor_first_name =
  vendor_first_name[0].toUpperCase() + vendor_first_name.slice(1).toLowerCase();

  vendor_last_name =
  vendor_last_name[0].toUpperCase() + vendor_last_name.slice(1).toLowerCase();

  //validate email formatting
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(vendor_email)) {
      throw new BadRequestError("Please enter a valid email address");
    }

  //validate that the email is unique
  // const vendData = await getAllVendors();
  // for(x=0; x<vendData.length; x++){
  //   if (vendor_email === vendData[x].vendor_email){
  //     throw new BadRequestError("A user with this email address already exists")
  //   } 
  // }


  //format the phone number as (XXX)XXX-XXXX
  vendor_phone = vendor_phone.replace(/[^0-9 ]/g, "");

  if (vendor_phone.length > 10 || vendor_phone.length < 10) {
    throw new BadRequestError("Please enter a valid 10 digit phone number, no symbols or spaces");
  }

  vendor_phone =
    "(" +
    vendor_phone.slice(0, 3) +
    ")" +
    vendor_phone.slice(3, 6) +
    "-" +
    vendor_phone.slice(6);

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
