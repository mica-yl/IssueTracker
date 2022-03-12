const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8081;

// db
const { MongoClient, ObjectId } = require('mongodb');
const client = MongoClient.connect('mongodb://localhost:27017');
const db = client.then(client => client.db('issuetracker'));

/// promise pipelines/middleware
const error_log = err => console.error(err);
function get_issuesPromise(db) {
    return db.collection('issues').find().toArray();
}

function db_addIssue(issue) {
    return function db_addIssue_result(db) {
        return db.collection('issues').insertOne(issue);
    };
}

// start
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/v1/issues', function listAPI(req, res) {
    db.then(get_issuesPromise).then(issues => {
        const metadata = { total_count: issues.length };
        res.json({ _metadata: metadata, records: issues });

    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: `Internal Server Error : ${err}` })
    });
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
        // _id: {required:true,},
        status: { required: true, },
        owner: { required: true, },
        effort: { required: false, },
        created: { required: true, },
        completionDate: { required: false, },
        title: { required: true, },
    };

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

    return validateIssue;

})()


app.post('/api/v1/issues', function createAPI(req, res) {
    //
    db.then(get_issuesPromise).then(issues => { // do i need to get them each time?
        const newIssue = req.body;
        // newIssue.id = issues.length + 1;// is handled by mongodb
        newIssue.created = new Date();
        if (!newIssue.status) {
            newIssue.status = 'New';
        }
        return validateIssue(newIssue);
    }).then(newIssue => {
        // issues.push(newIssue);
        return db.then(db_addIssue(newIssue)).then(result =>
            res.json(newIssue)// would it always have an _id ?;
        );
    }, err => {
        console.error(`request error : ${err}`);
        res.status(422).json({ message: `Invalid request: ${err}` })
    }).catch(error_log);
});

// temporary delete api
app.delete('/api/v1/issue/_id/:_id', function deleteAPI(req, res) {
    const _id = req.params._id;
    if (_id) {
        db.then(db =>
            db.collection('issues').deleteOne({ _id: ObjectId(_id) })).then(result =>
                res.json(result)
            ).catch(error_log);
    }
});

// run
db.then(db => {
    app.listen(port, function startServer() {
        console.log(`App started at ${port}`);
    });

}).catch(error_log);

