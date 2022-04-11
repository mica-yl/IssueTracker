/* eslint-disable camelcase */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { install as installMapSupport } from 'source-map-support';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { Db, MongoClient, ObjectId } from 'mongodb';

import { validateIssue, Status, convertIssue } from './issue';

installMapSupport();

// db
const client = MongoClient.connect('mongodb://localhost:27017');
const dbConnection = client.then((aClient) => aClient.db('issuetracker'));

/// promise pipelines/middleware
const error_log = (err) => console.error(err);
/**
 * @returns issues
 */
function get_issuesPromise(filter?: Record<string, unknown>) {
  // {Db} db
  // @type {{ collection: (arg0: string) => any[]; }} db
  return (db: Db) => db.collection('issues').find(filter).toArray();
}
/**
 *
 * @param {Issue} issue
 * @returns {(db:Db) => any} insertIssuePipeline
 */
function db_addIssue(issue) {
  return function db_addIssue_result(db: Db) {
    return db.collection('issues').insertOne(issue);
  };
}

// app
const app = express();
const port = 8081;

// start
app.use(express.static('static'));
app.use(bodyParser.json());

type Query = {
  status?: Status,
  effort?: { $lte?: number, $gte?: number },
};

app.get('/api/v1/issues', function listAPI(req, res) {
  const filter: Query = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.effort_lte || req.query.effort_gte) {
    filter.effort = {};
    if (req.query.effort_lte) {
      filter.effort.$lte = parseInt(req.query.effort_lte, 10);
    }
    if (req.query.effort_gte) {
      filter.effort.$gte = parseInt(req.query.effort_gte, 10);
    }
  }

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
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status) {
    newIssue.status = 'New';
  }
  validateIssue(newIssue).then(
    (validIssue) => dbConnection.then(db_addIssue(validIssue))
      .then((_result) => res.json(validIssue)), // would it always have an _id ?;
    (err) => {
      console.error(`request error : ${err}`);
      res.status(422).json({ message: `Invalid request: ${err}` });
    },
  ).catch(error_log);
});

app.get('/api/v1/issues/:id', function getOneAPI(req, res) {
  const ID = req.params.id;
  Promise.resolve()
    .then(() => new ObjectId(ID))
    .then(
      (id) => {
        dbConnection
          .then((db) => db.collection('issues')
            .findOne({ _id: id }))
          .then((issue) => {
            if (!issue) {
              res.status(404).json({ message: `No such issue : ${id}` });
            } else {
              res.json(issue);
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ message: `Internal Server Error: ${err}` });
          });
      },
      () => res.status(422).json({ message: `Invalid issue ID format: ${ID}` }),
    );
});

app.put('/api/v1/issues/:id', function putOneAPI(req, res) {
  const ID = req.params.id;
  const issue = { ...req.body };
  delete issue._id;
  delete issue.created;
  Promise.resolve().then(() => new ObjectId(ID))
    .then(
      (id) => {
        validateIssue(convertIssue(issue), () => true).then(
          (validIssue) => {
            dbConnection
              .then((db) => {
                const issues = db.collection('issues');
                issues.updateOne({ _id: id }, { $set: validIssue })
                  .then(() => {
                    issues.findOne({ _id: id })
                      .then((savedIssue) => res.json(savedIssue));
                  });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: `Internal Server Error: ${err}` });
              });
          },
          (err) => {
            res.json({ message: `Invalid Request ${err}` });
          },
        );
      },
      (idError) => {
        res.status(422).json({ message: `Invalid issue ID format: ${idError}` });
      },
    );
});

// temporary delete api
app.delete('/api/v1/issues/:_id', function deleteOneAPI(req, res) {
  const { _id } = req.params;
  if (_id) {
    Promise.resolve()
      .then(() => new ObjectId(_id))
      .then(
        (id) => {
          dbConnection
            .then((db) => db.collection('issues')
              .deleteOne({ _id: id }))
            .then((result) => {
              const { acknowledged: ack, deletedCount: done } = result;
              if (ack && (done === 1)) {
                res.status(200).json({ status: 'OK' });
              } else {
                res.json({ status: 'Warning: object not found' });
              }
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({ message: `Internal Server Error: ${error}` });
            });
        },
        (error) => res.status(422).json({ message: `Invalid issue ID format: ${error}` }),
      );
  }
});
// browser routing
app.get('*', function indexFallback(req, res) {
  res.sendFile(path.resolve('static/index.html'));
  console.log(`${req.url} -> /index.html`);
});

//  throw new Error('test source mapping');// thrown 1;//doesn't work
// run
dbConnection.then((_db) => {
  app.listen(port, function startServer() {
    console.log(`App started at ${port}`);
  });
}).catch(error_log);
