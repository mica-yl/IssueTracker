/* eslint-disable react/jsx-no-bind */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useReducer } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise } from 'react-bootstrap-icons';

import { IssueFilterAccordion } from './IssueFilter';
import IssueTable from './IssueTable';
import { API } from './IssueAPI';
import { IssuePagination } from './IssuePagination';

import { mergeSearchParams } from './react-router-hooks';
import { Selection } from './StatusFilter';
import IssueSearch from './IssueSearch';

function uniqueMergeReducer(state:string[], action:string[]) {
  const newKeys = action
    .filter((k) => !state.includes(k));
  return state.concat(newKeys);
}

export default function IssueList(props:{API:API}) {
  const { API } = props;
  const {
    addTestIssue, confirmDelete, fetchData,
    issues, searchParams, maxIssues, newSearchParams, setSearchParams,
  // } = useIssues(alertAsync, ask);
  } = API;
  /**
   * needs to be automated by limiting search parameters use.
   */
  const searchKeys = ['owner', 'status', 'effort_le', 'effort_gt', 'search'];
  const { dataFetcher, issuesPerPage } = fetchData(searchKeys);
  const maxPages = Math.ceil(maxIssues / issuesPerPage);
  useEffect(
    dataFetcher,
    [searchParams.toString()],
  );// run when search changes

  const filters = { status: [...new Set(issues.map((issue) => issue.status))] };

  return (
    <Stack gap={3}>
      <Stack>
        <IssueFilterAccordion
          filters={filters}
        />
      </Stack>
      <Stack direction="horizontal" gap={3}>
        <Button type="button" onClick={dataFetcher}>
          <ArrowClockwise />
          Refresh !
        </Button>
        <Button type="button" onClick={addTestIssue}>Add !</Button>
        <IssueSearch
          initSearch={searchParams.get('search') || ''}
          onSearch={(search) => setSearchParams(newSearchParams({ search, page: 1 }))}
          onClear={() => {
            searchParams.delete('search');
            setSearchParams(searchParams);
          }}
        />
      </Stack>
      <IssueTable issues={issues} onDelete={confirmDelete} />
      <Selection
        defaultChoice={searchParams.get('issuesPerPage')}
        Choices={['10', '15', '20', maxIssues.toString()]}
        onChange={(e) => setSearchParams(newSearchParams(
          { issuesPerPage: e.target.value, page: 1 },
        ))}
      />
      <div className="d-flex justify-content-center">
        <IssuePagination
          current={parseInt(searchParams.get('page'), 10) || 1}
          max={maxPages}
          interval={10}
          onRedirect={(page:number) => `?${newSearchParams({ page: page.toString() }).toString()}`}
        />
      </div>
    </Stack>
  );
}
