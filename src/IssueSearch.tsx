import React, { useState, ChangeEvent, ChangeEventHandler } from 'react';
import { Button, FormControl, Stack } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { LinkContainer } from 'react-router-bootstrap';

export type IssueSearchProps = {
  gotoSearch: (searchText:string)=>string,
  gotoClear: ()=>string,
  initSearch?:string,
};

export default function IssueSearch(props:IssueSearchProps) {
  const { gotoSearch, gotoClear, initSearch } = props;
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
      <LinkContainer to={gotoSearch(searchText)}>
        <Button><Search /></Button>
      </LinkContainer>
      <LinkContainer to={gotoClear()}>
        <Button onClick={() => setSearchText('')}>clear</Button>
      </LinkContainer>
    </Stack>
  );
}

IssueSearch.defaultProps = {
  initSearch: '',
};
