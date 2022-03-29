import React, { useState } from 'react';
import { useSearchParamsUpdate } from './react-router-hooks';

function Selection(props) {
  const { defaultChoice, onChange, Choices } = props;
  return (
    <select value={defaultChoice} onChange={onChange}>
      {Choices.map((aChoice) => (
        <option key={aChoice} value={aChoice}>{aChoice}</option>
      ))}
    </select>

  );
}
function useStatus(statusArr: string[], noSelection = 'All') {
  const statusSet = [...new Set([noSelection, ...statusArr])];
  const [statusFilter, setStatusFilter] = useState(noSelection);
  const { setSearchParams, newSearchParams, reduceSearchParams } = useSearchParamsUpdate();
  return {
    statusFilter,
    status: statusSet,
    changeStatus(event) {
      const status = event.target.value;
      if (statusSet.includes(status)) {
        setStatusFilter(status);
        if (status !== noSelection) {
          setSearchParams(newSearchParams({ status }));
        } else {
          reduceSearchParams((u) => new URLSearchParams(
            [...u.entries()]
              .filter(([k, _v]) => k !== 'status')
          ));
        }
      }
    },
  };
}
export function StatusFilter(props) {
  const { statusArr } = props;
  const { statusFilter, changeStatus, status } = useStatus(statusArr);
  return (
    <>
      status :
      {' '}
      <Selection
        defaultChoice={statusFilter}
        Choices={status}
        onChange={changeStatus} />
    </>
  );
}
