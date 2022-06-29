import { Request, Response } from 'express';

export type preRenderContext = {
  request: Request,
  response: Response,
  props: Record<string, unknown>,
};

export const preRenderHook = Symbol('pre-render function');
export type preRenderHook = (context: preRenderContext) => Promise<{ data: any; } | void>;
