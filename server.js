var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
const { Client } = require('pg'); // For the database

const port = process.env.PORT || 80;

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
     extended: true
}));

// Functions
// To connect to database:
var client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

// GET method route
app.get('/', function(req, res) {
  var page = 'INDEX';
  res.sendFile('index.html');
});

// POST method routing
app.post('/', function(req, res) {
  //console.log(req.body);
  //parse the data sent
  var userData = req.body;
  console.log(userData);
  res.send('POST request to the homepage');
});

app.post('/database-entry', function(req, res){
  //
});

// ALL routing
app.all('/secret', function (req, res) {
  res.send('a');
});

// Server starting
http.listen(port, function () {
  console.log(`Listening on port ${http.address().port}`);
});
