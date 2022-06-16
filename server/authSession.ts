import Router from 'express';
import session from 'express-session';

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
  app.get('/api/v1/users/me', (req, res) => {
    if (req.session && req.session.user) {
      res.json(req.session.user);
    } else {
      res.json({ signedIn: false, name: '' });
    }
  });
  app.post('/api/v1/users/signin', (req, res) => {
    if (!req.body.id_token) {
      res.status(400).send({ code: 400, message: 'Missing Token.' });
    }
  });

  return app;
}
