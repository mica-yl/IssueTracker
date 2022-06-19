import React, {
  ChangeEvent,
  FormEvent, useContext, useEffect, useReducer, useState,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form, Button, ButtonToolbar, Card,
  Col, Row, ButtonGroup,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { API } from '#client/IssueAPI';
import { Status } from '#server/issue';
import { UserContext } from '#client/App/login/UserProvider';
import { ConditionalRender } from '#client/utils/ConditionalRender';
import useErrorBanner from './ErrorBanner';
import Input, { Maybe } from '../Input';
import { Selection } from '../StatusFilter';

const statusOptions = [...Status];

function useFields(
  initIssue: Record<string, unknown>,
  initValidity?: Record<string, boolean> | ((name: string) => boolean) | boolean,
) {
  function merger(oldState, newPatialState) {
    // Object.entries(newPatialState).forEach(([k, v]) => { });
    return { ...oldState, ...newPatialState };
  }
  const [issue, setIssue] = useState(initIssue);
  // const [issue, dispatchIssue] = useReducer(merger, initIssue);
  const [validity, dispatchValidity] = useReducer(
    merger,
    (function choose() {
      if (typeof initValidity === 'object') {
        return initValidity;
      }

      let defval = false;
      let pred = (_: string) => defval;
      const Validity = { ...initIssue };

      if (typeof initValidity === 'boolean') {
        defval = initValidity;
      } else if (typeof initValidity === 'function') {
        pred = initValidity;
      }

      Object.entries(Validity).forEach(([k, _]) => { Validity[k] = pred(k); });
      return Validity;
    }()),
  );
  function getInvalidFields(): string[] {
    return Object.keys(validity).filter((k) => !validity[k]);
  }
  return {
    issue,
    validity,
    // dispatchIssue,
    setIssue,
    dispatchValidity,
    getInvalidFields,
    getHandler(name: string) {
      return function onChange<X>(event: ChangeEvent<HTMLInputElement>, value?: Maybe<X>) {
        const $issue = { ...issue };
        if (value !== undefined) {
          Maybe(value, ($value) => {
            // just value
            dispatchValidity({ [name]: true });
            $issue[name] = $value;
          }, () => {
            // nothing
            dispatchValidity({ [name]: false });
          });
        } else {
          $issue[name] = event.target.value;
          dispatchValidity({ [name]: true });
        }
        setIssue($issue);
      };
    },

  };
}
function getHandler(state, setState) {
  return function (name) {
    return function onChange(event: ChangeEvent<HTMLInputElement>, value?) {
      const issue = { ...state };
      if (value !== undefined) {
        Maybe(value, ($value) => {
          // just value
          issue[name] = $value;
        }, () => {
          // nothing - invalid value
          console.error(`invalid : ${event.target.value}`);
        });
      } else {
        issue[name] = event.target.value;
      }
      setState(issue);
    };
  };
}

export default function IssueEdit(props:{API:API}) {
  const { API: { updateOneIssue, getOneIssue, confirmDelete } } = props;
  const { signedIn } = useContext(UserContext);
  const { id } = useParams();
  const {
    ErrorBanner, pushError, clearErrors, pushSuccess,
  } = useErrorBanner();
  const initIssue = {
    _id: id,
    title: '',
    status: '',
    owner: '',
    effort: null,
    completionDate: null,
    created: null,
  };
  const {
    issue, setIssue, validity, getInvalidFields,
    getHandler: onChange,
  } = useFields(initIssue, true);
  const {
    _id: ID, title, status, owner, effort,
    completionDate, created,
  } = issue;
  const [col1, col2] = [{ sm: 3 }, { sm: 9, lg: 7 }];

  const goto = useNavigate();

  useEffect(function loadIssue() {
    getOneIssue(id).then((result) => {
      if (result.message) {
        pushError({ source: 'Error', message: result.message });
        console.error(result);
      } else {
        setIssue({
          ...result,
          created: new Date(result.created),
          completionDate: result.completionDate ? new Date(result.completionDate) : null,
        });
      }
    });
  }, [id]);

  useEffect(function fieldsValidityAutoCheck() {
    const key = 'invalid-fileds';
    const invalids = getInvalidFields();
    if (invalids.length > 0) {
      clearErrors(key);
      pushError({
        key,
        source: 'some fields are invalid',
        message: invalids.join(', '),
      });
    } else {
      clearErrors(key);
    }
  }, [...Object.entries(validity).sort().flat()]);

  function onSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = 'update-issue';
    const source = 'issue updating';
    const sentIssue = Object.fromEntries(Object.entries(issue).filter(([_k, v]) => v !== null));
    clearErrors(key);
    if (getInvalidFields().length === 0) {
      updateOneIssue(issue._id, sentIssue).then(
        (updatedIssue) => {
          pushSuccess({
            key,
            source,
            message: 'Updated issue successfully.',
            type: 'Success',
          });
          setIssue({ ...initIssue, ...updatedIssue });
        },
        (error) => { pushError({ key, source, message: error.message }); },
      );
    } else {
      pushError({ key, source, message: 'fix invalid fields first' });
    }
  }

  return (
    <Card>
      <Card.Header>Edit Issue</Card.Header>
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <div
            className="my-auto"
            style={{
              position: 'fixed',
              top: 30,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            <ErrorBanner alertStyle={{ display: 'inline-block', width: 500 }} />
          </div>
          {/*
          [['ID',ID,Form.Text],
            ['Created',created,Form.Text],
          ].map(([name,state,Component])=>(
            <Row>
            <Col {...col1}>
              <Form.Label>ID</Form.Label>
            </Col>
            <Col {...col2}>
              <Component>{ID}</Component>
            </Col>
          </Row>
          ))
          */
          }
          <Row>
            <Col {...col1}>
              <Form.Label>ID</Form.Label>
            </Col>
            <Col {...col2}>
              <Form.Text>{ID}</Form.Text>
            </Col>
          </Row>
          <Form.Group>
            <Row>
              <Col as={Form.Label} {...col1}>
                Created
              </Col>
              <Col as={Form.Text} {...col2}>
                {created ? created.toString() : ''}
              </Col>
            </Row>
          </Form.Group>
          <Row>
            <Col {...col1}>
              <Form.Label>Title </Form.Label>
            </Col>
            <Col {...col2}>
              <Form.Control required value={title} onChange={onChange('title')} disabled={!signedIn} />
            </Col>
          </Row>
          <Row>
            <Col {...col1}>
              <Form.Label>Owner</Form.Label>

            </Col>
            <Col {...col2}>
              <Form.Control value={owner} onChange={onChange('owner')} disabled={!signedIn} />
            </Col>
          </Row>
          <Row>
            <Col {...col1}><Form.Label>Status</Form.Label></Col>
            <Col {...col2}>
              <Selection
                defaultChoice={status}
                Choices={statusOptions}
                onChange={onChange('status')}
                disabled={!signedIn}
              />
            </Col>
          </Row>
          <Row>
            <Col {...col1}><Form.Label>Effort</Form.Label></Col>
            <Col {...col2}>
              <Input
                validitionType="number"
                value={effort}
                size={5}
                onChange={onChange('effort')}
                disabled={!signedIn}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col as={Form.Label} {...col1}>Completed</Col>
            <Col {...col2}>
              <Input
                validitionType="date"
                value={completionDate}
                onChange={onChange('completionDate')}
                disabled={!signedIn}
              />
            </Col>
          </Row>
          <ButtonToolbar className="justify-content-between">
            <ButtonGroup>
              <ConditionalRender condition={signedIn}>
                <Button type="submit">Submit</Button>
              </ConditionalRender>
              <LinkContainer to="/issues">
                <Button variant={signedIn ? 'link' : 'outline-secondary'}>Back</Button>
              </LinkContainer>
            </ButtonGroup>
            <ConditionalRender condition={signedIn}>
              <Button
                variant="outline-danger"
                className="pull-right"
                onClick={() => confirmDelete(id)
                  .then((deleted) => (deleted ? goto('/issues') : null))}
              >
                Delete

              </Button>
            </ConditionalRender>
          </ButtonToolbar>
        </Form>
      </Card.Body>
    </Card>
  );
}
