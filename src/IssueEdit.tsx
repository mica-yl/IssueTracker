import React, {
  FormEvent, useEffect, useReducer, useState,
} from 'react';
import { useParams, Link } from 'react-router-dom';
import useErrorBanner from './ErrorBanner';
import StatusFilter from './StatusFilter';

const statusOptions = ['All', 'Open', 'Assigned', 'New', 'Closed'];

function fetchIssue(id) {
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

function getHandler(state, setState) {
  return function (name) {
    return function onChange(event) {
      const issue = { ...state };
      issue[name] = event.target.value;
      setState(issue);
    };
  };
}

function onSubmit(event:FormEvent) {
  event.preventDefault();
}

// eslint-disable-next-line no-unused-vars
export default function IssueEdit(props) {
  const { id } = useParams();
  const { ErrorBanner, pushError } = useErrorBanner();
  const [issue, setIssue] = useState({
    _id: id,
    title: '',
    status: '',
    owner: '',
    effort: '',
    completionDate: '',
    created: new Date().toString(),
  });
  const {
    _id: ID, title, status, owner, effort,
    completionDate, created,
  } = issue;
  const onChange = getHandler(issue, setIssue);

  useEffect(function loadIssue() {
    fetchIssue(id).then((result) => {
      if (result.message) {
        pushError({ source: 'Error', message: result.message });
        console.error(result);
      } else {
        setIssue({
          ...result,
          created: new Date(result.created).toDateString(),
          completionDate: result.completionDate ? new Date(result.completionDate).toDateString() : '',
        });
      }
    });
  }, [id]);
  return (
    <div>
      <Link to="/issues">Back</Link>
      <p>
        issue :
      </p>
      <ErrorBanner />
      <form onSubmit={onSubmit}>
        {`ID : ${ID}`}
        <br />
        {`Created : ${created}`}
        <br />
        {'Title : '}
        <input value={title} onChange={onChange('title')} />
        <br />
        {'Owner : '}
        <input value={owner} onChange={onChange('owner')} />
        <br />
        <StatusFilter
          defaultChoice={status}
          Choices={statusOptions}
          onChange={onChange('status')}
        />
        <br />
        {'Effort : '}
        <input value={effort} size={5} onChange={onChange('effort')} />
        <br />
        {'Completed : '}
        <input value={completionDate} onChange={() => 0} />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
