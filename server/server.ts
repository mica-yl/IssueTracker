/* eslint-disable camelcase */
import bodyParser from 'body-parser';
import express from 'express';
import { Db, ObjectId } from 'mongodb';

import { validateIssue, Status, convertIssue } from './issue';
import renderedPageRouter from './renderedPageRouter';
import { formatSummary } from './summary';

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

type Query = {
  status?: Status,
  effort?: { $lte?: number, $gte?: number },
};

function getApp(databaseConnection:Promise<Db>|Db|void) {
  if (!databaseConnection) {
    throw Error(`DataBase is ${databaseConnection}`);
  }
  // app
  const app = express();
  const dbConnection = Promise.resolve(databaseConnection);

  // start
  app.use(bodyParser.json());

  app.use(express.static('static'));

  app.get('/api/v1/issues', async function listAPI(req, res) {
    const issuesCollection = await dbConnection
      .then((db) => db
        .collection('issues'));
    const filter: Query = {};
    const {
      status, effort_gte, effort_lte,
      _summary, _offset, _limit,

    } = req.query;
    if (status) filter.status = status;
    if (effort_lte || effort_gte) {
      filter.effort = {};
      if (effort_lte) {
        filter.effort.$lte = parseInt(effort_lte, 10);
      }
      if (effort_gte) {
        filter.effort.$gte = parseInt(effort_gte, 10);
      }
    }

    if (_summary === undefined) {
      /*
      get list of issues
       */
      const offset = _offset ? parseInt(_offset, 10) : 0;
      let limit = _limit ? parseInt(_limit, 10) : 20;
      if (limit > 50) limit = 50;
      try {
        const issuesCursor = issuesCollection.find(filter);
        const cursor = issuesCursor
          .sort({ _id: 1 })
          .skip(offset)
          .limit(limit);
        const totalCount = await issuesCollection.countDocuments(filter);
        const issues = await cursor.toArray();
        res.json({ _metadata: { totalCount }, records: issues });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Internal Server Error : ${err}` });
      }
    } else {
      /* summary
      */
      dbConnection.then((db) => db.collection('issues').aggregate([
        { $match: filter },
        { $project: { _id: '$_id', owner: '$owner', status: { $concat: '$status' } } },
        { $group: { _id: { owner: '$owner', status: { $concat: '$status' } }, count: { $count: {} } } },
      ]).toArray())
        .then(formatSummary)
        .then((summary) => {
          res.json(summary);
        }).catch((error) => {
          console.log(error);
          res.status(500).json({ message: `Internal Server Error: ${error}` });
        });
    }
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
  app.use('/', renderedPageRouter);

  return app;
}
getApp.port = 8081;

export default getApp;
