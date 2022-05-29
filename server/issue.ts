import IssueAdd from '../src/IssueAdd';

export const Status = ['New', 'Open', 'Assigned', 'Fixed', 'Verified', 'Closed'] as const;
export type Status = (typeof Status)[number];

export type Issue<X> = {
  _id: string,
  status: Status,
  owner: string,
  effort: number,
  created: X,
  completionDate?: X,
  title: string,
};

/**
 * this type is out of sync with the implementation.
 */
export type IssuesJsonResponse = {
  _metadata:{totalCount:number},
  records: Issue<string>[]
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
 * @param {Issue} issue
 * @returns {Promise<Issue>}
 */
export async function validateIssue(
  issue:Issue<string|Date>,
  ignoreRequired: (fieldName:string)=> boolean = () => false,
) {
  const newIssue = {};
  const errors:string[] = [];
  // copy scheme fields only and ignore other fields
  Object.keys(issueFieldType).forEach((field) => {
    const type = issueFieldType[field];
    const value = issue[field];
    if (value) {
      newIssue[field] = value;
    } else if (type.required && !ignoreRequired(field)) {
      errors.push(`${field} is required`);
    }
  });

  if (!Status.includes(issue.status) && !ignoreRequired('status')) {
    errors.push(`${issue.status} isn't a valid status`);
  }

  // return
  if (errors.length) {
    throw errors.join(';');
  } else {
    return newIssue;
  }
}

export function convertIssue(issue:Issue<Date|string>) : Issue<Date> {
  // date returns as a string.
  const newIssue = { ...issue };

  if (newIssue.completionDate) {
    newIssue.completionDate = new Date(issue.completionDate);
  }
  if (newIssue.created) {
    newIssue.created = new Date(issue.created);
  }
  return newIssue;// for usage in `Promise`s or `map()`s
}
