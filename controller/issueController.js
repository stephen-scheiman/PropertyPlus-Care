const { updateIsDone, deleteTask } = require("../utils/queries/tasks");
const {
  createIssue,
  findOneIssue,
  findAllIssues,
  findOpenIssues,
  findClosedIssues,
  getIssuesByPropertyID,
  updateIssueDone,
  deleteIssue,
  searchIssues,
  addVendorToIssue,
  unassignVendor,
  updateIssue,
} = require("../utils/queries/issues");
const { findVendorsByTradeNotIssue } = require("../utils/queries/vendors");
const { findProperties } = require("../utils/queries/properties");
const { BadRequestError } = require("../utils/errors");

async function renderOpenIssues(req, res) {
  const issues = await findOpenIssues();
  // console.log(issues);
  res.status(200).render("issue-aside", { issues, layout: false });
}

async function renderIssues(req, res) {
  const { issueStatus } = req.query;

  // console.log("-----------------");
  // console.log("\n\n", issueStatus, "\n\n");
  // console.log("-----------------");

  switch (issueStatus) {
    case "open": {
      const issues = await findOpenIssues();
      return res.status(200).render("issue-aside", { issues, layout: false });
    }

    case "closed": {
      const issues = await findClosedIssues();
      return res.status(200).render("issue-aside", { issues, layout: false });
    }

    case "all": {
      const issues = await findAllIssues();
      // console.log(issues);
      res.status(200).render("issue-aside", { issues, layout: false });
    }

    default:
      break;
  }
}

async function renderOneIssue(req, res) {
  const { id: issue_id } = req.params;

  const issue = await findOneIssue(issue_id);
  // console.log(issue);
  res.status(200).render("issue-ID", { issue, layout: false });
}

async function renderIssuesByProperty(req, res) {
  const { id: property_id } = req.params;
  const issue = await getIssuesByPropertyID(property_id);
  // console.log(issue);
  res.status(200).render("issue-ID", { issue, layout: false });
}

async function renderIsIssueDone(req, res) {
  const { id: issue_id } = req.params;
  const { issueDone } = req.body;

  let issueUpdate;

  if (issueDone === "Re-Open") {
    issueUpdate = await updateIssueDone(issue_id, false);
  } else {
    issueUpdate = await updateIssueDone(issue_id, true);
  }

  const issue = await findOneIssue(issue_id);

  res
    .status(200)
    .set("HX-Trigger", "update-issues")
    .render("issue-ID", { issue, layout: false });
}

async function renderNewIssueForm(req, res) {
  const properties = await findProperties();
  res.status(200).render("issue-form-new", { properties, layout: false });
};

async function renderNewIssue(req, res) {
  console.log(`\n ------------- \n`);
  console.log(req.body);
  console.log(`\n ------------- \n`);

  const { issue_title, issue_description, property_id } = req.body;

  if (!(issue_title && issue_description && property_id)){
    throw new BadRequestError("issue-form-new","Please complete all fields");
  }

  const issue = await createIssue({ issue_title, issue_description, property_id });
  console.log(issue);
  res.status(200).set('hx-trigger', 'update-issues').render("issue-ID", { issue, layout: false });
}

async function renderDeletedIssue(req, res) {
  const issue_id = req.params.id;

  const issue = await deleteIssue(issue_id);
  res.status(200).set("HX-Trigger","update-issues").send('');
}

async function renderVendorsByTrade(req, res) {
  const { id: issue_id } = req.params;
  const { vendor_trade } = req.query;

  const vendors = await findVendorsByTradeNotIssue(+issue_id, vendor_trade)
  let isEmpty = false;

  if (vendors.length === 0) {
    isEmpty = true;
    return res.status(200).render("issue-vendors-by-trade", { vendors, isEmpty, layout: false });
  }
  return res.status(200).render("issue-vendors-by-trade", { vendors, isEmpty, layout: false });
}

async function renderAddVendor(req, res) {
  const issue_id = req.params.id;
  const { vendor_id } = req.body;

  const result = await addVendorToIssue(issue_id, vendor_id);
  const issue = await findOneIssue(issue_id);

  res.status(200).render("issue-ID", { issue, layout: false });
}

async function renderUnassignVendor(req, res) {
  const issue_id = req.params.id;
  const { vendor_id } = req.body;

  console.log('\n ------------- \n');
  console.log(issue_id);
  console.log(vendor_id);
  console.log('\n ------------- \n');

  const result = await unassignVendor(issue_id, vendor_id);
  const issue = await findOneIssue(issue_id);

  res.status(200).render("issue-ID", { issue, layout: false });
}

async function renderIsTaskDone(req, res) {
  const { issue_id, task_id } = req.params;
  const { isDone } = req.body;
  let task;

  if (isDone === "Re-Open") {
    task = await updateIsDone(task_id, false);
  } else {
    task = await updateIsDone(task_id, true);
  }

  const issue = await findOneIssue(issue_id);

  res
    .status(200)
    .set("HX-Trigger", "update-tasks")
    .render("issue-ID", { issue, layout: false });
}

async function renderDeletedTask(req, res) {
  const { issue_id, task_id } = req.params;

  const deletedTask = await deleteTask(task_id);

  const issue = await findOneIssue(issue_id);

  res
    .status(200)
    .set("HX-Trigger", "update-tasks")
    .render("issue-ID", { issue, layout: false });
}

async function renderIssuesSearch(req, res) {
  const { search } = req.body;
  const issues = await searchIssues(search.toLowerCase());
  res.status(200).render('issue-aside', { issues, layout: false });
}

async function renderIssueFormEdit(req, res) {
  const { id } = req.params;
  const p1 = await findProperties();
  const p2 = findOneIssue(id);
  const [properties, issue] = await Promise.all([p1, p2]);

  res.status(200).render('issue-form-edit', { issue, properties, layout: false });
}

async function renderUpdatedIssue(req, res) {
  const issue_id = req.params.id;
  const { issue_title, issue_description, property_id } = req.body;

  if (!(issue_title && issue_description && property_id)){
    throw new BadRequestError("issue-form-edit", "Please complete all fields", { issue_id });
  }

  await updateIssue(issue_id, {
    issue_title,
    issue_description,
    property_id,
  });

  const issue = await findOneIssue(issue_id);

  res.status(200).set('hx-trigger', ['update-tasks', 'update-issues']).render('issue-ID', { issue, layout: false });
}


module.exports = {
  renderOpenIssues,
  renderAddVendor,
  renderDeletedIssue,
  renderIssues,
  renderNewIssueForm,
  renderNewIssue,
  renderOneIssue,
  renderUpdatedIssue,
  renderIsTaskDone,
  renderDeletedTask,
  renderIssuesByProperty,
  renderIsIssueDone,
  renderVendorsByTrade,
  renderIssuesSearch,
  renderUnassignVendor,
  renderIssueFormEdit,
};
