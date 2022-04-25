import React, {
  ChangeEvent, Dispatch, useReducer, useEffect,
} from 'react';
import { Link } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { useSearchParamsUpdate } from './react-router-hooks';
import StatusFilter from './StatusFilter';
import { Status } from '../server/issue';

function EffortFilter(props) {
  const { from: [from, handleFrom], to: [to, handleTo] } = props;
  return (
    <Form.Group>
      <Form.Label>effort</Form.Label>
      <InputGroup>
        <Form.Control value={from} placeholder="from" onChange={handleFrom} />
        <InputGroup.Text>-</InputGroup.Text>
        <Form.Control value={to} placeholder="to" onChange={handleTo} />
      </InputGroup>
    </Form.Group>
  );
}

function filterReducer(state, action) {
  const newState = { ...state, ...action };
  return newState;
}
type Filter= Record<string, string>;
type Pred<X> = (i:X)=>boolean;
function equalFilterProp(
  prop:string,
  isValid:Pred<string>,
  filter1:Filter,
  filter2:Filter,
) : boolean {
  // not a string why?
  const value1 = filter1[prop] || ''; const value2 = filter2[prop] || '';
  const valid1 = isValid(value1); const valid2 = isValid(value2);

  if (valid1 && valid2) {
    return value1 === value2;
  } if (!valid1 && !valid2) {
    return true;
  }
  return false;
}

function useFilter(initFilter:Filter) {
  const [filter, dispatchFilter] : [Filter, Dispatch<unknown>] = useReducer(
    filterReducer,
    initFilter,
  );
  const { reduceSearchParams, searchParams } = useSearchParamsUpdate();
  const properties:[string, Pred<string> ][] = [];
  function equalFilterAsSubset(aFilter:Filter) {
    return (properties
      .every(([p, isValid]) => equalFilterProp(p, isValid, filter, aFilter)));
  }
  return {
    filter,
    /**
     * returns true if current filter is a subset of aFilter
     * @param aFilter
     */
    equalFilterAsSubset,
    changed() {
      const searchParamsObject = Object.fromEntries(searchParams.entries());
      return !equalFilterAsSubset(searchParamsObject);
      // return !(properties
      //   .every(([p, isValid]) => equalFilterProp(p, isValid, filter, aFilter)));
    },
    /**
     *
     * @param prop : properity name
     * @param isValid : a predicte return false to ignore the input string
     * @returns `{readonly [prop],dispatch}`
     */
    useProperty(
      prop:string,
      isValid:unknown[]|(Pred<string>) = (s) => ![''].includes(s),
    ) {
      properties.push([prop,
        typeof isValid === 'function' ? isValid : (s) => !isValid.includes(s),
      ]);
      return { // to array
        get [prop]() { return filter[prop]; },
        dispatch(event:ChangeEvent<HTMLSelectElement>) {
          const { target: { value } } = event;
          dispatchFilter({ [prop]: value });
        },
      };
    },
    applyFilter() {
      reduceSearchParams(function apply(u) {
        properties.forEach(([p, isValid]) => {
          if (isValid(filter[p])) {
            u.set(p, filter[p]);
          } else {
            u.delete(p);
          }
        });
        return u;
      });
    },
    resetFilter() {
      // dispatchFilter(initFilter);
      const oldFilter:Filter = Object.fromEntries(properties
        .map(([p, _]) => ([p, searchParams.has(p) ? searchParams.get(p) : initFilter[p]])));
        // .filter(([_, v]) => v !== undefined));

      dispatchFilter(oldFilter);
    },
    clearFilter() {
      dispatchFilter(initFilter);
    },
    removeFilters() {
      reduceSearchParams(function clear(u) {
        properties.forEach(([p, _isValid]) => {
          u.delete(p);
        });
        return u;
      });
    },
  };
}

const statusOptions = Status;
const isNumber = (s:string) => (s !== '') && !!(s.match(/^\d*$/));
const isValidStatus = (s) => statusOptions.includes(s);
const statusAll = '[ All ]';
export default function IssueFilter(props) {
  const initFilter = {
    status: statusAll,
    effort_lte: '',
    effort_gte: '',
  };
  const {
    useProperty, applyFilter, clearFilter, resetFilter, changed,
  } = useFilter(initFilter);
  // const [changed, setChanged] = useState(false);
  const { dispatch: dispatchStatus, status } = useProperty('status', isValidStatus);
  const { dispatch: dispatchEffortL, effort_lte } = useProperty('effort_lte', isNumber);
  const { dispatch: dispatchEffortG, effort_gte } = useProperty('effort_gte', isNumber);

  useEffect(resetFilter, []);// use once at loading
  const col = {
    xs: 6, sm: 4, md: 3, lg: 2,
  };
  return (
    <Row>
      <Col>
        <StatusFilter
          defaultChoice={status}
          Choices={[statusAll].concat(statusOptions)}
          onChange={dispatchStatus}
        />
      </Col>
      <Col>
        <EffortFilter
          from={[effort_gte, dispatchEffortG]}
          to={[effort_lte, dispatchEffortL]}
        />
      </Col>
      <Col>
        <Form.Group>
          <ButtonToolbar>
            <ButtonGroup>
              <Button type="submit" onClick={applyFilter}>Apply</Button>
              <Button
                type="reset"
                onClick={resetFilter}
                disabled={!changed()}
              >
                Reset

              </Button>
              <Form.Label> </Form.Label>
              <Button type="button" onClick={clearFilter}>Clear</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Form.Group>
      </Col>
    </Row>
  );
}
