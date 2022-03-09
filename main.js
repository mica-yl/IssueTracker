const { json } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
let port = 8081;


const issues = [
    {
        id: 1, status: 'Open', owner: 'Ravan',
        created: new Date('2016-08-15'), effort: 5
        , completionDate: undefined, title: 'Error in Console when clicking add.',
    },

    {
        id: 2, status: 'Assigned', owner: 'Eddie',
        created: new Date('2016-08-16'), effort: 14,
        completionDate: new Date('2016-05-16'), title: 'Missing bottom border on panel',
    },

];


app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/v1/issues', function get_issues(req, res) {
    const metadata = { total_count: issues.length };
    // pretty version
    // console.log(JSON.stringify({ _metadata: metadata, records: issues },null,' '))
    res.json({ _metadata: metadata, records: issues });
});

const validateIssue = (function validateIssueCreationScope() {
    const validIssueStatus = {
        New: true,
        Open: true,
        Assigned: true,
        Fixed: true,
        Verified: true,
        Closed: true,
    };

    const issueFieldType = {
        id: 'required',
        status: 'required',
        owner: 'required',
        effort: 'optional',
        created: 'required',
        completionDate: 'optional',
        title: 'required',
    };

    async function validateIssue(issue) {
        const newIssue = {};
        // copy scheme fields only and ignore other fields
        for (const field in issueFieldType) {
            const type = issueFieldType[field];
            const value=issue[field];
            if (value){
                newIssue[field]=value;
            }else if (type === 'required') {
                throw `${field} is required.`;
            }
        }

        if (!validIssueStatus[issue.status]) {
            throw `${issue.status} isn't a valid status.`;
        }
        return newIssue;
    }

    return validateIssue;

})()


app.post('/api/v1/issues', function (req, res) {
    const newIssue = req.body;
    newIssue.id = issues.length + 1;
    newIssue.created = new Date();
    if (!newIssue.status) {
        newIssue.status = 'New';
    }
    validateIssue(newIssue)
        .then((newIssue) => {
            issues.push(newIssue);
            res.json(newIssue);
        })
        .catch((err) => res.status(422).json({ message: `Invalid request: ${err}` }));

});




app.listen(port, function startServer() {
    console.log(`App started at ${port}`);

});