const { Owner, Property } = require("../../models");
const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

async function findOwners() {
  const owners = await Owner.findAll({
    raw: true,
    nest: true,
  });

  if (!owners) {
    throw new NotFoundError("No owners found");
  }
  // console.log(owners);
  return owners;
};

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
  // console.log(owner);
  return owner.toJSON();
};

async function createOwner(newOwnerData) {
  const owner = await Owner.create(newOwnerData);

  if (!owner) {
    throw new InternalServerError("Error creating new owner");
  }
  // console.log(owner);
  return owner.toJSON();
};

async function updateOwner(owner_id, ownerData) {
  const owner = await Owner.update(ownerData, {
    where: { owner_id },
  });

  if (!owner) {
    throw new InternalServerError("Couldn't update owner information");
  }
  // console.log(owner);
  return owner;
};

async function deleteOwner(owner_id) {
  const owner = await Owner.destroy({ where: { owner_id } });

  if (!owner) {
    throw new InternalServerError(`Couldn't delete owner with id ${owner_id}`);
  }
  // console.log(owner);
  return owner;
};

module.exports = {
  findOwnerById,
  findOwners,
  createOwner,
  updateOwner,
  deleteOwner,

}