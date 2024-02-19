const { Owner, Property } = require('../models');
const { InternalServerError, NotFoundError, BadRequestError } = require('../utils/errors');


async function renderAllOwners(req, res) {
  const owners = await findOwners();
  res.status(200).json({ owners });
};

async function renderOneOwner(req, res) {
  const { id: owner_id } = req.params;

  const owner = await findOwnerById(owner_id);

  res.status(200).json({owner});
};

async function renderNewOwner(req, res) {
  console.log(req.body);
  const {
    owner_first_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip
  } = req.body;

  if (!(owner_first_name && owner_last_name && owner_email && owner_phone && owner_street && owner_city && owner_state && owner_zip)) {
    throw new BadRequestError('Missing data, please fill out all forms');
  }

  const newOwner = await createOwner({
    owner_first_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip
  });

  res.status(200).json({ msg: 'created', newOwner });
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
    owner_zip
  } = req.body;
  const id = req.params.id;

  const owner = await updateOwner(
    id, {
    owner_fist_name,
    owner_last_name,
    owner_email,
    owner_phone,
    owner_street,
    owner_city,
    owner_state,
    owner_zip
  });

  res.status(200).json({ msg:'updated', owner });
}

async function renderDeleteOwner(req, res) {
  const { id: owner_id } = req.params;
  const owner = await deleteOwner(owner_id);
  res.status(200).json({ msg:'Deleted', owner });
}

async function findOwners() {
  const owners = await Owner.findAll({
    raw: true,
    nest: true,
  });

  if (!owners) {
    throw new NotFoundError('No owners found');
  }
  return owners;
};

async function findOwnerById(id) {
  const owner = await Owner.findByPk(id, {
    include: [{
      model: Property,
    }],
  });

  if (!owner) {
    throw new BadRequestError('No owner found');
  }
  return owner.toJSON();
};

async function createOwner(newOwnerData) {
  const owner = await Owner.create(newOwnerData);

  if (!owner) {
    throw new InternalServerError('Error creating new owner');
  }

  return owner.toJSON();
}

async function updateOwner(owner_id, ownerData) {
  const owner = await Owner.update(ownerData, {
    where: { owner_id }
  });

  if (!owner) {
    throw new InternalServerError("Couldn't update owner information")
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
}
