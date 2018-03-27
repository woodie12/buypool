const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

const users = require('./routes/users');
const requests = require('./routes/requests');
const connection = require('./connection');

app.use(express.static(__dirname + '/src'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', users);
app.use('/requests',requests);

http.createServer(app).listen(3000);
console.log("listen on port 3000");

module.exports = app;
