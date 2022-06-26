import Router from 'express';
import expressSession from 'express-session';
import debug from 'debug';
import { MongoClient } from 'mongodb';
import * as MongoStore from 'connect-mongo';

const log = debug('app:api:session');

type AuthSessionOptions ={
  clientPromise: Promise<MongoClient>
};

export default function authSession(options:AuthSessionOptions) {
  const { clientPromise } = options;
  const app = Router();
  const store = MongoStore.create({
    clientPromise,
  });

  app.use(
    expressSession({
      /*
       store : use mongo-connect because
          *MemoryStore, is purposely not designed for a production environment. *
      */
      secret: 'L4d4cSz$X#p8FORnEJR^',
      resave: false,
      saveUninitialized: true,
      store,
    }),
  );

  app.get('/api/v1/users/me', (req, res) => {
    log(`[session:${req.session.id}] me:`, req.session.user);
    log(`[session:${req.session.id}] me (keys):`, Object.keys(req.session));
    if (req.session && req.session.user) {
      res.json(req.session.user);
    } else {
      res.json({ signedIn: false, name: '' });
    }
  });

  app.post('/api/v1/users/signin', (req, res) => {
    const {
      name, picture, id,
    } = req.body;

    // no validation yet
    req.session.user = {
      id, name, picture, signedIn: true,
    };
    log(`[session:${req.session.id}]`);
    res.json(req.session.user);

    // TODO auth with google
  });

  app.all('/api/*', (req, res, next) => {
    const { method, session } = req;
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      if (!session || !session.user) {
        res.status(403).send({
          message: 'You are not authorized to perform the operation',
        });
        return;
      }
    }
    // otherwise continue.
    next();
  });

  app.post('/api/v1/users/signout', (req, res) => {
    if (req.session) {
      req.session.destroy(console.error);
    }
    res.json({ status: 'ok' });
  });

  return app;
}
