import React, {
  ChangeEvent,
  FormEvent, useEffect, useReducer, useState,
} from 'react';
import { useParams, Link } from 'react-router-dom';
import useErrorBanner from './ErrorBanner';
import Input, { Maybe } from './Input';
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

function onSubmit(event: FormEvent) {
  event.preventDefault();
}

// eslint-disable-next-line no-unused-vars
export default function IssueEdit(props) {
  const { id } = useParams();
  const { ErrorBanner, pushError, clearErrors } = useErrorBanner();
  const initIssue = {
    _id: id,
    title: '',
    status: '',
    owner: '',
    effort: '',
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
          created: new Date(result.created).toDateString(),
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
