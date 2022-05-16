import React, { useEffect, useState } from 'react';
import {
  Routes, Route, Outlet, useParams,
} from 'react-router-dom';
import IssueEdit from './IssueEdit';
import { useAPI } from './IssueAPI';
import { DynamicNavigate } from './DynamicallyRouteApp';

export function HelloWorld({ addressee = '' }:{addressee:string}) {
  const [name, setName] = useState(addressee);
  return (
    <>
      <h1>
        Hello
        {' '}
        <input value={name} onChange={(e) => { setName(e.target.value); }} />
        !
      </h1>
      <button type="button" onClick={() => alert(name)}>say hi</button>

    </>
  );
}

function App() {
  return (
    <>
      <HelloWorld addressee="Routes" />
      <Outlet />
    </>

  );
}

function IssueList({ issues }) {
  return (
    <>
      <h2>IssueList</h2>
      {JSON.stringify(issues)}
    </>
  );
}
// function IssueEdit() {
//   const { id } = useParams();
//   return (
//     <h2>
//       IssueEdit of
//       {' '}
//       {id}
//       {' '}
//       {/* {JSON.stringify(initIssue)} */}
//     </h2>
//   );
// }
function NotFound() {
  return <h2>NotFound</h2>;
}
export function AppRoutes(props:{response?:Response}) {
  const { response, url } = props;
  const { API, Components } = useAPI();
  const { fetchData, issues } = API;
  useEffect(fetchData, []);
  return (
    <Routes>
      <Route index element={<DynamicNavigate to="issues" response={response} />} />
      <Route element={<App />}>
        <Route path="issues" element={<IssueList issues={issues} />} />
        <Route path="issues/:id" element={<IssueEdit API={API} Components={Components} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
