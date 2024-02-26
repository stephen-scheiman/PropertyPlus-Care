const { BadRequestError } = require("../utils/errors");
const { findAllVendors, findVendorByID, addIssueToVendor, findVendorsByTrade, createVendor, updateVendor, deleteVendor, searchVendors } = require('../utils/queries/vendors');
const { findOpenIssuesVendor, findOpenIssues } = require('../utils/queries/issues');

// render vendor data function
async function renderVendors(req, res) {
  const vendors = await findAllVendors();
  // res.status(200).json({ vendors });
  res.status(200).render('vendor-aside', { vendors, layout: false });
}

// render vendor by ID function
async function renderOneVendor(req, res) {
  const { id } = req.params;

  const p1 = findVendorByID(id);
  const p2 = findOpenIssuesVendor(+id);
  const [vendor, issues] = await Promise.all([p1, p2]);

  res.status(200).render('vendor-id', { vendor, issues, layout: false });
}

async function renderVendorNewIssue(req, res) {
  const { id: vendor_id } = req.params;
  const { issue_id } = req.body;

  await addIssueToVendor(vendor_id, issue_id);

  const p1 = findVendorByID(vendor_id);
  const p2 = findOpenIssuesVendor(+vendor_id);
  const [vendor, issues] = await Promise.all([p1, p2]);

  res.status(200).render('vendor-id', { vendor, issues, layout: false });
}

async function renderVendorsByTrade(req, res) {
  const { vendor_trade } = req.query;

  const vendors = vendor_trade === 'All' ? await findAllVendors() : await findVendorsByTrade(vendor_trade);

  res.status(200).render('vendor-aside', { vendors, layout: false });
}

async function renderNewVendorForm(req, res) {
  res.status(200).render('vendor-form-new', { layout: false });
}

async function renderNewVendorsList(req, res) {
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
   if (!(namePattern.test(vendor_first_name) && namePattern.test(vendor_last_name))) {
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
  const vendorData = await findAllVendors();
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

  const p1 = createVendor({
    vendor_first_name,
    vendor_last_name,
    vendor_trade,
    vendor_email,
    vendor_phone,
  });
  const p2 = findOpenIssues();

  const [vendor, issues] = await Promise.all([p1, p2]);

  res.status(200).set('hx-trigger', 'update-vendors').render('vendor-id', { vendor, issues, layout: false });
}

async function renderEditVendorForm(req, res) {
  const { id } = req.params;
  const vendor = await findVendorByID(id);
  res.status(200).render('vendor-form-edit', { vendor, layout: false });
}

async function renderUpdatedVendor(req, res) {
  const vendor_id = req.params.id;
  let {
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
    throw new BadRequestError(
      'vendor-form-edit',
      "Please enter the vendor's first and last name",
      {vendor_id}
    );
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
      throw new BadRequestError(
        'vendor-form-edit',
        "Please enter a valid email address",
        {vendor_id}
      );
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
    throw new BadRequestError(
      'vendor-form-edit',
      "Please enter a valid 10 digit phone number, no symbols or spaces",
      {vendor_id}
    );
  }

  vendor_phone =
    "(" +
    vendor_phone.slice(0, 3) +
    ")" +
    vendor_phone.slice(3, 6) +
    "-" +
    vendor_phone.slice(6);

  await updateVendor(vendor_id,
    {
      vendor_first_name,
      vendor_last_name,
      vendor_trade,
      vendor_email,
      vendor_phone,
    }
  );

  const vendor = await findVendorByID(vendor_id);

  res.status(200).set('hx-trigger', 'update-vendors').render('vendor-id', { vendor, layout: false });
}

async function renderDeletedVendor(req, res) {
  const { id } = req.params;
  await deleteVendor(id);

  res.status(200).set('hx-trigger', 'update-vendors').send('');
}

async function renderVendorSearch(req, res) {
  const { search } = req.body;
  const vendors = await searchVendors(search.toLowerCase());

  res.status(200).render('vendor-aside', { vendors, layout: false });
}

module.exports = {
  renderVendors,
  renderOneVendor,
  renderVendorNewIssue,
  renderVendorsByTrade,
  renderNewVendorForm,
  renderNewVendorsList,
  renderUpdatedVendor,
  renderEditVendorForm,
  renderDeletedVendor,
  renderVendorSearch,
};
