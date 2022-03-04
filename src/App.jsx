const {useState,useEffect} =React;

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

const counter = (function createCounter(){
    let count =0;
    return function counter(){
        return ++count;
    }
})();

function IssueList(props) {
    const [issues, setIssues] = useState(issues_data);
    const count=counter();
    function addTestIssue() {
        setIssues(data => data.concat({
            id:data.length + 1 ,
            status: 'New', owner: 'Pieta', created: new Date(),
            title: 'Completion date should be optional !',
        }));
    }
   if (count===1) {setTimeout(addTestIssue, 2000);}
   console.log(`[${count}] issueList is called .`)
   return (
        <div>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <hr />
            <IssueTable issues={issues} />
            <hr />
            <IssueAdd />
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


    return (
        <div>Place Holder for IssueAdd.</div>
    );
}


ReactDOM.render(<IssueList />, root);