const { Property, Owner } = require('../../models');

// insert .get / .post etc methods here as appropriate
async function getAllProperties(req, res) {
  // what do we need?
  // property id, name, address, owner
  const propertyData = Property.findAll({
    include: [{
      model: Owner,
      attributes: ["owner_id", "owner_name",]

    }],
    raw: true,
    nest: true
  });


};

async function getPropertyByID(req, res) {
  // property name, address, owner, issues
};

async function createProperty(req, res) {

};

async function updateProperty(req, res) {

};

async function deleteProperty(req, res) {

};

// is this the correct export for all controller files?
module.export = {
  getAllProperties,
  getPropertyByID,
  createProperty,
  updateProperty,
  deleteProperty
};