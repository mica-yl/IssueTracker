import React, { useState, ChangeEvent, ChangeEventHandler } from 'react';
import { Button, FormControl, Stack } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

export type IssueSearchProps = {
  onSearch: (searchText:string)=>void,
  onClear: ()=>void,
  initSearch?:string,
};

export default function IssueSearch(props:IssueSearchProps) {
  const { onSearch, onClear, initSearch } = props;
  const [searchText, setSearchText] = useState(initSearch);
  const onChange:ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchText(event.target.value);
  };
  return (
    <Stack direction="horizontal" gap={2}>
      <FormControl
        type="text"
        value={searchText}
        onChange={onChange}
      />
      <Button onClick={() => onSearch(searchText)}><Search /></Button>
      <Button onClick={() => (onClear(), setSearchText(''))}>clear</Button>
    </Stack>
  );
}

IssueSearch.defaultProps = {
  initSearch: '',
};
