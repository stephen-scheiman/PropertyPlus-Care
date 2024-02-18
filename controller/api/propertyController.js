const { Property, Owner, Issue } = require('../../models');
const { BadRequestError, InternalServerError } = require('../../utils/errors');

/* for purposes of unit testing, separating sequelize request function
from render data functions */
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

// render data function
async function renderProperties(req, res) {
  const properties = await getAllProperties();  
  res.status(200).json({ properties });
};

// sequelize request function
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

// render data funciton
async function renderOneProperty(req, res) {
  const { id: property_id } = req.params;
  const properties = await getPropertyByID(property_id);  
  res.status(200).json({ properties });
};

async function createProperty(req, res) {
  const { property_name, property_street, property_city, property_state, property_zip, owner_id } = req.body;
  // for owner_id, in front end, we need to present user with a list of potential owners to associate
  // with this property, then transfer the id of the selected owner into here
  // this means that before someone can add a new property, they have to first add the new Owner so...
  if (!owner_id) {
    throw new BadRequestError("You must select an existing property owner.");
  };

  if (!(property_name && property_street && property_city && property_state && property_zip && owner_id)) {
    throw new BadRequestError("Missing Data - Please complete all fields");
  }

  const newProperty = await Property.create({
    property_name,
    property_street,
    property_city,
    property_state,
    property_zip,
    owner_id
  });

  if (!newProperty) {
    throw new InternalServerError("New Property creation failed.");
  } else {
    res.status(200).json({ msg: "New Property succesfully created!" });
  };
};

async function updateProperty(req, res) {

};

async function deleteProperty(req, res) {
  const property_id = req.params.id;

  const propDelData = await Property.destroy({
    where: {
      property_id
    }
  });

  if (!propDelData) {
    throw new BadRequestError("Delete property failed");
  } else {
    res.status(200).json({ msg: `Delete property ${propery_id} succeeded`});
  }
};

// is this the correct export for all controller files?
module.exports = {
  renderProperties,
  renderOneProperty,
  createProperty,
  updateProperty,
  deleteProperty
};