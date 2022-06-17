import Router from 'express';
import session from 'express-session';
import debug from 'debug';

const log = debug('app:api:session');

type AuthSessionOptions ={

};

export default function authSession(options?:AuthSessionOptions) {
  const app = Router();
  app.use(
    session({
      /*
       store : use mongo-connect because
          *MemoryStore, is purposely not designed for a production environment. *
      */
      secret: 'L4d4cSz$X#p8FORnEJR^',
      resave: false,
      saveUninitialized: true,
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
      id_token, name, picture, id,
    } = req.body;
    /*
    if (!id_token) {
      res.status(400).send({ code: 400, message: 'Missing Token.' });
    }
    */
    // no validation yet
    req.session.user = {
      id, name, picture, signedIn: true,
    };
    log(`[session:${req.session.id}] sign-in:`, req.session.user);
    res.json(req.session.user);
    /*
    fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.id_token}`)
      .then((response) => {
        if (!response.ok) response.json().then((error) => Promise.reject(error));
        response.json().then((data) => {
          req.session.user = {
            signedIn: true, name: data.given_name,
          };
          res.json(req.session.user);
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
      });
      */
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
