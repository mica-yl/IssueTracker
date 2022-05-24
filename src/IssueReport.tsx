import React, { useEffect, useState } from 'react';
import { Card, Stack, Table } from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { useSearchParams } from 'react-router-dom';
import { Status as StatusStates } from '../server/issue';
import { FormattedSummary } from '../server/summary';
import IssueFilter, { IssueFilterAccordion } from './IssueFilter';

async function dataLoader(host = '', searchParams: URLSearchParams): Promise<FormattedSummary<string>> {
  return fetch(`${host}/api/v1/issues?_summary&${searchParams.toString()}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('can\'t load summary.');
    });
}

export function IssueReport() {
  const [summary, setSummary] = useState(null as FormattedSummary<string>);
  const [searchParams] = useSearchParams();
  useEffect(() => { dataLoader('', searchParams).then(setSummary); }, [searchParams]);
  return (
    <Card>
      <Card.Header>Summary</Card.Header>
      <Card.Body>
        <Stack gap={3}>

          <IssueFilterAccordion />
          <Table hover responsive bordered striped>
            <thead>
              <tr>
                {['X'].concat(StatusStates).map((x) => <th key={x}>{x}</th>)}
              </tr>
              {summary ? Object.entries(summary)
                .map(([owner, counts]) => (
                  <tr key={owner}>
                    <td key={owner}>{owner}</td>
                    {StatusStates.map((statusName) => <td key={`${owner}-${statusName}`}>{counts[statusName] || 0}</td>)}
                  </tr>
                )) : null}

            </thead>
          </Table>
        </Stack>
      </Card.Body>
    </Card>

  );
}
