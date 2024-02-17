const { Property } = require('../../models');

// insert .get / .post etc routes here as appropriate
async function getAllProperties() {
  const propertyData = Property.findAll();
};

// is this the correct export for all controller files?
// module.export = //function ;