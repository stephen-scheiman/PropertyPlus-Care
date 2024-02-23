const { Property, Owner, Issue } = require("../models");
const { BadRequestError, InternalServerError } = require("../utils/errors");
const { findOwners } = require('../utils/queries/owners');
const { getAllProperties, getPropertyByID } = require("../utils/queries/properties");

// render data function
async function renderProperties(req, res) {
  const p1 = getAllProperties();
  const p2 = findOwners();

  const [properties, owners] = await Promise.all([p1, p2]);
     res.status(200).render("property-main", { properties, owners });
  // res.status(200).json({ properties });
}

// render data function
async function renderOneProperty(req, res) {
  const { id: property_id } = req.params;
  const property = await getPropertyByID(property_id);
 // res.status(200).json({ properties });
  res.status(200).render("property-id", { property, layout: false });
}

/* for purposes of unit testing, separating sequelize request function
from render data functions */
async function getAllProperties1() {
  const propertyData = Property.findAll({
    include: [
      {
        model: Owner,
      },
    ],
    raw: true,
    nest: true,
  });

  if (!propertyData) {
    throw new BadRequestError("Something went wrong");
  }

  return propertyData;
}

// sequelize request function
async function getPropertyByID1(id) {
  const propertyData = Property.findByPk(id, {
    include: [
      { model: Owner },
      { model: Issue, attributes: { exclude: ["createdAt", "updatedAt"] } },
    ],
    raw: true,
    nest: true,
  });

  if (!propertyData) {
    throw new BadRequestError("Something went wrong");
  }

  return propertyData;
}

async function createProperty(req, res) {
  // changed const to let in order to allow
  let {
    property_name,
    property_street,
    property_city,
    property_state,
    property_zip,
    owner_id,
  } = req.body;
  // for owner_id, in front end, we need to present user with a list of potential owners to associate
  // with this property, then transfer the id of the selected owner into here
  // this means that before someone can add a new property, they have to first add the new Owner so...
  if (!owner_id) {
    throw new BadRequestError("You must select an existing property owner.");
  }

  if (
    !(
      property_name &&
      property_street &&
      property_city &&
      property_state &&
      property_zip &&
      owner_id
    )
  ) {
    throw new BadRequestError("Missing Data - Please complete all fields");
  }

  //validate that property name contains only letters and spaces
  const propNamePattern = /^[a-zA-Z ]+$/;
  if (!propNamePattern.test(property_name)) {
    throw new BadRequestError(
      "Please enter a valid property name, letters and spaces only",
    );
  }

  //validate that the property name is unique
  const propertyNames = await getAllProperties();
  for(x=0; x<propertyNames.length; x++){
    if (property_name === propertyNames[x].property_name){
      throw new BadRequestError("Please enter a unique property name")
    }
  }

  //validate proper street address
  const streetPattern = /^[a-zA-Z0-9. ]+$/;
  if (!streetPattern.test(property_street)) {
    throw new BadRequestError("Please enter a valid street address");
  }

  //format city name
  property_city =
    property_city[0].toUpperCase() + property_city.slice(1).toLowerCase();

  //validate letters only in city name
  const namePattern = /^[a-zA-Z]+$/;
  if (!namePattern.test(property_city)) {
    throw new BadRequestError("Please enter a valid city name");
  }

  //validate two letter state
  const statePattern = /^[a-zA-Z]{2}$/;
  if (!statePattern.test(property_state)) {
    throw new BadRequestError(
      "Please use the proper, two letter state abbreviation",
    );
  }

  //validate zip is 5 digit number
  const zipPattern = /^\d{5}$/;
  if (!zipPattern.test(property_zip)) {
    throw new BadRequestError("Please use a proper, five digit zip code");
  }

  // convert state abbreviation to upper case
  property_state = property_state.toUpperCase();

  const newProperty = await Property.create({
    property_name,
    property_street,
    property_city,
    property_state,
    property_zip,
    owner_id,
  });

  if (!newProperty) {
    throw new InternalServerError("New Property creation failed.");
  } else {
    res.status(200).json({ msg: "New Property succesfully created!" });
  }
}

async function updateProperty(req, res) {
  const property_id = req.params.id;
  let {
    property_name,
    property_street,
    property_city,
    property_state,
    property_zip,
    owner_id,
  } = req.body;

  if (
    !(
      property_name &&
      property_street &&
      property_city &&
      property_state &&
      property_zip &&
      owner_id
    )
  ) {
    throw new BadRequestError("Missing Data - Please complete all fields");
  }

  //validate that property name contains only letters and spaces
  const propNamePattern = /^[a-zA-Z ]+$/;
  if (!propNamePattern.test(property_name)) {
    throw new BadRequestError(
      "Please enter a valid property name, letters and spaces only",
    );
  }

  //validate that the property name is unique
  //
  //commented out for update until discussed with team
  //
  // const propertyNames = await getAllProperties();
  // for(x=0; x<propertyNames.length; x++){
  //   if (property_name === propertyNames[x].property_name){
  //     throw new BadRequestError("Please enter a unique property name")
  //   }
  // }

  //validate proper street address
  const streetPattern = /^[a-zA-Z0-9. ]+$/;
  if (!streetPattern.test(property_street)) {
    throw new BadRequestError("Please enter a valid street address");
  }

  //format city name
  property_city =
    property_city[0].toUpperCase() + property_city.slice(1).toLowerCase();
  //validate letters only
  const namePattern = /^[a-zA-Z]+$/;
  if (!namePattern.test(property_city)) {
    throw new BadRequestError("Please enter a valid city name");
  }

  //validate two letter state
  const statePattern = /^[a-zA-Z]{2}$/;
  if (!statePattern.test(property_state)) {
    throw new BadRequestError(
      "Please use the proper, two letter state abbreviation",
    );
  }

  //validate zip is 5 digit number
  const zipPattern = /^\d{5}$/;
  if (!zipPattern.test(property_zip)) {
    throw new BadRequestError("Please use a proper, five digit zip code");
  }

  // convert state abbreviation to upper case
  property_state = property_state.toUpperCase();

  const propData = await Property.update(
    {
      property_name,
      property_street,
      property_city,
      property_state,
      property_zip,
      owner_id,
    },
    {
      where: {
        property_id,
      },
    },
  );

  if (propData[0] === 0) {
    throw new BadRequestError("Update property failed");
  } else {
    res
      .status(200)
      .json({ msg: `Update property ID: ${property_id} succeeded` });
  }
}

async function deleteProperty(req, res) {
  const property_id = req.params.id;

  const propDelData = await Property.destroy({
    where: {
      property_id,
    },
  });

  if (!propDelData) {
    throw new BadRequestError("Delete property failed");
  } else {
    res
      .status(200)
      .json({ msg: `Delete property ID: ${property_id} succeeded` });
  }
}

module.exports = {
  renderProperties,
  renderOneProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
