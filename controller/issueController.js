
const { Vendor, Issue, Property, Task } = require('../models');
const { NotFoundError, InternalServerError, BadRequestError } = require('../utils/errors');

async function renderIssues(req, res) {
  const issues = await findAllIIssues();
  res.status(200).json({ msg: 'Success', issues });
};

async function renderOneIssue(req, res) {
  const { id: issue_id } = req.params;
  const issue = await findOneIssue(issue_id);
  res.status(200).json({ msg: 'Success', issue });
};

async function renderNewIssue(req, res) {
  const {
    issue_title,
    issue_description,
    property_id
  } = req.body;

  const issue = await createIssue({
    issue_title,
    issue_description,
    property_id
  });

  res.status(200).json({ msg: 'Created', issue });
};

async function renderUpdatedIssue(req, res) {
  const issue_id = req.params.id;
  const {
    issue_title,
    issue_description,
    property_id
  } = req.body;

  const issue = await updateIssue(issue_id, {
    issue_title,
    issue_description,
    property_id
  });

  res.status(200).json({ msg: "Updated", issue });
};

async function renderDeletedIssue(req, res) {
  const issue_id = req.params.id;

  const issue = await deleteIssue(issue_id);
  res.status(200).json({ msg: "Deleted", issue });
};

async function renderAddVendor(req, res) {
  const issue_id = req.params.id;
  const { vendor_id } = req.body;

  const result = await addVendorToIssue(issue_id, vendor_id);
  res.status(200).json({ msg: "Vendor added", result });
};

async function findAllIIssues() {
  const issues = await Issue.findAll({
    include: [{
      model: Property,
    }],
    raw: true,
    nest: true,
  });

  if (!issues) {
    throw new NotFoundError('No issues found');
  }

  return issues;
}

async function findOneIssue(issue_id) {
  const issue = await Issue.findByPk(issue_id, {
    include: [
      { model: Property, },
      { model: Task, },
      { model: Vendor, },
    ],
    raw: true,
    nest: true,
  });

  if (!issue) {
    throw new NotFoundError(`No issue found wtih id ${issue_id}`);
  }

  return issue;
}

async function createIssue(issueData) {
  const issue = await Issue.create(issueData);

  if (!issue) {
    throw new InternalServerError("Couldn't create an issue");
  }

  return issue.toJSON();
}

async function updateIssue(issue_id, issueData) {
  const issue = await Issue.update(issueData, {
    where: { issue_id }
  });

  if (!issue) {
    throw new BadRequestError(`Couldn't update issue with id ${issue_id}`);
  }

  return issue;
}

async function deleteIssue(issue_id) {
  const issue = await Issue.destroy({ where: { issue_id } });

  if (!issue) {
    throw new BadRequestError(`Couldn't delete issue with id ${issue_id}`);
  }
  return issue;
}

async function addVendorToIssue(issue_id, vendor_id) {
  const issue = await Issue.findByPk(issue_id);

  if (!issue) {
    throw new BadRequestError(`No issue found with id ${issue_id}`);
  }

  const result = await issue.addVendor(vendor_id);
  return result;
}


module.exports = {
  renderAddVendor,
  renderDeletedIssue,
  renderIssues,
  renderNewIssue,
  renderOneIssue,
  renderUpdatedIssue,
}