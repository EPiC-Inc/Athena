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
//console.log(process.env.DATABASE_URL);

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
     extended: true
}));

// Functions
// Send a query to the database
function querydb(command) {
  // create a db connection client
  var query = client.query(command);
  var dbres = [];
  query.on('row', (row, res) => {
    dbres.push(row);
  });
  query.on('end', (result) => {
    console.log(dbres);
  });
  /*(err, res) => {
    dbrep = 'error';
    if (err) {console.log("database error: "+err);res = {rows:[]};};
    dbrep = res.rows;
    console.log(dbrep);
    return dbrep;
  }*/
}

function async_dbquery(req, res, qdb) {
  //console.log("Result of "+req.body.command+" : "+qdb(req.body.command));
  return new Promise(function(resolve, reject){
    // Do async
    //console.log('Promise finished:'+querydb(req.body.command));
    //dbres = result;
    resolve(qdb(req.body.command));
    //resolve(dbres);
  });
  //res.send(cmd);
}

// GET method route
app.get('/', function(req, res){
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
  console.log(querydb(req.body.command));
  async_dbquery(req, res, querydb).then(function(result){
    res.send(result);
    console.log("Promise verified:"+result);
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
