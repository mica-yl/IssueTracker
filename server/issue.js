const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true,
};

const issueFieldType = {
  // _id: {required:true,},
  status: { required: true },
  owner: { required: true },
  effort: { required: false },
  created: { required: true },
  completionDate: { required: false },
  title: { required: true },
};

/**
 * @typedef (*) Issue
 */

/**
 * @param {Issue} issue
 * @returns {Promise<Issue>}
 */
async function validateIssue(issue) {
  const newIssue = {};
  const errors = [];
  // copy scheme fields only and ignore other fields
  Object.keys(issueFieldType).forEach((field) => {
    const type = issueFieldType[field];
    const value = issue[field];
    if (value) {
      newIssue[field] = value;
    } else if (type.required) {
      errors.push(`${field} is required`);
    }
  });

  if (!validIssueStatus[issue.status]) {
    errors.push(`${issue.status} isn't a valid status`);
  }

  // return
  if (errors.length) {
    throw errors.join(';');
  } else {
    return newIssue;
  }
}

export default validateIssue;
