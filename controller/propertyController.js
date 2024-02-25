const { Property, Owner, Issue } = require("../models");
const { BadRequestError, InternalServerError } = require("../utils/errors");
const {
  findProperties,
  findPropertyByID,
} = require("../utils/queries/properties");

async function renderProperties(req, res) {
  const properties = await findProperties();
  console.log(properties);
  // res.status(200).json({ owners });
  res.status(200).render('property-aside', { properties, layout: false });
}

async function renderOneProperty(req, res) {
  const { id: property_id } = req.params;
  const property = await findPropertyByID(property_id);
  //res.status(200).json({ owner });
  res.status(200).render("property-id", { property, layout: false });
}

async function renderNewPropertyForm(req, res) {
  res.status(200).render("property-form-new", { layout: false });
}

async function renderNewPropertiesList(req, res) {
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
  for (x = 0; x < propertyNames.length; x++) {
    if (property_name === propertyNames[x].property_name) {
      throw new BadRequestError("Please enter a unique property name");
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

  const newProperty = await createProperty({
    property_name,
    property_street,
    property_city,
    property_state,
    property_zip,
    owner_id,
  });
  console.log(newProperty);
  res
    .status(200)
    .set("hx-trigger", "update-list")
    .render("property-id", { newProperty, layout: false });
}

async function renderEditPropertyForm(req, res) {
  const { id } = req.params;
  const property = await findPropertyByID(id);
  res.status(200).render("property-form-edit", { property, layout: false });
}

async function renderUpdatedProperty(req, res) {
  const id = req.params.id;
  let {
    property_name,
    property_street,
    property_city,
    property_state,
    property_zip,
    owner_id,
  } = req.body;
console.log(req.body);
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

  const property = await updateProperty(id,
    {
      property_name,
      property_street,
      property_city,
      property_state,
      property_zip,
      owner_id,
    },
  );
    res
      .status(200)
      .json({ msg: `Update property ID: ${id} succeeded` });
}

async function renderDeletedProperty(req, res) {
  const { id: property_id } = req.params;
  const property = await deleteProperty(property_id);
  res.status(200).json({ msg: "Deleted", property });
}

async function createProperty(newPropertyData) {
  const property = await Property.create(newPropertyData);

  if (!property) {
    throw new InternalServerError("Error creating new owner");
  }

  return property.toJSON();
}

async function updateProperty(property_id, propertyData) {
  const property = await Property.update(propertyData, {
    where: { property_id },
  });

  if (!property) {
    throw new InternalServerError("Couldn't update property information");
  }

  return property;
}

async function deleteProperty(property_id) {
  const property = await Property.destroy({ where: { property_id } });

  if (!property) {
    throw new InternalServerError(`Couldn't delete owner with id ${property_id}`);
  }

  return property;
}

module.exports = {
  renderProperties,
  renderOneProperty,
  renderUpdatedProperty,
  renderNewPropertyForm,
  renderEditPropertyForm,
  renderNewPropertiesList,
  renderDeletedProperty
};
