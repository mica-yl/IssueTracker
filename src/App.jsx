import IssueAdd from "./IssueAdd.jsx";

const { useState, useEffect } = React;

const root = document.getElementById('root');

function IssueList(props) {
    const [issues, setIssues] = useState([]);
    useEffect(fetchData, []);// run once ! 

    function fetchData() {
        fetch('/api/v1/issues',
            { method: 'GET' }).then(function (response) {
                const json = response.json();
                if (response.ok) {
                    return json;
                } else if (response.status == 500) {
                    return json.then((err) =>
                        setImmediate(() => alert(`Falied to fetch issues ${err.message}`)));
                } else {
                    throw response;
                }
            }).then(function (remote_data) {
                const new_data = remote_data.records;
                new_data.forEach((issue) => issue_jsonToJs(issue, { pure: false }));
                setIssues(new_data);
            })
            .catch(err => console.error(err));
    }
    function issue_jsonToJs(issue, options = { pure: true }) {
        // date returns as a string.
        // rewrite with Obj.assign ???
        if (options.pure) {
            issue = Object.assign({}, issue);//copy issue
        }
        if (issue.completionDate) {
            issue.completionDate = new Date(issue.completionDate);
        }
        issue.created = new Date(issue.created);
        return issue;// for usage in `Promise`s or `map()`s
    }
    function addTestIssue() {
        addIssue({
            status: 'New', owner: 'Pieta', created: new Date(),
            title: 'Completion date should be optional !',
        });
    }
    function addIssue(issue) {
        if (issue) {// issue shouldn't be null or undefined.
            setIssues(function addIssue_safely(data) {
                return data.concat(
                    //  isNaN(issue.id) ? Object.assign({ id: data.length + 1, }, issue) : issue
                    issue
                );
            });
        }
    }

    function createIssue(newIssue) {
        fetch('/api/v1/issues',
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newIssue, null, ' '),
            })
            .then(function handlePostIssue(response) {
                const json = response.json();
                if (response.ok) {
                    // should i return response instead ?
                    return json.then(issue_jsonToJs).then(addIssue);
                } else if (response.status == 422) {// forgot a field ?
                    json.then(err =>
                        setImmediate(() => alert(`Falied to add issue ${err.message}`)));
                    return response;
                } else {
                    throw response;
                }
            }).catch(err =>
                console.error(`Error in sending data to server: ${err.message}`));
    }

    function deleteIssue(issueId) {
        setImmediate(()=> alert(`TODO : delete API ? \nit will delete ${issueId} `));
     }


    return (
        <div>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <hr />
            <button onClick={fetchData}>Refresh !</button>
            <button onClick={addTestIssue}>Add !</button>
            <IssueTable issues={issues} onDelete={deleteIssue} />
            <hr />
            <IssueAdd onSubmit={createIssue} />
        </div>
    );
}

function IssueFilter(props) {


    return (
        <div>Place Holder for IssueFilter.</div>
    );
}



function IssueTable(props) {
    const borderedStyle = { border: '1px solid silver', padding: 6 };
    const issueRows = props.issues.map(issue =>
        <IssueRow key={issue._id} issue={issue} onDelete={() => props.onDelete(issue._id)} />);
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
        <table className='bordered-table'>
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

function IssueRow(props) {
    const issue = props.issue;
    /*
// generation code
(function(obj){
    let out='';
    for (let p in obj){
        out+=`<td>{issue.${p}}</td>\n`;}
    console.log( out);
})(obj)
    */
    return (
        <tr>
            <td>{issue._id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
            <td>{issue.title}</td>
            <td><button onClick={props.onDelete}>X</button></td>
        </tr>
    );
}




ReactDOM.render(<React.StrictMode><IssueList /></React.StrictMode>, root);