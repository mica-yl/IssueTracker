import React from 'react';
import { renderToString } from 'react-dom/server';
import Router from 'express';

import HelloWorld from '../src/HelloWorld';
import template from './template.js';

const renderedPageRouter = Router();
renderedPageRouter.get('*', (req, res) => {
  const html = renderToString(
    <HelloWorld addressee="Server" />,
  );
  res.send(template(html));
});

export default renderedPageRouter;
