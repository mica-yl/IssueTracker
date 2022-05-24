/* eslint-disable react/jsx-no-bind */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise } from 'react-bootstrap-icons';

import IssueAdd from './IssueAdd';
import { IssueFilterAccordion } from './IssueFilter';
import IssueTable from './IssueTable';
import useAsk from './Ask';
import useAlert from './AlertMsg';
import useIssues, { APIContext } from './IssueAPI';

/*
function useIssues(i : Issue[] = []) {
  const [issues, setIssues] = useState(i);
  return {
    set: setIssues,
    get get() { return issues; },
    add(issue) {
      if (issue) { // issue shouldn't be null or undefined.
        setIssues((old) => old.concat(issue));
      }
    },
    addTestIssue() {
      this.add({
        _id: '05896dgfhls56s5',
        status: 'New',
        owner: 'Pieta',
        created: new Date(),
        title: 'Completion date should be optional !',
      });
    },

  };
}
*/
// export const APIContext = use

// eslint-disable-next-line no-unused-vars
export default function IssueList(props) {
  const { Ask, ask } = useAsk();
  const { AlertMsg, alertAsync } = useAlert();
  const { API } = props;
  const {
    addTestIssue, confirmDelete, createIssue, fetchData, issues, searchParams,
  // } = useIssues(alertAsync, ask);
  } = API;
  useEffect(
    fetchData,
    [searchParams.toString()],
  );// run when search changes

  const filters = { status: [...new Set(issues.map((issue) => issue.status))] };

  return (
    <Stack gap={3}>
      <Stack>
        <IssueFilterAccordion filters={filters} />
      </Stack>
      <Stack direction="horizontal" gap={3}>
        <Button type="button" onClick={fetchData}>
          <ArrowClockwise />
          Refresh !
        </Button>
        <Button type="button" onClick={addTestIssue}>Add !</Button>
      </Stack>
      <IssueTable issues={issues} onDelete={confirmDelete} />

    </Stack>
  );
}
