import { useState } from 'react';
import fetch from 'isomorphic-fetch/';

import { convertIssue, IssuesJsonResponse } from '#server/issue';
import useAlert from '#client/App/AlertMsg';
import useAsk from '#client/App/Ask';
import { useSearchParamsUpdate } from '#client/react-router-hooks';

type Issue = Record<string, unknown>;
const prettyJson = (obj) => JSON.stringify(obj, null, ' ');

export function preprocessJsonIssue(issue:Issue) {
  // date returns as a string.
  const newIssue = { ...issue };
  newIssue.created = new Date(newIssue.created);
  if (newIssue.completionDate) {
    newIssue.completionDate = new Date(issue.completionDate);
  }
  return newIssue;
}

export function deleteIssue(issueId) {
  return fetch(
    `/api/v1/issues/${issueId}`,
    {
      method: 'DELETE',
    },
  ).then((response) => {
    if (response.status === 200) { // ok
      return true;
    }
    return false;
  });
}

export async function getOneIssue(id) {
  return fetch(
    `/api/v1/issues/${id}`,
    { method: 'GET' },
  ).then((response) => {
    const json = response.json();
    switch (response.status) {
      case 200: // OK
        return json;
      case 404: // notfound
        return json;
      case 500:// internal server problem
        return json;
      case 422:// Unprocessable Entity
        return { message: 'Unprocessable Entity !' };
      default:
        throw response;
    }
  });
}

export function updateOneIssue(id, sentIssue) {
  return new Promise((resolve, reject) => {
    fetch(
      `/api/v1/issues/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: prettyJson(sentIssue),
      },
    ).then((res) => {
      if (res.ok) {
        res.json()
          .then(convertIssue)
          .then(resolve);
      } else {
        res.json().then((err) => reject(Error(`Failed to update issue: ${err.message}`)));
      }
    }).catch((err) => reject(Error(`Error in sending data to server : ${err.message}`)));
  });
}

export default function useIssues(
  alertAsync: (msg:string)=> Promise<boolean>,
  ask:(question:string)=> Promise<boolean>,
) {
  const [issues, setIssues] = useState([]);
  const [maxIssues, setMaxIssues] = useState(0);
  const { searchParams, newSearchParams, setSearchParams } = useSearchParamsUpdate();

  function fetchData(transparentKeys:string[]) {
    /**
     * request parameter :
     */
    const requestParams = new URLSearchParams(searchParams);
    const issuesPerPage = requestParams.has('issuesPerPage')
      ? parseInt(requestParams.get('issuesPerPage'), 10)
      : 10;
    const offset = (() => {
      if (requestParams.has('page')) {
        const page = parseInt(requestParams.get('page'), 10);

        return ((page - 1) * issuesPerPage);
      }
      return 0;
    })();

    // clean all keys
    [...requestParams.keys()]
      .filter((k) => !transparentKeys.includes(k))
      .forEach((k) => requestParams.delete(k));

    // set meta keys
    requestParams.set('_limit', issuesPerPage.toString());
    requestParams.set('_offset', offset.toString());

    /**
     * fetch data
     * @param search : search words
     * @returns
     */
    const dataFetcher = (search?:string) => {
      if (typeof search === 'string') {
        requestParams.set('search', search);
      }
      return fetch(
        `/api/v1/issues?${requestParams}`,
        { method: 'GET' },
      ).then((response) => {
        const json = response.json();
        if (response.ok) {
          return json;
        } if (response.status === 500) {
          return json.then((err) => alertAsync(`Falied to fetch issues ${err.message}`));
        }
        throw response;
      }).then((remoteData:IssuesJsonResponse) => {
        const { records, _metadata: { totalCount } } = remoteData;
        const convertedIssues = records.map(convertIssue);
        return { issues: convertedIssues, totalCount };
      });
    };
    /**
     * return thunk that loads issues to state. use it  with dataFetcher.
     * @param dataFetcherCallBack
     * @returns
     */
    const dataLoader = (dataFetcherCallBack:(typeof dataFetcher)) => () => dataFetcherCallBack()
      .then(({ issues: convertedIssues, totalCount }) => {
        setIssues(convertedIssues);
        setMaxIssues(totalCount);
      })
      .catch((err) => console.error(err));

    return { dataFetcher, issuesPerPage, dataLoader };
  }

  function addIssue(issue) {
    if (issue) { // issue shouldn't be null or undefined.
      setIssues((data) => data.concat(issue));
    }
  }
  function addTestIssue() {
    addIssue({
      _id: '05896dgfhls56s5',
      status: 'New',
      owner: 'Pieta',
      created: new Date(),
      title: 'Completion date should be optional !',
    });
  }

  function createIssue(newIssue:Issue) {
    return fetch(
      '/api/v1/issues',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: prettyJson(newIssue),
      },
    )
      .then((response) => [response.status, response.json()])
      .then(function checkStatus([status, json]) {
        // const json = response.json();
        if (status === 200) { // ok
          Promise.resolve(json).then(preprocessJsonIssue).then(addIssue);
          return true; // all done
        } if ([422, 403].includes(status)) { // forgot a field ?
          json.then((err) => alertAsync(`Falied to add issue ${err.message}`));
          return false;
        }
        console.dir(status, json);

        return false; // default failed

        // throw response;
      })
      .catch((err) => console.error(`Error in sending data to server: ${err.message}`));
  }
  function refreshData() {
    const { dataFetcher, dataLoader } = fetchData([]);
    dataLoader(dataFetcher)();
  }
  function confirmDelete(issueId) {
    return ask(`Are you sure to delete issue : ${issueId}`).then((answer) => {
      if (answer) {
        const deleted = deleteIssue(issueId);
        deleted.then((success) => {
          if (success) {
            // update
            refreshData();
            alertAsync(`delete API: \nissue ${issueId} is deleted!`);
          } else {
            alertAsync(`delete API: Failed to delete issue #${issueId}`);
          }
        });
        return deleted;
      }
      return false;// failed
    });
  }

  return {
    fetchData,
    refreshData,
    getOneIssue,
    updateOneIssue,
    issues,
    maxIssues,
    createIssue,
    addTestIssue,
    confirmDelete,
    deleteIssue,
    searchParams,
    newSearchParams,
    setSearchParams,
  };
}
/* TODO refactor as multiple contexts.
    toast, confirmation, searchParams.
*/
// useAPI
export function useAPI() {
  const { Ask, ask } = useAsk();
  const { AlertMsg, alertAsync } = useAlert();
  const API = { ...useIssues(alertAsync, ask), ask, alertAsync };
  const Components = { Ask, AlertMsg };

  return {
    API,
    Components,
  };
}

export type APIAndComponents = ReturnType< (typeof useAPI)>;
export type API = ReturnType< (typeof useAPI)> ['API'];
export type Components = ReturnType< (typeof useAPI)> ['Components'];
