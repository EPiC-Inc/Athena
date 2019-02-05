var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
const { Client } = require('pg'); // For the database
var dbres = '';

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
  var dbrep = '';
  // create a db connection client
  client.query(command, (err, res) => {
    dbrep = 'error';
    if (err) {console.log("database error: "+err);res = {rows:['ERROR']};};
    for (let row of res.rows) {
      //console.log(JSON.stringify(row));
    }
    dbrep = res.rows;
    //console.log(dbrep);
  });
  return dbrep;
}

function async_dbquery(req, res) {
  return new Promise(function(resolve, reject){
    // Do async
    result = querydb(req.body.command);
    console.log('Promise finished:'+result)
    //dbres = result;
    resolve(result);
  });
  //res.send(cmd);
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
  res.send('wip');
});

app.post('/database-query', function(req, res){
  var initializePromise = async_dbquery(req, res);
  initializePromise.then(function(result){
    console.log(result);
    res.send(result);
    console.log("Verified")
  }, function(err){
    console.log('Stuff broke');
  });
  //res.send('wip');
});

// ALL routing
app.all('/secret', function (req, res) {
  res.send('a');
});

// Server starting
http.listen(port, function () {
  console.log(`Listening on port ${http.address().port}`);
});

//console.log(querydb('select * from users'));
