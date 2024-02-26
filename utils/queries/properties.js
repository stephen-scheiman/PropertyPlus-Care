const { Op } = require('sequelize');
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
        }, required: false,
      }
    ],
  });

  if (!property) {
    throw new NotFoundError(`Couldn't find property with id ${property_id}`);
  }
  // console.log(property.toJSON())
  return property.toJSON();
};

async function createProperty(propertyData) {
  const property = await Property.create(propertyData);

  if (!property) {
    throw new InternalServerError(`Couldn't create new property with ${propertyData}`);
  }
  // console.log(property);
  return property.toJSON()
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

async function searchProperties(search) {
  const result = await Property.findAll({
    where: {
      [Op.or]: [
        { property_name: { [Op.like]: `%${search}%` } },
        { property_street: { [Op.like]: `%${search}%` } },
        { property_city: { [Op.like]: `%${search}%` } },
        { property_state: { [Op.like]: `%${search}%` } },
        { property_zip: { [Op.like]: `%${search}%` } },
      ]
    }
  });

  const properties = result.map(e => e.toJSON());

  return properties;
}

module.exports = {
  findProperties,
  findPropertyByID,
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties,

}