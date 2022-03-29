import React from 'react';
import IssueRow from './IssueRow';
import { Issue } from './Issue';

export default function IssueTable(
  { issues, onDelete }:{issues : Issue[],
    onDelete:(id:string)=>void},
) {
  const issueRows = issues.map(
    (issue:{_id:string}) => (
      <IssueRow
        key={issue._id}
        issue={issue}
        onDelete={() => onDelete(issue._id)}
      />
    ),
  );
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
    <table className="bordered-table">
      <thead>
        <tr>
          <th>id</th>
          <th>status</th>
          <th>Owner</th>
          <th>created</th>
          <th>effort</th>
          <th>completionDate</th>
          <th>title</th>
          <th>delete</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}
