const { Owner, Property } = require("../models");
const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");

async function renderAllOwners(req, res) {
  const owners = await findOwners();
  res.status(200).json({ owners });
}

async function renderOneOwner(req, res) {
  const { id: owner_id } = req.params;

  const owner = await findOwnerById(owner_id);

  res.status(200).json({ owner });
}

async function renderNewOwner(req, res) {
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
  const namePattern = /^[a-zA-Z]+$/;
  //validate properly formed email
  const emailPattern = /^ [a-zA-Z0-9._-]+@ [a-zA-Z0-9.-]+\\. [a-zA-Z] {2,6}$/;
  //validate properly formed phone number
  const phonePattern = /^(?:(\d{3}))?[- ]?(\d{3})[- ]?(\d{4,6})$/im;
  //validate proper street address
  const streetPattern = /^[a-zA-Z0-9.]+$/;
  //validate two letter state
  const statePattern = /^[a-zA-Z]{2}$/;
  //validate zip is 5 digit number
  const zipPattern = /^\d{5}$/;

  //format name before sending to db
  owner_first_name =
    owner_first_name[0].toUpperCase() + owner_first_name.slice(1).toLowerCase();
  console.log(owner_first_name);
  owner_last_name =
    owner_last_name[0].toUpperCase() + owner_last_name.slice(1).toLowerCase();
  console.log(owner_last_name);
  //format the phone number as (XXX)XXX-XXXX
  owner_phone = owner_phone.replace(/[^a-zA-Z0-9 ]/g, "");
  owner_phone =
    "(" +
    owner_phone.slice(0, 3) +
    ")" +
    owner_phone.slice(3, 6) +
    "-" +
    owner_phone.slice(6);
  console.log(owner_phone);

  if (
    !(
      namePattern.test(owner_first_name) &&
      namePattern.test(owner_last_name) &&
      emailPattern.test(owner_email) /* &&
      phonePattern.test(owner_phone) &&
      streetPattern.test(owner_street) &&
      namePattern.test(owner_city) &&
      statePattern.test(owner_state) &&
      zipPattern.test(owner_zip)*/
    )
  ) {
    throw new BadRequestError("Missing data, please fill out all forms");
  }

  const newOwner = await createOwner({
    owner_first_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip,
  });

  res.status(200).json({ msg: "created", newOwner });
}

async function renderUpdateOwner(req, res) {
  const {
    owner_fist_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip,
  } = req.body;
  const id = req.params.id;

  const owner = await updateOwner(id, {
    owner_fist_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip,
  });

  res.status(200).json({ msg: "updated", owner });
}

async function renderDeleteOwner(req, res) {
  const { id: owner_id } = req.params;
  const owner = await deleteOwner(owner_id);
  res.status(200).json({ msg: "Deleted", owner });
}

async function findOwners() {
  const owners = await Owner.findAll({
    raw: true,
    nest: true,
  });

  if (!owners) {
    throw new NotFoundError("No owners found");
  }
  return owners;
}

async function findOwnerById(id) {
  const owner = await Owner.findByPk(id, {
    include: [
      {
        model: Property,
      },
    ],
  });

  if (!owner) {
    throw new BadRequestError("No owner found");
  }
  return owner.toJSON();
}

async function createOwner(newOwnerData) {
  const owner = await Owner.create(newOwnerData);

  if (!owner) {
    throw new InternalServerError("Error creating new owner");
  }

  return owner.toJSON();
}

async function updateOwner(owner_id, ownerData) {
  const owner = await Owner.update(ownerData, {
    where: { owner_id },
  });

  if (!owner) {
    throw new InternalServerError("Couldn't update owner information");
  }

  return owner;
}

async function deleteOwner(owner_id) {
  const owner = await Owner.destroy({ where: { owner_id } });

  if (!owner) {
    throw new InternalServerError(`Couldn't delete owner with id ${owner_id}`);
  }

  return owner;
}

module.exports = {
  renderOneOwner,
  renderAllOwners,
  renderNewOwner,
  renderUpdateOwner,
  renderDeleteOwner,
};
