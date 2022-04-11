import React, {
  ChangeEvent,
  FormEvent, FormEventHandler, useEffect, useReducer, useState,
} from 'react';
import { useParams, Link } from 'react-router-dom';
import useErrorBanner from './ErrorBanner';
import Input, { Maybe } from './Input';
import StatusFilter from './StatusFilter';
import { Status, Issue, convertIssue } from '../server/issue';

const statusOptions = ['All', ...Status];

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
function useFields(
  initIssue: Record<string, unknown>,
  initValidity?: Record<string, boolean> | ((name: string) => boolean) | boolean,
) {
  function merger(state, action) {
    return { ...state, ...action };
  }
  const [issue, setIssue] = useState(initIssue);
  // const [issue, dispatchIssue] = useReducer(merger, initIssue);
  const [validity, dispatchValidity] = useReducer(
    merger,
    (function choose() {
      if (typeof initValidity === 'object') {
        return initValidity;
      }

      let defval = false;
      let pred = (_: string) => defval;
      const Validity = { ...initIssue };

      if (typeof initValidity === 'boolean') {
        defval = initValidity;
      } else if (typeof initValidity === 'function') {
        pred = initValidity;
      }

      Object.entries(Validity).forEach(([k, _]) => { Validity[k] = pred(k); });
      return Validity;
    }()),
  );
  function getInvalidFields(): string[] {
    return Object.keys(validity).filter((k) => !validity[k]);
  }
  return {
    issue,
    validity,
    // dispatchIssue,
    setIssue,
    dispatchValidity,
    getInvalidFields,
    getHandler(name: string) {
      return function onChange<X>(event: ChangeEvent<HTMLInputElement>, value?: Maybe<X>) {
        const $issue = { ...issue };
        if (value !== undefined) {
          Maybe(value, ($value) => {
            // just value
            dispatchValidity({ [name]: true });
            $issue[name] = $value;
          }, () => {
            // nothing
            dispatchValidity({ [name]: false });
          });
        } else {
          $issue[name] = event.target.value;
          dispatchValidity({ [name]: true });
        }
        setIssue($issue);
      };
    },

  };
}
function getHandler(state, setState) {
  return function (name) {
    return function onChange(event: ChangeEvent<HTMLInputElement>, value?) {
      const issue = { ...state };
      if (value !== undefined) {
        Maybe(value, ($value) => {
          // just value
          issue[name] = $value;
        }, () => {
          // nothing - invalid value
          console.error(`invalid : ${event.target.value}`);
        });
      } else {
        issue[name] = event.target.value;
      }
      setState(issue);
    };
  };
}

export default function IssueEdit() {
  const { id } = useParams();
  const {
    ErrorBanner, pushError, clearErrors, pushSuccess,
  } = useErrorBanner();
  const initIssue = {
    _id: id,
    title: '',
    status: '',
    owner: '',
    effort: null,
    completionDate: null,
    created: null,
  };
  const {
    issue, setIssue, validity, getInvalidFields,
    getHandler: onChange,
  } = useFields(initIssue, true);
  const {
    _id: ID, title, status, owner, effort,
    completionDate, created,
  } = issue;

  useEffect(function loadIssue() {
    fetchIssue(id).then((result) => {
      if (result.message) {
        pushError({ source: 'Error', message: result.message });
        console.error(result);
      } else {
        setIssue({
          ...result,
          created: new Date(result.created),
          completionDate: result.completionDate ? new Date(result.completionDate) : null,
        });
      }
    });
  }, [id]);
  useEffect(function fieldsValidityAutoCheck() {
    const key = 'invalid-fileds';
    const invalids = getInvalidFields();
    if (invalids.length > 0) {
      clearErrors(key);
      pushError({
        key,
        source: 'some fields are invalid',
        message: invalids.join(', '),
      });
    } else {
      clearErrors(key);
    }
  }, [validity]);

  function onSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = 'update-issue';
    const source = 'issue updating';
    const sentIssue = Object.fromEntries(Object.entries(issue).filter(([k, v]) => v !== null));
    clearErrors(key);
    if (getInvalidFields().length === 0) {
      fetch(
        `/api/v1/issues/${issue._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sentIssue),
        },
      ).then((res) => {
        if (res.ok) {
          res.json()
            .then(convertIssue)
            .then((updatedIssue) => {
              pushSuccess({
                key,
                source,
                message: 'Updated issue successfully.',
                type: 'Success',
              });
              setIssue({ ...initIssue, ...updatedIssue });
            });
        } else {
          res.json().then((err) => pushError({ key, source, message: `Failed to update issue: ${err.message}` }));
        }
      }).catch((err) => pushError({
        key,
        source,
        message: `Error in sending data to server : ${err.message}`,
      }));
    } else {
      pushError({ key, source, message: 'fix invalid fields first' });
    }
  }

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
        <Input validitionType="number" value={effort} size={5} onChange={onChange('effort')} />
        <br />
        {'Completed : '}
        <Input validitionType="date" value={completionDate} onChange={onChange('completionDate')} />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
