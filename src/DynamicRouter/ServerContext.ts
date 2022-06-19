import { Request, Response } from 'express';
import React from 'react';

export type ServerContext = {
  inServer:boolean,
  response?:Response,
  request?:Request
};

const context :ServerContext = {
  inServer: false,
  request: undefined,
  response: undefined,
};
export const ServerContext = React.createContext(context);
