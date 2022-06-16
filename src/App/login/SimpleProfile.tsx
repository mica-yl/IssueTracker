import React from 'react';
import { Image, Card, Stack } from 'react-bootstrap';

type SimpleProfileProps = {
  name: string;
  image: string;

};
export function SimpleProfile({ image, name }: SimpleProfileProps) {
  return (
    <Card>
      <Stack direction="horizontal" gap={3}>
        <Image src={image} />
        <p>{name}</p>
      </Stack>
    </Card>
  );
}
