import { useSearchParams } from 'react-router-dom';

/**
 *
 * @param {URLSearchParams} url
 * @param {Object} obj
 * @returns {URLSearchParams} unique
 */
export function mergeSearchParams(url, obj) {
  return new URLSearchParams(
    {
      ...Object.fromEntries(url.entries()),
      ...obj,
    },
  );
}

export function useSearchParamsUpdate() {
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    searchParams,
    setSearchParams,
    // reduceSearchParams(f: (i:Record<string, string>)=>Record<string, string>) {
    //   setSearchParams({ ...f({ ...searchParams.entries() }) });
    // },
    newSearchParams(obj) {
      return new URLSearchParams(
        {
          ...Object.fromEntries(searchParams.entries()),
          ...obj,
        },
      );
    },
  };
}
