// @ts-check
const bodyParser = require('body-parser');
const express = require('express');
const {validateIssue}=require('./issue');

const app = express();
const port = 8081;

// db
/**
 * @typedef {import('mongodb').Db} Db
 */
const { MongoClient, ObjectId } = require('mongodb');
const client = MongoClient.connect('mongodb://localhost:27017');
const db = client.then(client => client.db('issuetracker'));


/// promise pipelines/middleware
const error_log = err => console.error(err);
/**
 * 
 * @param {Db} db 
 * @returns issues
 */
function get_issuesPromise(db) {
    return db.collection('issues').find().toArray();
}
/**
 * @typedef {*} Issue
 */

/**
 * 
 * @param {Issue} issue 
 * @returns {(db:Db) => any} insertIssuePipeline
 */
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
            db.collection('issues').deleteOne({ _id: new ObjectId(_id) })
        ).then(result =>
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

