import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table';

import { Issue } from '#server/issue';
import { ConditionalRender } from '#client/utils/ConditionalRender';
import IssueRow from './IssueRow';
import { UserContext } from '../login/UserProvider';

type IssueTableProps = {
  issues : Issue[],
  onDelete:(id:string)=>void
};

export default function IssueTable(
  { issues, onDelete }:IssueTableProps,
) {
  const { signedIn } = useContext(UserContext);
  const issueRows = (function generateIssueRows() {
    return issues.map(
      (issue: Issue) => (
        <IssueRow
          key={issue._id}
          issue={issue}
          onDelete={() => (signedIn ? onDelete(issue._id) : () => 0)}
        />
      ),
    );
  }());
  /*
    // generation code
    (function(obj){
        let out='';
        for (let p in obj){
            out+=`<th>${p}</th>\n`;}
        console.log( out);
    })(obj)

    */
  return (
    <Table hover responsive bordered striped>
      <thead>
        <tr>
          <th>id</th>
          <th>status</th>
          <th>Owner</th>
          <th>created</th>
          <th>effort</th>
          <th>completionDate</th>
          <th>title</th>
          <ConditionalRender condition={signedIn}>
            <th>delete</th>
          </ConditionalRender>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}
