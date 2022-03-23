/* eslint-disable react/jsx-no-bind */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import 'whatwg-fetch';

import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';

const { useState, useEffect } = React;

function IssueTable({ issues, onDelete }) {
  const issueRows = issues.map(
    (issue) => (
      <IssueRow
        key={issue._id}
        issue={issue}
        onDelete={() => onDelete(issue._id)}
      />
    ),
  );
  /*
    // generation code
    (function(obj){
        let out='';
        for (let p in obj){
            out+=`<th>${p}</th>\n`;}
        console.log( out);
    })(obj)

    */
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>id</th>
          <th>status</th>
          <th>Owner</th>
          <th>created</th>
          <th>effort</th>
          <th>completionDate</th>
          <th>title</th>
          <th>delete</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}
function useSearchParamsUpdate(params) {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    update(event) {
      event.preventDefault();
      setSearchParams({ ...searchParams, ...params });
    },
    setSearchParams,
    searchParams,
  };
}

function IssueRow(props) {
  const { issue, onDelete } = props;

  return (
    <tr>
      <td><Link to={issue._id}>{issue._id.substr(-6)}</Link></td>
      <td><Link to={`?status=${issue.status}`}>{issue.status}</Link></td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
      <td>{issue.title}</td>
      <td><button type="button" onClick={onDelete}>X</button></td>
    </tr>
  );
}

function issue_jsonToJs(issue) {
  // date returns as a string.
  // rewrite with Obj.assign ???
  const newIssue = { ...issue };

  if (newIssue.completionDate) {
    newIssue.completionDate = new Date(issue.completionDate);
  }
  newIssue.created = new Date(newIssue.created);
  return newIssue;// for usage in `Promise`s or `map()`s
}

// eslint-disable-next-line no-unused-vars
export default function IssueList(props) {
  const [issues, setIssues] = useState([]);
  const [searchParams] = useSearchParams();
  const filters = { status: [...new Set(issues.map((issue) => issue.status))] };
  function fetchData() {
    fetch(
      `/api/v1/issues?${searchParams}`,
      { method: 'GET' },
    ).then((response) => {
      const json = response.json();
      if (response.ok) {
        return json;
      } if (response.status === 500) {
        return json.then((err) => setImmediate(() => alert(`Falied to fetch issues ${err.message}`)));
      }
      throw response;
    }).then((remote_data) => {
      const new_data = remote_data.records.map(issue_jsonToJs);
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

  function createIssue(newIssue) {
    return fetch(
      '/api/v1/issues',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue, null, ' '),
      },
    )
      .then((response) => [response.status, response.json()])
      .then(([status, json]) => {
        // const json = response.json();
        if (status === 200) { // ok
          Promise.resolve(json).then(issue_jsonToJs).then(addIssue);
          return true;// all done
        } if (status === 422) { // forgot a field ?
          json.then((err) => setImmediate(() => alert(`Falied to add issue ${err.message}`)));
          return false;
        }
        return false;// defualt failed
        // throw response;
      })
      .catch((err) => console.error(`Error in sending data to server: ${err.message}`));
  }

  function deleteIssue(issueId) {
    if (confirm(`Are you sure to delete issue : ${issueId}`)) {
      return fetch(
        `/api/v1/issue/_id/${issueId}`,
        {
          method: 'DELETE',
        },
      ).then((response) => {
        if (response.status === 200) { // ok
          fetchData();// update
          setTimeout(() => alert(`delete API: \nissue ${issueId} is deleted!`));
        }
      });
    }
    return Promise.resolve(false);// failed
  }

  useEffect(fetchData, [searchParams]);// run when search changes
  return (
    <div>
      <h1>Issue Tracker</h1>
      <IssueFilter filters={filters} />
      <hr />
      <button type="button" onClick={fetchData}>Refresh !</button>
      <button type="button" onClick={addTestIssue}>Add !</button>
      <IssueTable issues={issues} onDelete={deleteIssue} />
      <hr />
      <IssueAdd onSubmit={createIssue} />
    </div>
  );
}
