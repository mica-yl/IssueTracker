import { Navigate } from 'react-router-dom';
import React from 'react';
import debug from 'debug';
import { preRenderHook } from '#server/preRenderHook.static';

type DynamicNavigateProps = {
  to: string;
  status?: 301 | 302;
};

const log = debug(`app:client:${DynamicNavigate.name}`);

// DONE fix on server.
export function DynamicNavigate(props: DynamicNavigateProps) {
  const { to } = props;
  return <Navigate to={to} />;
}
const preRender: preRenderHook = async (context) => {
  const { response, props } = context;
  const { to, status = 302 } = props;
  if (response && !response.headersSent) {
    log('redirecting...');
    response.redirect(status, to);
  } else {
    log('failed to redirect on server.');
  }
};

DynamicNavigate[preRenderHook] = preRender;
DynamicNavigate.defaultProps = {
  status: 302,
};
