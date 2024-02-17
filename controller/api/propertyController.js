const { Property, Owner, Issue } = require('../../models');
const { BadRequestError } = require('../../utils/errors');

async function getAllProperties() {
  const propertyData = Property.findAll({
    include: [{
      model: Owner,
      attributes: ["owner_name",]
    }],
    raw: true,
    nest: true
  });

  if (!propertyData) {
    throw new BadRequestError('Something went wrong');
  }

  return propertyData;
};

async function renderProperties(req, res) {
  const properties = await getAllProperties();  
  res.status(200).json({ properties });
};

async function getPropertyByID(id) {
  const propertyData = Property.findByPk(id, {
    include: [
      { model: Owner },
      { model: Issue,
        attributes: { exclude: ['createdAt', 'updatedAt']}
      }
    ],
    raw: true,
    nest:true
  });
  
  if (!propertyData) {
    throw new BadRequestError('Something went wrong');
  }

  return propertyData;
};

async function renderOneProperty(req, res) {
  const { id: property_id } = req.params;
  const properties = await getPropertyByID(property_id);  
  res.status(200).json({ properties });
};

async function createProperty(req, res) {

};

async function updateProperty(req, res) {

};

async function deleteProperty(req, res) {

};

// is this the correct export for all controller files?
module.exports = {
  renderProperties,
  renderOneProperty,
  createProperty,
  updateProperty,
  deleteProperty
};