const { Property, Owner, Issue } = require('../../models');
const { InternalServerError, NotFoundError } = require('../errors');

async function findProperties() {
  const properties = await Property.findAll({
    include: [{
      model: Owner,
    }],
  });

  if (!properties) {
    throw new NotFoundError(`Couldn't find properties`);
  }
  return properties.map(e => e.toJSON());
};

async function findPropertyByID(property_id) {
  const property = await Property.findByPk(property_id, {
    include: [
      { model: Owner },
      { model: Issue,
        where: {
          property_id
        },
      }
    ],
  });

  if (!property) {
    throw new NotFoundError(`Couldn't find property with id ${property_id}`);
  }
  console.log(property.toJSON())
  return property.toJSON();
};

async function createProperty(propertyData) {
  const property = await Property.create(propertyData);

  if (!property) {
    throw new InternalServerError(`Couldn't create new property with ${propertyData}`);
  }
  // console.log(property);
  return property
};

async function updateProperty(property_id, propertyData) {
  const property = await Property.update(propertyData, {where: {property_id}});

  if (property[0] === 0) {
    throw new InternalServerError(`Couldn't update property with id ${property_id}`);
  }
  // console.log(property);
  return property;
};

async function deleteProperty(property_id) {
  const property = await Property.destroy({ where: { property_id } });

  if (!property) {
    throw new InternalServerError(`Couldn't delete property with id ${property_id}`);
  }
  // console.log(property);
  return property;
};

module.exports = {
  findProperties,
  findPropertyByID,
  createProperty,
  updateProperty,
  deleteProperty,

}