/* eslint-disable camelcase */
import bodyParser from 'body-parser';
import express from 'express';
import { MongoClient } from 'mongodb';
import http from 'http';
import authSession from './authSession';
import renderedPageRouter from './renderedPageRouter';
import { restAPI } from './restAPI';

function getApp(databaseClient:MongoClient) {
  if (!databaseClient) {
    throw Error(`DataBase is ${databaseClient}`);
  }
  // app
  const app = express();
  const dbConnection = Promise.resolve(databaseClient.db());

  // body parsing
  app.use(bodyParser.json());

  // auth api + protection for rest api
  app.use(authSession({
    clientPromise: Promise.resolve(databaseClient),
  }));

  // rest api v1
  app.use('/api/v1/', restAPI(dbConnection));

  // api fallback
  app.all('/api/*', (_req, res) => {
    //  Not Implemented
    res.status(501).json({ message: 'unsupported Operation' });
  });

  // server-side rendering + fallback
  app.use('/', renderedPageRouter());

  // static files. includes favico
  app.use(express.static('static'));

  return app;
}
getApp.port = 8081;

export default getApp;
