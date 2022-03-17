'use strict';

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
    status: { required: true, },
    owner: { required: true, },
    effort: { required: false, },
    created: { required: true, },
    completionDate: { required: false, },
    title: { required: true, },
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
    // copy scheme fields only and ignore other fields
    for (const field in issueFieldType) {
        const type = issueFieldType[field];
        const value = issue[field];
        if (value) {
            newIssue[field] = value;
        } else if (type.required) {
            throw `${field} is required.`;
        }
    }

    if (!validIssueStatus[issue.status]) {
        throw `${issue.status} isn't a valid status.`;
    }
    return newIssue;
}

export  {
    validateIssue,
};