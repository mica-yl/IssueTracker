import React from "react";
import ReactDOM from "react-dom";
import IssueList from "./IssueList.jsx";

const root = document.getElementById('root');


ReactDOM.render(<React.StrictMode><IssueList /></React.StrictMode>, root);

if (module.hot) {
    module.hot.accept();
}