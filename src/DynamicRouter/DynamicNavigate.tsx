import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { ServerContext } from '#client/DynamicRouter/ServerContext';

type DynamicNavigateProps = {
  to: string;
  status?: 301 | 302;
};

export function DynamicNavigate(props: DynamicNavigateProps) {
  const { to, status = 302 } = props;
  const { response } = useContext(ServerContext);
  if (response) {
    response.redirect(status, to);
    return null;
  }
  return <Navigate to={to} />;
}
DynamicNavigate.defaultProps = {
  status: 302,
};
