import React, { createContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { convertIssue } from '../server/issue';
import useAlert from './AlertMsg';
import useAsk from './Ask';
import { Issue } from './Issue';

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

function getOneIssue(id) {
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

function updateOneIssue(id, sentIssue) {
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
  const [searchParams] = useSearchParams();

  function fetchData() {
    fetch(
      `/api/v1/issues?${searchParams}`,
      { method: 'GET' },
    ).then((response) => {
      const json = response.json();
      if (response.ok) {
        return json;
      } if (response.status === 500) {
        return json.then((err) => alertAsync(`Falied to fetch issues ${err.message}`));
      }
      throw response;
    }).then((remote_data) => {
      const new_data = remote_data.records.map(convertIssue);
      setIssues(new_data);
    })
      .catch((err) => console.error(err));
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
        } if (status === 422) { // forgot a field ?
          json.then((err) => alertAsync(`Falied to add issue ${err.message}`));
          return false;
        }
        return false; // default failed

        // throw response;
      })
      .catch((err) => console.error(`Error in sending data to server: ${err.message}`));
  }

  function confirmDelete(issueId) {
    return ask(`Are you sure to delete issue : ${issueId}`).then((answer) => {
      if (answer) {
        deleteIssue(issueId).then((success) => {
          if (success) {
            fetchData();// update
            alertAsync(`delete API: \nissue ${issueId} is deleted!`);
          } else {
            alertAsync(`delete API: Failed to delete issue #${issueId}`);
          }
        });
      }
      return false;// failed
    });
  }

  return {
    fetchData,
    getOneIssue,
    updateOneIssue,
    issues,
    createIssue,
    addTestIssue,
    confirmDelete,
    deleteIssue,
    searchParams,
  };
}
// useAPI
export function useAPI() {
  const { Ask, ask } = useAsk();
  const { AlertMsg, alertAsync } = useAlert();
  const API = { ...useIssues(alertAsync, ask), ask, alertAsync };
  const Components = { Ask, AlertMsg };
  // const Context = createContext(API);

  return {
    API,
    Components,
  };
}

export type APIAndComponents = ReturnType< (typeof useAPI)>;
