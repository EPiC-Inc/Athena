var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
const { Client } = require('pg'); // For the database

const port = process.env.PORT || 8080;

// To connect to database:
var client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
     extended: true
}));

// Functions
// Send a query to the database
function querydb(command) {
  // create a db connection client
  client.query(command, (err, res) => {
    dbrep = 'error';
    if (err) {console.log("database error: "+err);res = {rows:['ERROR']};};
    for (let row of res.rows) {
      //console.log(JSON.stringify(row));
    }
    dbrep = res.rows;
    console.log(dbrep);
    return dbrep;
  });
}

// GET method route
app.get('/', function(req, res){
  var page = 'INDEX';
  res.sendFile('index.html');
});

// POST method routing
app.post('/', function(req, res){
  //console.log(req.body);
  //parse the data sent
  var userData = req.body;
  console.log(userData);
  res.send('POST request to the homepage');
});

app.post('/database-entry', function(req, res){
  //
});

app.post('/database-query', function(req, res){
  res.send(querydb(req.body));
});

// ALL routing
app.all('/secret', function (req, res) {
  res.send('a');
});

// Server starting
http.listen(port, function () {
  console.log(`Listening on port ${http.address().port}`);
});

//querydb('select * from users');
