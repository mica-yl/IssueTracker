import { useSearchParams } from 'react-router-dom';

/**
 *
 * @param {URLSearchParams} url
 * @param {Object} obj
 * @returns {URLSearchParams} unique
 */
export function mergeSearchParams(url:URLSearchParams, obj:Record<string, string>) {
  return new URLSearchParams(
    {
      ...Object.fromEntries(url.entries()),
      ...obj,
    },
  );
}
export function hashSearchParams(searchParams:URLSearchParams, filter:{allowedKeys:string[]|'all'}) {
  const params = new URLSearchParams(searchParams);
  const { allowedKeys } = filter;
  if (allowedKeys !== 'all') {
    [...params.keys()]
      .filter((k) => !(allowedKeys.includes(k)))
      .forEach(
        (key) => {
          params.delete(key);
        },
      );
  }
  return params.toString();
}

export function useSearchParamsUpdate() {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    searchParams,
    setSearchParams,
    reduceSearchParams(f: (i: URLSearchParams) => URLSearchParams) {
      // f: (i:Record<string, string>)=>Record<string, string>
      // setSearchParams({ ...f({ ...searchParams.entries() }) });
      setSearchParams(f(new URLSearchParams(searchParams)));
    },
    newSearchParams(obj: Record<string, unknown>) {
      return new URLSearchParams(
        {
          ...Object.fromEntries(searchParams.entries()),
          ...obj,
        },
      );
    },
  };
}
