const { Vendor, Issue, Property, Task } = require('../../models');
const { NotFoundError, BadRequestError, InternalServerError } = require('../errors/index');
const { Op } = require('sequelize');

async function findAllIssues() {
  const issues = await Issue.findAll({
    include: [
      { model: Property },
      { model: Task },
    ],
  });

  if (!issues) {
    throw new NotFoundError('No issues found');
  }
  // console.log(issues.map((e) => e.toJSON()));
  return issues.map((e) => e.toJSON());
};

async function findOpenIssues() {
  const issues = await Issue.findAll({
    where: { issue_isDone: false },
    include: [
      { model: Property },
      { model: Task}
    ],
  });

  if (!issues) {
    throw new NotFoundError('No issues found');
  }
  // console.log(issues);
  return issues.map((e) => e.toJSON());
}

async function findClosedIssues() {
  const issues = await Issue.findAll({
    where: { issue_isDone: true},
    include: [
      { model: Property },
      { model: Task}
    ],
  });
  if (!issues) {
    throw new NotFoundError('No issues found');
  }
  // console.log(issues);
  return issues.map((e) => e.toJSON());
}

async function findOpenIssuesVendor(id) {
  const issuesData = await Issue.findAll({
    where: { issue_isDone: false, },
    include: [{ model: Vendor, attributes:['vendor_id']}]
  })

  const issues = issuesData.map(e => e.toJSON());
  // console.log(issues);
  // console.log(id);
  // console.log(issues.filter(issue => !issue.Vendors.some(vendor => vendor.vendor_id === id)));
  return issues.filter(issue => !issue.Vendors.some(vendor => vendor.vendor_id === id));
}
// findOpenIssuesVendor(1);

async function getIssuesByPropertyID(property_id) {
  const issues = await Issue.findAll({
    where: {property_id},
    include: [
    { model: Property },
    { model: Task },
    ],
  });

  if (!issues) {
    throw new NotFoundError('No issues found');
  }
  //console.log(issues);
  return issues.map((e) => e.toJSON());
};

async function findOneIssue(issue_id) {
  const issue = await Issue.findByPk(issue_id, {
    include: [
      { model: Property, },
      { model: Task, },
      { model: Vendor, },
    ],
  });

  if (!issue) {
    throw new NotFoundError(`No issue found wtih id ${issue_id}`);
  }
  // console.log(issue);
  return issue.toJSON();
};

async function createIssue(issueData) {
  const issue = await Issue.create(issueData);

  if (!issue) {
    throw new InternalServerError("Couldn't create an issue");
  }
  // console.log(issue);
  return issue.toJSON();
};

async function updateIssue(issue_id, issueData) {
  const issue = await Issue.update(issueData, {
    where: { issue_id }
  });

  if (!issue) {
    throw new BadRequestError(`Couldn't update issue with id ${issue_id}`);
  }
  // console.log(issue);
  return issue;
};

async function deleteIssue(issue_id) {
  console.log(issue_id);
  const issue = await Issue.destroy({ where: { issue_id } });

  if (!issue) {
    throw new BadRequestError(`Couldn't delete issue with id ${issue_id}`);
  }
  // console.log(issue);
  return issue;
};

async function addVendorToIssue(issue_id, vendor_id) {
  const issue = await Issue.findByPk(issue_id);

  if (!issue) {
    throw new BadRequestError(`No issue found with id ${issue_id}`);
  }

  const result = await issue.addVendor(vendor_id);

  // console.log(result);
  return result;
};

async function updateIssueDone(issue_id, issue_isDone) {
  const issue = await Issue.update({issue_isDone}, { where: { issue_id }});

  if (!issue) {
    throw new InternalServerError(`Couldn't update Issue isDone with data ${issue_id}`);
  }
  // console.log(issue);
  return issue;
}

module.exports = {
  findAllIssues,
  findOpenIssues,
  findClosedIssues,
  findOneIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  addVendorToIssue,
  getIssuesByPropertyID,
  updateIssueDone,
  findOpenIssuesVendor,
}