const express = require('express');
const app = express();
let port = 8081;
app.use(express.static('static'));
app.listen(port, function () {
    console.log(`App started at ${port}`);

});