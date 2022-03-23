/* eslint-disable camelcase */
// @ts-check
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import bodyParser from 'body-parser';
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

import validateIssue from './issue.js';

require('source-map-support').install();

// db
/**
 * @typedef {import('mongodb').Db} Db
 */
const client = MongoClient.connect('mongodb://localhost:27017');
const dbConnection = client.then((aClient) => aClient.db('issuetracker'));

/// promise pipelines/middleware
const error_log = (err) => console.error(err);
/**
 * @returns issues
 */
function get_issuesPromise(filter) {
  // {Db} db
  // @type {{ collection: (arg0: string) => any[]; }} db
  return (db) => db.collection('issues').find(filter).toArray();
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

// app
const app = express();
const port = 8081;

// start
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/v1/issues', function listAPI(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  dbConnection.then(get_issuesPromise(filter)).then((issues) => {
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: `Internal Server Error : ${err}` });
  });
});

app.post('/api/v1/issues', function createAPI(req, res) {
  //
  dbConnection.then(get_issuesPromise()).then((_issues) => { // do i need to get them each time?
    const newIssue = req.body;
    // newIssue.id = issues.length + 1;// is handled by mongodb
    newIssue.created = new Date();
    if (!newIssue.status) {
      newIssue.status = 'New';
    }
    return validateIssue(newIssue);
  }).then(
    (newIssue) => dbConnection.then(db_addIssue(newIssue))
      .then((_result) => res.json(newIssue)), // would it always have an _id ?;
    (err) => {
      console.error(`request error : ${err}`);
      res.status(422).json({ message: `Invalid request: ${err}` });
    },
  ).catch(error_log);
});

// temporary delete api
app.delete('/api/v1/issue/_id/:_id', function deleteAPI(req, res) {
  const { _id } = req.params;
  if (_id) {
    dbConnection.then((db) => db.collection('issues').deleteOne({ _id: new ObjectId(_id) })).then((result) => res.json(result)).catch(error_log);
  }
});
//  throw new Error('test source mapping');// thrown 1;//doesn't work
// run
dbConnection.then((_db) => {
  app.listen(port, function startServer() {
    console.log(`App started at ${port}`);
  });
}).catch(error_log);
