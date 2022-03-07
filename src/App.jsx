const { useState, useEffect } = React;

const root = document.getElementById('root');

function IssueList(props) {
    const [issues, setIssues] = useState([]);
    useEffect(fetchData, []);// run once ! 

    function fetchData() {
        fetch('/api/v1/issues',
            { method: 'GET' }).then(function (response) {
                return response.json();
            }).then(function (remote_data) {
                const new_data = remote_data.records;
                new_data.forEach(issue_jsonToJs);
                //setIssues(data => data.concat(new_data));
                setIssues(new_data);
            })
            .catch(err => console.error(err));
    }
    function issue_jsonToJs(issue) {
        // date returns as a string.
        // rewrite with Obj.assign ???
        if (issue.completionDate) {
            issue.completionDate = new Date(issue.completionDate);
        }
        issue.created = new Date(issue.created);
        return issue;
    }
    function addTestIssue() {
        addIssue({
            id: -666, status: 'New', owner: 'Pieta', created: new Date(),
            title: 'Completion date should be optional !',
        });
    }
    function addIssue(issue) {
        // id is ! isNaN ?
        // issue shouldn't be null or undefined.
        if (issue) {
            setIssues(function addIssue_safely(data) {
                return data.concat(
                    isNaN(issue.id) ? Object.assign({ id: data.length + 1, }, issue) : issue
                )
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
            .then(response => response.json())
            .then(issue_jsonToJs)
            .then(addIssue)
            .catch(err => console.log(err));

    }

    return (
        <div>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <hr />
            <button onClick={fetchData}>Refresh !</button>
            <button onClick={addTestIssue}>Add !</button>
            <IssueTable issues={issues} />
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
    const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
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
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
            <td>{issue.title}</td>
        </tr>
    );
}

function IssueAdd(props) {
    const [owner, setOwner] = useState('');
    const [title, setTitle] = useState('');
    /* TODO? : function need to be defined only once */
    function handleSubmit(event) {
        props.onSubmit({
            title: title, owner: owner,
            status: 'New',
            created: new Date(),
        });
        // clear state.
        setOwner('');
        setTitle('');
        event.preventDefault();
    }
    function handleChange(setter) {
        return (event) => setter(event.target.value);
    }

    return (
        <div>
            <form name='issueAdd' onSubmit={handleSubmit}>
                <input placeholder="Owner" value={owner} onChange={handleChange(setOwner)}></input>
                <input placeholder="Title" value={title} onChange={handleChange(setTitle)}></input>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}


ReactDOM.render(<IssueList />, root);