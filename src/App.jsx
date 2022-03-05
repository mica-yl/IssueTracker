const { useState, useEffect } = React;

const root = document.getElementById('root');

const issues_data = [
    {
        id: 1, status: 'Open', Owner: 'Ravan',
        created: new Date('2016-08-15'), effort: 5
        , completionDate: undefined, title: 'Error in Console when clicking add.',
    },

    {
        id: 2, status: 'Assigned', Owner: 'Eddie',
        created: new Date('2016-08-16'), effort: 14,
        completionDate: new Date('2016-05-16'), title: 'Missing bottom border on panel',
    },

];



function IssueList(props) {
    const [issues, setIssues] = useState([]);
    useEffect(function fetchData() {
        setTimeout(() => setIssues(data => data.concat(issues_data)), 3000)
    }
        , []);// run once ! 
    function addTestIssue() {
        addIssue({
            id:-666,status: 'New', Owner: 'Pieta', created: new Date(),
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

    return (
        <div>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <hr />
            <button onClick={addTestIssue}>Add !</button>
            <IssueTable issues={issues} />
            <hr />
            <IssueAdd onSubmit={addIssue} />
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
            <td>{issue.Owner}</td>
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
            title: title, Owner: owner,
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