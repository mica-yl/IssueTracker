import { ConditionalRender } from '#client/utils/ConditionalRender';
import React, { useContext } from 'react';
import { Image, Nav } from 'react-bootstrap';
import { UserContext } from '../login/UserProvider';

type Props = {}

export default function UserNavItem({}: Props) {
  const user = useContext(UserContext);

  return (
  // <ConditionalRender condition={user.signedIn}>
    <Nav.Item>
      <Image src={user.picture} fluid roundedCircle />
      {user.name}
    </Nav.Item>
  // </ConditionalRender>
  );
}
