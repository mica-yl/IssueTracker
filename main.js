const { json } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
let port = 8081;


const issues = [
    {
        id: 1, status: 'Open', owner: 'Ravan',
        created: new Date('2016-08-15'), effort: 5
        , completionDate: undefined, title: 'Error in Console when clicking add.',
    },

    {
        id: 2, status: 'Assigned', owner: 'Eddie',
        created: new Date('2016-08-16'), effort: 14,
        completionDate: new Date('2016-05-16'), title: 'Missing bottom border on panel',
    },

];


app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/v1/issues', function get_issues(req, res) {
    const metadata = { total_count: issues.length };
    // pretty version
    // console.log(JSON.stringify({ _metadata: metadata, records: issues },null,' '))
    res.json({ _metadata: metadata, records: issues });
});

app.post('/api/v1/issues',function (req,res){
    const newIssue=req.body;
    newIssue.id=issues.length+1;
    newIssue.created=new Date();
    if (!newIssue.status){
        newIssue.status='New';
    }
    issues.push(newIssue);
    res.json(newIssue);
});




app.listen(port, function startServer() {
    console.log(`App started at ${port}`);

});