const root = document.getElementById('root');

function IssueList(props) {


    return (
        <div>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <hr />
            <IssueTable />
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


    return (
        <table style={{ borderCollapse: 'collapse', border: 1 }}>
            <thead>
                <tr>
                    <th style={borderedStyle}>Id</th>
                    <th style={borderedStyle}>Title</th>
                </tr>
            </thead>
            <tbody>
                <IssueRow > no ID</IssueRow>
                <IssueRow issue_id={1} >A : first issue</IssueRow>
                <IssueRow issue_id={2} >B : first issue</IssueRow>
            </tbody>
        </table>
    );
}

function IssueRow(props) {
    const borderedStyle = { border: '1px solid silver', padding: 4 };
    return (
        <tr>
            <td style={borderedStyle} >{props.issue_id}</td>
            <td style={borderedStyle} >{props.children}</td>
        </tr>
    );
}
IssueRow.propTypes = {
    issue_id: React.PropTypes.number.isRequired,
};

IssueRow.defaultProps = { issue_id: -666 };

function IssueAdd(props) {


    return (
        <div>Place Holder for IssueAdd.</div>
    );
}


ReactDOM.render(<IssueList />, root);