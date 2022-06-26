import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { ServerContext } from '#client/DynamicRouter/ServerContext';
import debug from 'debug';

type DynamicNavigateProps = {
  to: string;
  status?: 301 | 302;
};

const log = debug(`app:client:${DynamicNavigate.name}`);

// TODO fix on server.
export function DynamicNavigate(props: DynamicNavigateProps) {
  const { to, status = 302 } = props;
  const { response } = useContext(ServerContext);
  if (response && !response.headersSent) {
    log('redirecting...');
    response.redirect(status, to);
    return null;
  }
  if (response) {
    log('failed to redirect on server.');
  }
  return <Navigate to={to} />;
}
DynamicNavigate.defaultProps = {
  status: 302,
};
