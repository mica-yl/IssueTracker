import React, { useEffect, useState } from 'react';
import makeAsyncScriptLoader from 'react-async-script';

type Options = NonNullable< Parameters<typeof makeAsyncScriptLoader>[1]>;

const gsiClientScriptSrc = 'https://accounts.google.com/gsi/client';
// eslint-disable-next-line react/function-component-definition
const Null = () => null;
const defualtOptions:Options = {
  attributes: {
    defer: '',
    async: '',

  },
  removeOnUnmount: true,
};

type GoogleSignInClientProps = {
  onLoad?: (api:{google:typeof globalThis.google, gapi: typeof globalThis.gapi})=> void,
  options?:Options,
  gsiURL?:string,
};

function withPromise<X>() {
  let resolve: (value:X)=>void;
  let reject:(err:unknown)=>void;
  const promise = new Promise(
    (res, rej) => {
      resolve = res;
      reject = rej;
    },
  );
  return [promise, resolve, reject];
}

export default function GoogleSignInClient(props:GoogleSignInClientProps) {
  const { onLoad, options, gsiURL = gsiClientScriptSrc } = props;
  const [$gapi, resolveGapi] = withPromise<typeof google>();
  const [$google, resolveGoogle] = withPromise<typeof gapi>();
  useEffect(
    () => {
      if (onLoad) {
        Promise.all([$google, $gapi])
          .then(([google, gapi]) => ({ google, gapi }))
          .then(onLoad);
      }
    },
    [],
  );
  // to memoize ?
  const GoogleClientScript = makeAsyncScriptLoader(
    gsiURL,
    options,
  )(Null);
  const GooglePlatformScript = makeAsyncScriptLoader(
    'https://apis.google.com/js/platform.js',
    options,
  )(Null);
  return (
    <>
      <GoogleClientScript
        // asyncScriptOnLoad={() => (onLoad ? Promise.resolve(google).then(onLoad) : null)}
        asyncScriptOnLoad={() => resolveGoogle(globalThis.google)}
      />
      <GooglePlatformScript
        asyncScriptOnLoad={() => resolveGapi(globalThis.gapi)}
      />
    </>

  );
}

GoogleSignInClient.defaultProps = {
  onLoad: () => undefined,
  options: defualtOptions,
  gsiURL: gsiClientScriptSrc,
};
