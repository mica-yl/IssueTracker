import { useEffect, useState } from 'react';

export default function OnClientOnly({ children }: { children: unknown[] | unknown; }) {
  const [node, setNode] = useState(null);
  useEffect(
    () => {
      if (document && window) {
        console.log('rendering on Client');
        setNode(children);
      }
    },
    [],
  );
  return node;
}
