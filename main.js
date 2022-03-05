const { query } = require('express');
const express = require('express');
const app = express();
let port = 8081;
app.use(express.static('static'));

app.get('/customers', function (req, res) {
    res.json(req.query);
});
app.get('/customers/:customerId', function (req, res) {
    res.send(req.params);
});

app.get('/secret', function (req, res) {
    res.status(503).send('it\'s a secert !');
});

app.listen(port, function startServer() {
    console.log(`App started at ${port}`);

});