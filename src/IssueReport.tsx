import React, { useEffect, useState } from 'react';
import { Card, Stack, Table } from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { useSearchParams } from 'react-router-dom';
import { Status as StatusStates } from '../server/issue';
import { FormattedSummary } from '../server/summary';
import { Filter, IssueFilterAccordion } from './IssueFilter';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initFilter = { status: '', effort_lte: '', effort_gte: '' };
  const currentFilter = {
    status: searchParams.get('status') || '',
    effort_lte: searchParams.get('effort_lte') || '',
    effort_gte: searchParams.get('effort_gte') || '',
  };
  function onApply(newFilter:Filter) {
    const Params = new URLSearchParams(searchParams);
    Object.entries(newFilter)
      .forEach(([key, value]) => {
        if (value === null) {
          Params.delete(key);
        } else {
          Params.set(key, value);
        }
      });
    Params.set('page', '1');
    setSearchParams(Params);
  }
  useEffect(() => { dataLoader('', searchParams).then(setSummary); }, [searchParams.toString()]);
  return (
    <Card>
      <Card.Header>Summary</Card.Header>
      <Card.Body>
        <Stack gap={3}>

          <IssueFilterAccordion
            initFilter={initFilter}
            currentFilter={currentFilter}
            onApply={onApply}
          />
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
