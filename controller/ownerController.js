const { Owner, Property } = require("../models");
const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");
const {
  findOwners,
  findOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
} = require("../utils/queries/owners");

async function renderOwners(req, res) {
  const owners = await findOwners();
  res.status(200).render("owner-aside", { owners, layout: false });
}

async function renderOneOwner(req, res) {
  const { id: owner_id } = req.params;
  const owner = await findOwnerById(owner_id);
  res.status(200).render("owner-id", { owner, layout: false });
}

async function renderNewOwnerForm(req, res) {
  res.status(200).render("owner-form-new", { layout: false });
}

async function renderNewOwnersList(req, res) {
  console.log(req.body);
  let {
    //changed to let to allow for automated corrections
    owner_first_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip,
  } = req.body;

  //validate letters only
  const namePattern = /^[a-zA-Z ]+$/;
  //validate properly formed email
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //validate proper street address
  const streetPattern = /^[a-zA-Z0-9. ]+$/;
  //validate two letter state
  const statePattern = /^[a-zA-Z]{2}$/;
  //validate zip is 5 digit number
  const zipPattern = /^\d{5}$/;

  //format name before sending to db
  owner_first_name =
    owner_first_name[0].toUpperCase() + owner_first_name.slice(1).toLowerCase();

  owner_last_name =
    owner_last_name[0].toUpperCase() + owner_last_name.slice(1).toLowerCase();

  //format the phone number as (XXX)XXX-XXXX
  owner_phone = owner_phone.replace(/[^0-9 ]/g, "");

  if (owner_phone.length > 10 || owner_phone.length < 10) {
    throw new BadRequestError(
      "owner-form-new",
      "Please enter a valid 10 digit phone number, no symbols or spaces",
    );
  }

  owner_phone =
    "(" +
    owner_phone.slice(0, 3) +
    ")" +
    owner_phone.slice(3, 6) +
    "-" +
    owner_phone.slice(6);

  //format city name
  owner_city = owner_city[0].toUpperCase() + owner_city.slice(1).toLowerCase();

  if (
    !(namePattern.test(owner_first_name) && namePattern.test(owner_last_name))
  ) {
    throw new BadRequestError(
      "owner-form-new",
      "Please enter your first and last name",
    );
  }

  if (!emailPattern.test(owner_email)) {
    throw new BadRequestError(
      "owner-form-new",
      "Please enter a valid email address",
    );
  }

  //validate that the email is unique
  const ownerData = await findOwners();
  for (x = 0; x < ownerData.length; x++) {
    if (owner_email === ownerData[x].owner_email) {
      throw new BadRequestError(
        "owner-form-new",
        "An owner with this email address already exists",
      );
    }
  }

  if (!streetPattern.test(owner_street)) {
    throw new BadRequestError(
      "owner-form-new",
      "Please enter a valid street address",
    );
  }

  if (!namePattern.test(owner_city)) {
    throw new BadRequestError(
      "owner-form-new",
      "Please enter a valid city name",
    );
  }

  if (!statePattern.test(owner_state)) {
    throw new BadRequestError(
      "owner-form-new",
      "Please enter a valid 2 letter state abbreviation",
    );
  }

  if (!zipPattern.test(owner_zip)) {
    throw new BadRequestError(
      "owner-form-new",
      "Please enter a valid 5 digit zip code",
    );
  }

  const owner = await createOwner({
    owner_first_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip,
  });

  res
    .status(200)
    .set("hx-trigger", "update-owners")
    .render("owner-form-edit", { owner, layout: false });
}

async function renderEditOwnerForm(req, res) {
  const { id } = req.params;
  const owner = await findOwnerById(id);
  res.status(200).render("owner-form-edit", { owner, layout: false });
}

async function renderUpdatedOwner(req, res) {
  let {
    owner_first_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip,
  } = req.body;
  const id = req.params.id;

  //validate letters only
  const namePattern = /^[a-zA-Z]+$/;
  //validate properly formed email
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //validate proper street address
  const streetPattern = /^[a-zA-Z0-9. ]+$/;
  //validate two letter state
  const statePattern = /^[a-zA-Z]{2}$/;
  //validate zip is 5 digit number
  const zipPattern = /^\d{5}$/;

  //format name before sending to db
  owner_first_name =
    owner_first_name[0].toUpperCase() + owner_first_name.slice(1).toLowerCase();

  owner_last_name =
    owner_last_name[0].toUpperCase() + owner_last_name.slice(1).toLowerCase();

  //format the phone number as (XXX)XXX-XXXX
  owner_phone = owner_phone.replace(/[^0-9 ]/g, "");

  if (owner_phone.length > 10 || owner_phone.length < 10) {
    throw new BadRequestError(
      "owner-form-edit",
      "Please enter a valid 10 digit phone number, no symbols or spaces",
      {owner_id: id}
    );
  }

  owner_phone =
    "(" +
    owner_phone.slice(0, 3) +
    ")" +
    owner_phone.slice(3, 6) +
    "-" +
    owner_phone.slice(6);

  //format city name
  owner_city = owner_city[0].toUpperCase() + owner_city.slice(1).toLowerCase();

  if (
    !(namePattern.test(owner_first_name) && namePattern.test(owner_last_name))
  ) {
    throw new BadRequestError(
      "owner-form-edit",
      "Please enter your first and last name",
      {owner_id: id}
    );
  }

  if (!emailPattern.test(owner_email)) {
    throw new BadRequestError(
      "owner-form-edit",
      "Please enter a valid email address",
      {owner_id: id}
    );
  }

  // validate that the email is unique
  const ownerData = await findOwners();
  for (x = 0; x < ownerData.length; x++) {
    if (owner_email === ownerData[x].owner_email) {
      throw new BadRequestError(
        "owner-form-edit",
        "An owner with this email address already exists",
        {owner_id: id}
      );
    }
  }

  if (!streetPattern.test(owner_street)) {
    throw new BadRequestError(
      "owner-form-edit",
      "Please enter a valid street address",
      {owner_id: id}
    );
  }

  if (!namePattern.test(owner_city)) {
    throw new BadRequestError(
      "owner-form-edit",
      "Please enter a valid city name",
      {owner_id: id}
    );
  }

  if (!statePattern.test(owner_state)) {
    throw new BadRequestError(
      "owner-form-edit",
      "Please enter a valid 2 letter state abbreviation",
      {owner_id: id}
    );
  }

  if (!zipPattern.test(owner_zip)) {
    throw new BadRequestError(
      "owner-form-edit",
      "Please enter a valid 5 digit zip code",
      {owner_id: id}
    );
  }

  await updateOwner(id, {
    owner_first_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip,
  });

  const owner = await findOwnerById(id);

  res
    .status(200)
    .set("hx-trigger", "update-owners")
    .render("owner-id", { owner, layout: false });
}

async function renderDeletedOwner(req, res) {
  const { id: owner_id } = req.params;
  const owner = await deleteOwner(owner_id);
  res.status(200).set("hx-trigger", "update-owners").send("");
}

module.exports = {
  renderOneOwner,
  renderOwners,
  renderNewOwnersList,
  renderUpdatedOwner,
  renderDeletedOwner,
  renderNewOwnerForm,
  renderEditOwnerForm,
};
