import React from 'react';

type ConditionalRenderProps = {
  children: JSX.Element | JSX.Element[];
  condition: boolean;
};
export function ConditionalRender(props: ConditionalRenderProps) {
  const { children, condition } = props;
  if (condition) {
    return (
      <>
        {children}
      </>
    );
  }
  return null;
}
