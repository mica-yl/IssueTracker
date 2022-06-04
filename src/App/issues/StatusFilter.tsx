import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSearchParamsUpdate } from '../../react-router-hooks';

type SelectionProps= {
  defaultChoice:string,
  Choices:string[],
  onChange:React.ChangeEventHandler<HTMLSelectElement>, }

export function Selection(props:SelectionProps) {
  const { defaultChoice, onChange, Choices } = props;
  return (
    <Form.Select value={defaultChoice || Choices[0]} onChange={onChange}>
      {Choices.map((aChoice) => (
        <option key={aChoice} value={aChoice}>{aChoice}</option>
      ))}
    </Form.Select>
  );
}
export function useStatus(statusArr: string[], noSelection = 'All') {
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
      }
    },
    applyStatus() {
      if (statusFilter !== noSelection) {
        setSearchParams(newSearchParams({ status: statusFilter }));
      } else {
        reduceSearchParams((u) => new URLSearchParams(
          [...u.entries()]
            .filter(([k, _v]) => k !== 'status'),
        ));
      }
    }
    ,
  };
}

export default function StatusFilter(props) {
  const { defaultChoice, onChange, Choices } = props;
  return (
    <Form.Group>
      <Form.Label>
        status
      </Form.Label>
      <InputGroup>
        <Selection
          defaultChoice={defaultChoice}
          Choices={Choices}
          onChange={onChange}
        />
      </InputGroup>
    </Form.Group>
  );
}
