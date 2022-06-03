import React, { useState, ChangeEvent, ChangeEventHandler } from 'react';
import { Button, FormControl, Stack } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { LinkContainer } from 'react-router-bootstrap';
import AsyncSelect, { useAsync } from 'react-select/async';
import { Issue } from '../server/issue';

export type IssueSearchProps = {
  gotoSearch: (searchText:string)=>string,
  gotoClear: ()=>string,
  initSearch?:string,
  loadIssues: (text:string)=> Issue<Date>,
};

async function dataLoader(initValue:string) {
  return (
    [
      { value: initValue, label: `init value:${initValue}` },
      { value: `${initValue}ddd`, label: `init value + ddd :${initValue}` },

    ]
  );
}

function issuesToOptions(dataFetcher) {
  return async (value:string) => {
    const { issues }:{issues:unkown[]} = await dataFetcher(value);
    return issues.map((issue) => ({
      value,
      label: issue.title,
    }));
  };
}

export default function IssueSearch(props:IssueSearchProps) {
  const {
    gotoSearch, gotoClear, initSearch, loadIssues, // loadOptions,
  } = props;
  const [searchText, setSearchText] = useState(initSearch);
  const onChange:ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchText(event.target.value);
  };
  return (
    <Stack direction="horizontal" gap={2}>
      <AsyncSelect
        inputValue={searchText}
        loadOptions={issuesToOptions(loadIssues)}
        onChange={(newValue, actionMeta) => {
          if (actionMeta.action === 'select-option') {
            setSearchText(newValue.value);
          }
        }}
        onInputChange={(newValue, actionMeta) => {
          if (['menu-close', 'input-blur'].includes(actionMeta.action)) {
            return;
          }
          setSearchText(newValue);
        }}

      />
      {/* <FormControl
        type="text"
        value={searchText}
        onChange={onChange}
      /> */}
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
