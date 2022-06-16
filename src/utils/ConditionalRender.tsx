import React, { ReactNode } from 'react';

type ConditionalRenderProps = {
  children: ReactNode;
  condition: boolean;
};
export function ConditionalRender(props: ConditionalRenderProps) {
  const { children, condition } = props;
  if (condition) {
    return (
      <>
        { children }
      </>
    );
  }
  return null;
}
